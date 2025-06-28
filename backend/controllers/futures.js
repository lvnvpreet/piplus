const XLSX = require('xlsx')
const ObjectId = require('mongoose').Types.ObjectId

const CashStock = require('../models/cash_stock')
const OptionStock = require('../models/option_stock')
const FuturesStock = require('../models/futures_stock')
const FuturesData = require('../models/futures_data')
const CashData = require('../models/cash_data')

const CustomError = require('../error')

const calcChange = (data, i, key) => {
  return Math.round(((data[i][key] - data[i - 1][key]) + Number.EPSILON) * 100) / 100 || 0
}

exports.uploadExcel = async(req, res, next) => {
  try{
    let date = new Date(req.files.excel.name.split('.xlsx')[0] + ' GMT')

    const existingDate = await FuturesData.findOne({ data: { $elemMatch: { date : date } } })
    if(existingDate){
      throw new CustomError('Data for date already exists!', 403)
    }

    const file = req.files.excel.path
    const workbook = XLSX.readFile(file, { sheetStubs: true })
    const sheets = workbook['SheetNames']

    const cashDatas = await CashData.find({ date: date }).populate('stock')
    const cashDatasObj = {}
    cashDatas.map(c => cashDatasObj[c.stock.symbol] = c.close_price)

    const stocks = await FuturesStock.find().lean()
    const stocksObj = {}
    stocks.map(s => stocksObj[s.symbol] = s._id)

    const worksheet = workbook.Sheets[sheets[0]]
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: [
          'stock',
          'stock_id',
          'date',
          'month',
          'close_price',
          'settlement',
          'net_change',
          'oi_no_con',
          'quantity',
          'trd_no_con',
          'value',
      ],
      blankrows: false,
      raw: false,
    })
    
    for(let d of data.slice(1)){
      if(d){
          let stock = d.stock
          const month = new Date(d.month)
          d = { 
            date: date,
            close_price: parseInt(d.close_price) || 0,
            settlement: parseInt(d.settlement) || 0,
            net_change: parseFloat(d.net_change) || 0,
            oi_no_con: parseInt(d.oi_no_con) || 0,
            quantity: parseInt(d.quantity) || 0,
            trd_no_con: parseInt(d.trd_no_con) || 0,
            value: parseInt(d.value) || 0,
            underlying_value: cashDatasObj[stock] || null
          }
          if(!stocksObj[stock]){
            const newStock = await FuturesStock.create({ symbol: stock })
            stocksObj[stock] = newStock._id
          }
          const futuresData = await FuturesData.findOne({ stock: stocksObj[stock], month: month })
          if(!futuresData){
            await FuturesData.create({ stock: stocksObj[stock], month: month, data: [d] })
          } else {
            futuresData.data.push(d)
            await futuresData.save()
          }
          // break
        }
      }

    res.json({
      message: 'Futures Data Uploaded Successfully!'
  })
  } catch(err) {
    console.log(err)
    next(err)
  }
}

exports.getAllStocks = async(req, res, next) => {
  try {
    const stocks = await FuturesStock.find().sort('symbol')
    res.json(
      stocks
    )
  } catch(err){
    console.log(err)
  }
}

exports.deleteStock = async(req, res, next) => {
  try {
    await FuturesStock.findOneAndDelete({symbol: req.body.stock})
    res.json({
      message: 'Futures Stock deleted Successfully!'
    })
  } catch(err) {
    console.log(err)
  }
}

exports.getMonths = async(req, res, next) => {
  try{
    let months = await FuturesData.aggregate([
      {
        $group: {
          _id: "$month",
        }
      },
      {
        $sort: { _id: 1 }
      },
    ])
    months = months.map(m => m._id)
    res.json(
      months
    )
  } catch(err) {
    console.log(err)
  } 
}

exports.getStockData = async(req, res, next) => {
  try {
    const month = new Date(req.body.month)
    const symbol = req.params.symbol
    const stock = await FuturesStock.findOne({symbol: symbol})
    if(!stock){
      throw new CustomError('Stock not found!', 404)
    }
    const stockData = await FuturesData.aggregate([
      {
        $match: { stock: ObjectId(stock._id), month: month  }
      },
      {
        $unwind: "$data"
      },
      {
        $sort: { 'data.date': 1 }
      },
      {
        $project: {
          _id: 0,
          month: 1,
          date: '$data.date',
          close_price: "$data.close_price",
          settlement: "$data.settlement",
          net_change: "$data.net_change",
          oi_no_con: "$data.oi_no_con",
          quantity: "$data.quantity",
          trd_no_con: "$data.trd_no_con",
          value: "$data.value",
          underlying_value: '$data.underlying_value'
        }
      }
    ])
    for(let i=0; i<stockData.length; i++){
      stockData[i]['pd'] = Math.round(((stockData[i]['close_price'] - stockData[i]['underlying_value']) + Number.EPSILON) * 100) / 100 || 0

      
      if(stockData[i - 1] !== undefined){
        stockData[i]['chg_in_pd'] = calcChange(stockData, i, 'pd')
        stockData[i]['chg_in_oi'] = calcChange(stockData, i, 'oi_no_con')
        stockData[i]['chg_in_close_price'] = calcChange(stockData, i, 'close_price') 
        stockData[i]['chg_in_underlying_value'] = calcChange(stockData, i, 'underlying_value') 
        stockData[i]['money_flow'] = stockData[i]['chg_in_oi'] * stockData[i]['chg_in_close_price']
        if(stockData[i]['underlying_value']){
          switch(true){
            case !stockData[i]['chg_in_oi']:
              stockData[i]['conclusion'] = '-'
              stockData[i]['summary'] = '-'
              stockData[i]['remarks'] = '-'
              break
            case stockData[i]['chg_in_oi'] >= 0 && stockData[i]['chg_in_close_price'] >= 0:
              stockData[i]['conclusion'] = 'Long'
              stockData[i]['summary'] = 'Bullish'
              stockData[i]['remarks'] = 'During Trend'
              if(stockData[i]['chg_in_underlying_value'] < 0){
                stockData[i]['remarks'] = 'Near Bottom'
              }
              stockData[i]['color'] = 1
              break
            case stockData[i]['chg_in_oi'] >= 0 && stockData[i]['chg_in_close_price'] < 0:
              stockData[i]['conclusion'] = 'Short'
              stockData[i]['summary'] = 'Bearish'
              stockData[i]['remarks'] = 'Near Peak'
              if(stockData[i]['chg_in_underlying_value'] < 0){
                stockData[i]['remarks'] = 'During Trend'
              }
              stockData[i]['color'] = 0
              break
            case stockData[i]['chg_in_oi'] < 0 && stockData[i]['chg_in_close_price'] < 0:
              stockData[i]['conclusion'] = 'Long Profit Booking'
              stockData[i]['summary'] = 'Bearish'
              stockData[i]['remarks'] = 'Trend Reversal Possible'
              if(stockData[i]['chg_in_underlying_value'] < 0){
                stockData[i]['remarks'] = 'Bearish Trend will Continue'
                stockData[i]['conclusion'] = 'Long Covering'
              }
              stockData[i]['color'] = 0
              break
            case stockData[i]['chg_in_oi'] < 0 && stockData[i]['chg_in_close_price'] >= 0:
              stockData[i]['conclusion'] = 'Short Covering'
              stockData[i]['summary'] = 'Bullish'
              stockData[i]['remarks'] = 'Bullish Trend will Continue'
              if(stockData[i]['chg_in_underlying_value'] < 0){
                stockData[i]['remarks'] = 'Bearish Trend will Continue'
                stockData[i]['conclusion'] = 'Trend Reversal Possible'
              }
              stockData[i]['color'] = 1
              break
            default:
              break
          }
        }
      }
      if(stockData[i]['chg_in_pd'] !== undefined){
        stockData[i]['pd_conclusion'] = false
        if((stockData[i]['chg_in_pd'] >= 0 && stockData[i]['chg_in_close_price'] >= 0) || 
            (stockData[i]['chg_in_pd'] < 0 && stockData[i]['chg_in_close_price'] < 0)){
            stockData[i]['pd_conclusion'] = true
        }
      }
    }
    res.json(stockData)
  } catch(err) {
    console.log(err)
  }
}

exports.checkIfOtherStockExists = async(req, res, next) => {
  try{
    const symbol = req.params.symbol
    const cashStock = await CashStock.findOne({symbol: symbol})
    const optionStock = await OptionStock.findOne({symbol: symbol})
    const LinksArray = []
    // console.log(cashStock)
    cashStock ? LinksArray.push(true) : LinksArray.push(false)
    optionStock ? LinksArray.push(true) : LinksArray.push(false)
    res.json(
      LinksArray
    )
  } catch(err) {
    console.log(err)
  }
}