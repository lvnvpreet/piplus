const XLSX = require('xlsx')
const {spawnSync} = require('child_process')

const OptionStock = require('../models/option_stock')
const OptionData = require('../models/option_data')

const CustomError = require('../error')

function reverseString(str) {
    return str.split("").reverse().join("");
}

exports.uploadExcel = async(req, res, next) => {
    try {
        const date = new Date(req.files.excel.name.split('.xlsx')[0] + ' GMT')

        const createdDate = new Date()
        const stocks = await OptionStock.find().lean()
        const stocksObj = {}
        stocks.map(stock => stocksObj[stock.symbol] = stock._id)

        const file = req.files.excel.path
        const workbook = XLSX.readFile(file, { sheetStubs: true })
        const sheets = workbook['SheetNames']
        const sheet = sheets[0]
        const worksheet = workbook.Sheets[sheet]

        const readData = XLSX.utils.sheet_to_json(worksheet, {
            header: [
                'contract_id',
                'date',
                'CLOSE_PRIC',	
                'SETTLEMENT',	
                'NET_CHANGE',
                'oi',
                'TRADED_QUA',
                'TRD_NO_CON',
                'UNDRLNG_ST',
                'NOTIONAL_V',
                'PREMIUM_TR'
            ],
            blankrows: false,
            raw: true
        })

        const newOptionsData = []
        for(const data of readData.slice(1)){
            if(data){
                const cleanId = data.contract_id.slice(6)
                const reversedCleanId = reverseString(cleanId)
                
                const reveredArrr =  reversedCleanId.split('-')
                const array = cleanId.split('-')
                let stock = array[0].slice(0, -2)
                const expiryDate = new Date(reverseString(reveredArrr[2]).slice(-2) + '-' +  reverseString(reveredArrr[1]) + '-' + reverseString(reveredArrr[0]).slice(0, 4)+ ' GMT')
                const type  = array[2].slice(4, 6)
                const strikePrice = array[2].slice(6, array[2].length)

                if(reveredArrr.length > 3){
                    let tempStock = reveredArrr[2].slice(2)
                    for(let i = 3; i < reveredArrr.length; i++){
                        tempStock = tempStock + '-' + reveredArrr[i]
                    }
                    stock = reverseString(tempStock.trim())
                }

                if(!stocksObj[stock]){
                    const stockCreated = await OptionStock.create({ symbol: stock })
                    stocksObj[stock] = stockCreated['_id']
                }
                
                optionRecords = {
                    [type]: {
                        open_interest: data['oi'],
                        settlement: data['SETTLEMENT'],
                        volume: data['TRD_NO_CON'],
                        last_price: data['CLOSE_PRIC'],
                        change: data['NET_CHANGE'],
                        IV: data['NOTIONAL_V'],
                        PREMIUM_TR: data['PREMIUM_TR'],
                        TRADED_QUA: data['TRADED_QUA']
                    }
                }
                
                const existingDataIndex = newOptionsData
                    .findIndex(d => d.stock == stocksObj[stock] && d.expiry_date.getTime() == (new Date(expiryDate)).getTime())

                if(existingDataIndex === -1){
                    newOptionsData.push({
                        date,
                        expiry_date: new Date(expiryDate),
                        underlying_value: data['UNDRLNG_ST'],
                        stock: stocksObj[stock],
                        data: [{
                            'strike_price': strikePrice,
                            ...optionRecords
                        }],
                        createdAt: createdDate
                    })
                    continue
                } else {
                    const strikePriceIndex = newOptionsData[existingDataIndex]['data'].findIndex(d => d.strike_price === strikePrice)
                    if(strikePriceIndex === -1){
                        newOptionsData[existingDataIndex]['data'].push({
                            strike_price: strikePrice,
                            ...optionRecords
                        })
                        continue
                    }
                    newOptionsData[existingDataIndex]['data'][strikePriceIndex] = {
                        ...newOptionsData[existingDataIndex]['data'][strikePriceIndex],
                        ...optionRecords
                    }
                    
                }
            }
        }
        await OptionData.insertMany(newOptionsData)

        res.json({
            message: 'Data uploaded successfully!'
        })
    } catch(err) {
        console.log(err)
    }
}

exports.checkOptionStock = async(req, res, next) => {
    try{
        // maybe change it in future to make it stock schema independent
        const stock = await OptionStock.findOne({symbol: req.params.symbol})
        let found = false
        if(stock) found = true
        res.json(
            found
        )
    } catch(err){
        console.log(err)
    }
}

exports.getOptionsStocks = async(req, res, next) => {
    try{
        const option_stocks = await OptionStock.find().select('symbol').sort('symbol').lean()
        res.json(
            option_stocks
        )
    } catch(err){
        console.log(err)
    }
}

exports.getOptionsStockData = async(req, res, next) => {
    try{
        const stock = await OptionStock.findOne({symbol: req.params.symbol}).select('_id')
        let option_last_date = await OptionData.find({stock: stock._id}).sort({createdAt: -1}).limit(1).select('createdAt -_id')
        option_last_date = option_last_date[0]?.createdAt
        const options_data = await OptionData.aggregate([
            { $match: {  
                // date:  option_last_date, 
                stock: stock._id 
            } },
            { $unwind: '$data' },
            {
                $project: {
                    date: 1,
                    expiry_date: 1,
                    underlying_value: 1, 
                    strike_price: '$data.strike_price',
                    data: 1,
                }
            },
            {
                $project: { 
                    'data._id': 0,
                    'data.strike_price': 0
                }
            },
            {
                $addFields: {
                    data: { $objectToArray: "$data" }
                }
            },
            {
                $unwind: '$data'
            },
            {
                $project: {
                    date: 1,
                    expiry_date: 1,
                    underlying_value: 1,
                    strike_price: 1,
                    type: '$data.k',
                    oi: '$data.v.open_interest',
                    change_in_oi: '$data.v.change_in_OI',
                    volume: '$data.v.volume',
                    iv: '$data.v.IV',
                    ltp: '$data.v.last_price',
                    change_in_ltp: { $round : ['$data.v.change', 2]},
                    magic_no: {
                        $round: [ { $divide: [ '$data.v.change_in_OI',  
                            {
                                $cond: [ { $eq: ["$data.v.volume", 0] }, 1, "$data.v.volume"]
                            }
                        ]}, 2]  
                    },
                    settlement: '$data.v.settlement',
                    PREMIUM_TR: '$data.v.PREMIUM_TR',
                    TRADED_QUA: '$data.v.TRADED_QUA'
                }
            },
            {
                $sort: { expiry_date: 1 }
            }
        ])
        res.json({
            updatedDate:option_last_date, 
            optionData: options_data
        })
    } catch(err) {
        console.log(err)
    }
}

exports.deleteOptionsStock = async(req, res, next) => {
    try{
        await OptionStock.findOneAndDelete({symbol: req.body.symbol})
        res.json({
            message: 'Stock has been deleted Successfully!'
        })
    } catch(err) {
        console.log(err)
    }
}

exports.getOptionsChartData = async(req, res, next) => {
    try{
        const option_stock = await OptionStock.findOne({symbol: req.body.stock})
        if(!option_stock) throw new CustomError('Stock not found!', 404)
        const option_expiry_dates = await OptionData.distinct('expiry_date', {
            stock: option_stock
        })
        const oiFilter = req.body.oiFilter || 0
        const monthFilter = req.body.monthFilter
        let date = req.body.date
        if(!date && option_expiry_dates.length > 0) date = option_expiry_dates[0]

        let months = await OptionData.aggregate([
            { $match: { stock: option_stock._id, expiry_date:  new Date(date) } },
            {
                $sort: {
                    date: 1,
                }
            },
            { "$project": {
                date: 1,
                "month": {
                    $arrayElemAt: [
                      ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                      { "$month": "$date" }
                    ]
                  },
            }},
            { "$group": { 
                "_id": null, 
                "months": { "$addToSet": '$month'}
            }}
        ])
        months = months[0].months

        const option_datas = await OptionData.aggregate([
            { $match: { stock: option_stock._id, expiry_date:  new Date(date) } },
            { 
                $unwind: '$data'
            },
            {
                $project: {
                    date: 1,
                    "month": {
                        $arrayElemAt: [
                          ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                          { "$month": "$date" }
                        ]
                    },
                    expiry_date: 1,
                    // underlying_value: ['$underlying_value', '$date'], 
                    strike_price: '$data.strike_price',
                    data: 1,
                }
            },
            { $match: {  
                expiry_date:  new Date(date),
                ...(
                    monthFilter ? { month: monthFilter }  : {}
                ),
            } },
            {
                $project: { 
                    'data._id': 0,
                    'data.strike_price': 0
                }
            },
            {
                $addFields: {
                    data: { $objectToArray: "$data" }
                }
            },
            {
                $unwind: '$data'
            },
            {
                $match: { 'data.v.open_interest': { $gt: parseInt(oiFilter) } }
            },
            {
                $project: {
                    date: 1,
                    expiry_date: 1,
                    // underlying_value: 1,
                    // oi: '$data.v.open_interest',
                    name: { $concat: [ { $toString :  '$strike_price'}, ' ', '$data.k']},
                    data: 1
                }
            },
            {
                $sort: { date: 1}
            },
            {
                $group: {
                    _id: '$name',
                    oi_data: { $push : {
                        x:  '$date', 
                        y: "$data.v.open_interest",      
                    }
                    },
                    magic_no_data: { $push: {
                            x:  '$date',
                            y: {
                                $round: [ { $divide: [ '$data.v.change_in_OI',  
                                {
                                    $cond: [ { $eq: ["$data.v.volume", 0] }, 1, "$data.v.volume"]
                                }
                            ]}, 2]       
                            }
                        }
                    },
                    magic_no_oi_data: {
                        $push: {
                            x: '$date',
                            y: {
                                $round: [ { $divide: [ 
                                    '$data.v.open_interest' ,
                                    {
                                        $cond: [ { $eq: ["$data.v.volume", 0] }, 1, "$data.v.volume"]
                                    }
                                ] } ]
                            }
                        }
                    }
                }
            },
            {
                $facet: {
                    'magicNoOiDataRecords': [
                        {
                            $project: {
                                _id: 0,
                                label: '$_id',
                                data: '$magic_no_oi_data',
                                yAxisID: 'y',
                                pointStyle: 'circle',
                                pointRadius: 4,
                                pointBackgroundColor: '#fff',
                                borderColor: {
                                    $cond: [ 
                                        { $eq: 
                                            [{ $strcasecmp: [
                                                {
                                                    $substrBytes: [
                                                        "$_id", { $subtract: [ { $strLenBytes: "$_id" }, 2 ]}, 2
                                                    ]
                                                },
                                                'CE'
                                            ]}, 0] 
                                        },
                                        '#D70070',
                                        '#00a9e0'
                                    ]
                                }
                            }
                        }
                    ],
                    'oiRecords': [
                        {
                            $project: {
                                _id: 0,
                                label: '$_id',
                                data: '$oi_data',
                                yAxisID: 'y',
                                pointStyle: 'circle',
                                pointRadius: 4,
                                pointBackgroundColor: '#fff',
                                borderColor: {
                                    $cond: [ 
                                        { $eq: 
                                            [{ $strcasecmp: [
                                                {
                                                    $substrBytes: [
                                                        "$_id", { $subtract: [ { $strLenBytes: "$_id" }, 2 ]}, 2
                                                    ]
                                                },
                                                'CE'
                                            ]}, 0] 
                                        },
                                        '#D70070',
                                        '#00a9e0'
                                    ]
                                }
                            }
                        },
                        {
                            $sort: { label: 1 }
                        }
                    ],
                    'magicNoRecords': [
                        {
                            $project: {
                                _id: 0,
                                label: '$_id',
                                data: '$magic_no_data',
                                yAxisID: 'y',
                                pointStyle: 'circle',
                                pointRadius: 4,
                                pointBackgroundColor: '#fff',
                                borderColor: {
                                    $cond: [ 
                                        { $eq: 
                                            [{ $strcasecmp: [
                                                {
                                                    $substrBytes: [
                                                        "$_id", { $subtract: [ { $strLenBytes: "$_id" }, 2 ]}, 2
                                                    ]
                                                },
                                                'CE'
                                            ]}, 0] 
                                        },
                                        '#D70070',
                                        '#00a9e0'
                                    ]
                                }
                            }
                        },
                        {
                            $sort: {  label: 1 }
                        }
                    ]
                }
            },
            
        ])
        const underlying_value_data = await OptionData.aggregate([
            {
                $project: {
                    stock: 1,
                    expiry_date: 1,
                    date: 1,
                    underlying_value: 1,
                    "month": {
                        $arrayElemAt: [
                          ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                          { "$month": "$date" }
                        ]
                    },
                }
            },
            { $match: { 
                stock: option_stock._id, 
                expiry_date:  new Date(date) , 
                ...(
                    monthFilter ? { month: monthFilter }  : {}
                ), 
                }
            },
            {
                $sort: { date : 1 }
            },
            {
                $group: {
                    _id: null,
                    data: { $push: { x: '$date', y: '$underlying_value' } } 
                }
            },
            {
                $project: {
                    _id: 0,
                    label: 'Underlying Value',
                    borderColor: '#000000',
                    yAxisID: 'y1',
                    data: 1,
                    pointStyle: 'circle'
                }
            },
        ])
        res.json({
            months: months,
            oiRecords: option_datas[0].oiRecords, // facet after match returns an array
            magicNoRecords: option_datas[0].magicNoRecords,
            magicNoOiDataRecords: option_datas[0].magicNoOiDataRecords,
            expiry_dates: option_expiry_dates,
            underlying_value_records: underlying_value_data[0],
            optionStock: option_stock
        })
    } catch(err){
        next(err)
    }
}

exports.scrapeOptionStock = async(req, res, next) => {
    try{
        const symbol = req.body.symbol
        const py = spawnSync(`${process.env.PYTHON_VERSION}`, ['./scraper/single.py', symbol])
        // if(py.stderr.toString()){
        //     console.log(py.stderr.toString())
        //     throw new CustomError('Script Error.Please try again!', 406)
        // }
        res.json({
            message: 'Data Scraped Successfully!'
        })
    } catch(err) {
        console.log(err)
        next(err)
    }
}