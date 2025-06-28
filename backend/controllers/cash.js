const XLSX = require('xlsx')
const { parse, eval } = require('expression-eval')

const mongoose = require('mongoose')

const CashStock = require('../models/cash_stock')
const CashData = require('../models/cash_data')
const CashHeader = require('../models/cash_header')
const CashTag = require('../models/cash_tag')
const FuturesData = require('../models/futures_data')
const FuturesStock = require('../models/futures_stock')

const CustomError = require('../error')

const calculateSma = (arr, days) => {
    if (!arr || arr.length < days) {
      return [];
    }
  
    let index = days - 1;
    const length = arr.length + 1;
      
    const simpleMovingAverages = [...Array(index).fill(null)];
    
    while (++index < length) {
  
      const daysSlice = arr.slice(index - days, index);
      const sum = daysSlice.reduce((prev, curr) => prev + curr, 0)
      simpleMovingAverages.push( (Math.round(((sum / days) + + Number.EPSILON) * 100 ) / 100) || 0 )
    }
  
    return simpleMovingAverages;
}


exports.uploadExcel = async(req, res, next) => {
    try {
        
        // console.time("Execution Time")
        let date = new Date(req.files.excel.name.split('.xlsx')[0] + ' GMT')
        const stocks = await CashStock.find().select('symbol').lean()

        const cashDataDates = await CashData.find({date: date}).select('stock -_id')

        const file = req.files.excel.path
        const workbook = XLSX.readFile(file, { sheetStubs: true })
        const sheets = workbook['SheetNames']

        let cashDatas = []

        for(let sheet of sheets){
            var worksheet = workbook.Sheets[sheet]
            let data = XLSX.utils.sheet_to_json(worksheet, {
                header: [
                    'symbol',
                    'date',
                    'prev_close',
                    'open_price',
                    'high_price',
                    'low_price',
                    'last_price',
                    'close_price',
                    'avg_price',
                    'ttl_trd_qnty',
                    'turnover_lacs',
                    'no_of_trades',
                    'deliv_qty',
                    'deliv_per',
                ],
                blankrows: false,
                raw: true
            })
            
            for(let d of data.slice(1)){
                if(d){
                    let data = {
                        date: date,
                        prev_close: parseFloat(d.prev_close) || 0,
                        open_price: parseFloat(d.open_price) || 0,
                        high_price: parseFloat(d.high_price) || 0,
                        low_price: parseFloat(d.low_price) || 0,
                        last_price: parseFloat(d.last_price) || 0,
                        close_price: parseFloat(d.close_price) || 0,
                        avg_price: parseFloat(d.avg_price) || 0,
                        ttl_trd_qnty: parseFloat(d.ttl_trd_qnty) || 0,
                        turnover_lacs: parseFloat(d.turnover_lacs) || 0,
                        no_of_trades: parseFloat(d.no_of_trades) || 0,
                        deliv_qty: parseFloat(d.deliv_qty) || 0,
                        deliv_per: parseFloat(d.deliv_per) || 0,
                    }
                    let stock = stocks.find(s => s.symbol === d.symbol)
                    if(!stock){
                        stock = await CashStock.create({symbol: d.symbol})
                    }
                    const futuresStock = await FuturesStock.findOne({symbol: d.symbol})
                    if(futuresStock){
                        await FuturesData.updateMany({ stock: futuresStock._id, 'data.date': date }, {
                            $set: { 'data.$.underlying_value': data.close_price }
                        })
                    }
                    data.stock = stock._id
                    const dateDataExists = cashDataDates.find(d => d.stock.toString() === stock._id.toString())
                    !dateDataExists && cashDatas.push(data)
                }
                
                // break
            }
            break
        }
        // console.log(cashDatas)
        cashDatas.length > 0 && await CashData.insertMany(cashDatas)
        // console.timeEnd("Execution Time")
        res.json({
            message: 'Stock Data has been added!'
        })
    } catch(err) {
        console.log(err)
        next(err)
    }
}

exports.uploadExcelForStock = async(req, res, next) => {
    try{
        const stock = await CashStock.findOne({symbol: req.body.stock})
        if(!stock) throw new CustomError('Stock not found!', 404)

        let stockData = await CashData.find({stock: stock._id}).select('-_id date')
        stockData = stockData.map(s => +s.date)

        const file = req.files.excel.path
        const workbook = XLSX.readFile(file, { sheetStubs: true, cellDates: true })
        const sheets = workbook['SheetNames']

        let data = []
        for(let sheet of sheets){
            var worksheet = workbook.Sheets[sheet]
            data = XLSX.utils.sheet_to_json(worksheet, {
                header: [
                    'symbol',
                    'date',
                    'prev_close',
                    'open_price',
                    'high_price',
                    'low_price',
                    'last_price',
                    'close_price',
                    'avg_price',
                    'ttl_trd_qnty',
                    'turnover_lacs',
                    'no_of_trades',
                    'deliv_qty',
                    'deliv_per',
                ],
                blankrows: false,
                raw: true
            })
            break
        }
        const cashDatas = []
        for(let d of data.slice(1)){
            d.date.setUTCHours(0, 0, 0, 0)
            d.date.setUTCDate((d.date.getUTCDate() + 1))
            const index = stockData.indexOf(+d.date)
            if(index === -1 && d) {
                const data = {
                    date: d.date,
                    prev_close: parseFloat(d.prev_close) || 0,
                    open_price: parseFloat(d.open_price) || 0,
                    high_price: parseFloat(d.high_price) || 0,
                    low_price: parseFloat(d.low_price) || 0,
                    last_price: parseFloat(d.last_price) || 0,
                    close_price: parseFloat(d.close_price) || 0,
                    avg_price: parseFloat(d.avg_price) || 0,
                    ttl_trd_qnty: parseFloat(d.ttl_trd_qnty) || 0,
                    turnover_lacs: parseFloat(d.turnover_lacs) || 0,
                    no_of_trades: parseFloat(d.no_of_trades) || 0,
                    deliv_qty: parseFloat(d.deliv_qty) || 0,
                    deliv_per: parseFloat(d.deliv_per) || 0,
                    stock: stock._id
                }
                cashDatas.push(data)
            }

            // break
        }
        cashDatas.length > 0 && await CashData.insertMany(cashDatas)
        res.json({
            message: 'Stock Data Uploaded Successfully!'
        })
    } catch(err) {
        console.log(err)
    }
}


// Stock Table Query

exports.getStocksTableData = async(req, res, next) => {
    try {
        const search = req.body.search
        const filterTags = req.body.filterTags
        const sortFields = req.body.sortFields
        const page = req.params.page

        let sortFieldQuery = { }
        sortFields.map(s => {
            
            sortFieldQuery = {
                ...sortFieldQuery,
                ...(s.id === 'no_of_entries' ? {'count' : s.desc ? -1 : 1} : {[s.id]: s.desc ? -1 : 1})
            }
        })
        
        const stocks = await CashData.aggregate([
            {
                $sort: { 'date': -1 }
            },
            {
                $group: {
                    _id: '$stock',
                    count: { $count: {} },
                    last_updated: { $first: '$date' }
                }
            },
            {
                $lookup: {
                    from: 'cash stocks',
                    localField: '_id',
                    foreignField: '_id',
                    as: '_id'
                }
            },
            {
                $unwind: {
                    path: '$_id', 
                    includeArrayIndex: 'num'
                }  
            },
            ...(search ? [{ $match: { '_id.symbol' : { $regex: search, $options: 'i' } } }] : []),
            ...(filterTags.length > 0 ? 
                [{
                    $match: { '_id.tags': { $in: filterTags } }
                },] :
                []
            ),
            {
                $facet: {
                    count : [{ $count: "count" }],
                    data: [
                        {
                            $sort: {  ...sortFieldQuery, '_id.symbol': 1,  }
                        },
                        {
                            $skip: page * 100
                        },
                        {
                            $limit: 100
                        },
                        {
                            $project: {
                                _id: '$_id._id',
                                num: '$_id.symbol',
                                name: '$_id.symbol',
                                no_of_entries: '$count',
                                last_updated: 1,
                                tags: '$_id.tags',
                                note: '$_id.note',
                                block: '$_id.block'
                            }
                        },
                    ]
                }
            },
            
        ])
        const totalCount = stocks[0].count[0].count || 1
        res.json({
            stocks: stocks[0].data,
            totalCount
        })
    } catch(err) {
        console.log(err)
    }
}

// Stock Table Query Ends

exports.getCashStockTags = async(req, res, next) => {
    try {
        let tags = await CashTag.find().select('name -_id').lean()
        tags = tags.map(t => t.name)
        res.json(
            tags
        )
    } catch(err) {
        console.log(err)
    }
}

exports.updateCashStockTags = async(req, res, next) => {
    try{
        let tags = req.body.tags
        await CashStock.findByIdAndUpdate(req.body.id, {
            tags: tags
        })

        let oldTags = await CashTag.find().select('name -_id').lean()
        oldTags = oldTags.map(t => t.name)
        let newTagsArr = [...new Set([...oldTags, ...tags])]
        newTags = newTagsArr.map(t => {
            return {
                name: t
            }
        })
        await CashTag.deleteMany()
        await CashTag.insertMany(newTags)
        res.json(
            newTagsArr
        )
    } catch(err) {
        console.log(err)
    }
}

exports.updateCashStockNote = async(req, res, next) => {
    try{
        await CashStock.findByIdAndUpdate(req.body.id, {
            note: req.body.value
        })
        res.json({
            message: 'Cash Stock Updated!'
        })
    } catch(err) {
        console.log(err)
    }
}

exports.updateBlockCashStock = async(req, res, next) => {
    try{
        await CashStock.findByIdAndUpdate(req.body.id, {
            block: !req.body.blockStatus
        })
        res.json({
            message: 'Block Status Updated Successfully!'
        })
    } catch(err) {
        console.log(err)
    }
}

exports.deleteStock = async(req, res, next) => {
    try {
        await CashStock.findByIdAndDelete(req.body.id)
        res.json({
            message: 'Cash Stock has been deleted Successfully!'
        })
    } catch(err) {
        console.log(err)
    }
}

exports.getStocksByPage = async(req, res, next) => {
    try {
        const page = parseInt(req.params.page) - 1
        const totalPages = await CashStock.countDocuments({})
        const stocks = await CashStock.find()
            .select('symbol')
            .sort({symbol: 1})
            .skip(page * 25)
            .limit(25)
            .lean()
        res.json({
            stocks,
            totalPages
        })
    } catch(err) {
        console.log(err)
    }
}

exports.getStocksBySearch = async(req, res, next) => {
    try{
        const stocks = await CashStock.find({symbol: { $regex:  req.query.searchStock, $options: 'i'}}).sort({symbol: 1}).lean()
        res.json(
            stocks
        )
    } catch(err) {
        console.log(err)
    }
}

exports.getStock = async(req, res, next) => {
    try {
        let stock = await CashStock.findOne({symbol: req.params.symbol})
        let data = await CashData.find({stock: stock._id}).sort({date: 1}).lean()

        const customHeaders = await CashHeader.find().sort({createdAt: 1}).lean()

        if(customHeaders.length > 0){
            customHeaders.map(h => {
                if(h.custom){
                    let formula = h.formula
                    data = data.map(d => {
                        let evalValue = eval(parse(formula), d)
                        d = { ...d, [formula]: (Math.round((evalValue + + Number.EPSILON) * 100 ) / 100) || null }
                        return d
                    })
                } else {
                    if(!(data.length < h.ma.days)){ 
                        const tempArray = data.map(d => d[h.ma.field])
                        const smaArray = calculateSma(tempArray, h.ma.days)
                        data = data.map((d, i) => {
                            d = {...d, [h.name]: smaArray[i]}
                            return d
                        })
                    }
                }
            })
        }
        res.json({
            data,
            customHeaders,
        })
    } catch(err) {
        console.log(err)
    }
}

exports.addCustomHeader = async(req, res, next) => {
    try{
        const custom = req.body.custom
        const formula = req.body.formula
        const days = req.body.days
        const field = req.body.field

        if(custom) {
            await CashHeader.create({
                name: formula.toLowerCase(),
                custom: custom,
                formula: formula.toLowerCase()
            })
        } else {
            const ma_field_name = `${field}_${days}_ma`
            await CashHeader.create({
                name: ma_field_name,
                ma: {
                    days: days,
                    field: field
                }
            })
        }

        res.json({
            message: 'Stock Custom Field Added!'
        })

    } catch(err) {
        console.log(err)
    }
}

exports.getCustomHeaders = async(req, res, next) => {
    try {
        const customHeaders = await CashHeader.find().select('-_id name').lean()
        res.json(
            customHeaders
        )
    } catch(err) {
        console.log(err)
    }
}

exports.deleteCustomHeader = async(req, res, next) => {
    try {   
        await CashHeader.findByIdAndDelete(req.body.id)
        res.json({
            message: 'Stock Custom Field deleted!'
        })
    } catch(err) {
        console.log(err)
    }
}