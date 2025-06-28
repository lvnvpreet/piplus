const { parse, eval } = require('expression-eval')

const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Alert = require('../models/alert')
const Notification = require("../models/notification")

const CashStock = require('../models/cash_stock')
const CashData = require('../models/cash_data')
const CashHeader = require('../models/cash_header')

const CustomError = require('../error')

const getDates = (startDate, stopDate) => {

    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
  
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

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
  
const calculateCustomFields = (customHeaders, stocks) => {
    let updatedStocks = []
    customHeaders.map(h => {
        updatedStocks = stocks.map(stock => {
            if(h.custom){
                stock.data.map(d => {
                    let evalValue = eval(parse(h.formula), d)
                    d[h.formula] = (Math.round((evalValue + + Number.EPSILON) * 100 ) / 100) || null
                })
            } else {
                if(!(stock.data.length < h.ma.days)){ 
                    const tempArray = stock.data.map(d => d[h.ma.field])
                    const smaArray = calculateSma(tempArray, h.ma.days)
                    stock.data.map((d, i) => d[h.name] = smaArray[i] )
                }
            }
            return stock
        })
    })
  
    return updatedStocks
  }

const getPrevDataIndex = (index, day) => {
    let prevDataIndex = index - day
    if(!(prevDataIndex >= 0)){
        prevDataIndex = index
    }
    return prevDataIndex
}

const checkConditions = (index, data, conditions, limit) => {
    let limitSatisfaction = 0
    for(let condition of conditions){
        let field2 = condition.num_field
        if(!(condition.num)){
            const prevDataIndex = getPrevDataIndex(index, condition.field2Day)
            field2 = data[prevDataIndex][condition.field2]
        }
        const prevDataIndex = getPrevDataIndex(index, condition.field1Day)
        switch(condition.operator){
            case 1:
                data[prevDataIndex][condition.field1] > ( condition.multiplier * field2) && limitSatisfaction++
                break
            case -1:
                data[prevDataIndex][condition.field1] < ( condition.multiplier * field2 ) && limitSatisfaction++
                break
        }
  
        if(limitSatisfaction >= limit){
            return true
        }
    }
    return false
}

exports.getAllAlerts = async(req, res, next) => {
    try{
        const alerts = await Alert.find().sort({color: 1}).lean()
        res.json(
            alerts
        )
    } catch(err) {
        console.log(err)
    }
}

exports.addAlert = async(req, res, next) => {
    try {
        await Alert.create({
            name: req.body.name,
            tags: req.body.tags,
            color: req.body.color
        })
        res.json({
            message: 'Alert Added Successfully!'
        })
    } catch(err) {
        console.log(err)
    }
}

exports.scanByAlert = async(req, res, next) => {
    try {
        const fromDate = new Date(req.body.fromDate) 
        const toDate = new Date(req.body.toDate) 
        if(fromDate.getTime() > toDate.getTime()){
            throw new CustomError('From Date cannot be larger than to Date!', 406)
        }
        fromDate.setUTCHours(0, 0, 0, 0)
        toDate.setUTCHours(0, 0, 0, 0)
        // console.time("Execution Time 2")

        const dateArray = getDates(fromDate, toDate)

        const alert = await Alert.findById(req.body.id).lean()
        const customHeaders = await CashHeader.find().sort({createdAt: 1}).lean()
        const cashFilterQuery = {
            ...(alert.tags.length > 0 ? { tags: { $in: alert.tags } } : {}),
            block: false
        }
        // Remove limit soon
        let cashStocks = await CashStock.find(cashFilterQuery).lean().limit(10)
        cashStocks = cashStocks.map(c => c._id)
        let stocksData = await CashData.aggregate([
            {
                $match: { 
                    date: { $lte: toDate },
                    ...( cashStocks.length > 0 ?  {stock: {$in: cashStocks}} : {}) 
                }
            },
            {
                $sort: { 'date': 1 }
            },
            {
                $group:{ _id: '$stock', data: { $push : "$$ROOT" } },
            },
        ])
        if(customHeaders.length > 0){
            stocksData = calculateCustomFields(customHeaders, stocksData)
        }
        let noData = false
        let notifications = []
        if(stocksData.length === 0) noData = true
        if(alert?.conditions?.length > 0){
            for(let i=0; i < stocksData.length; i++){
                const stock = stocksData[i]
                    if(stock?.data?.length > 0){
                    for(let date of dateArray){
                        const stockIndex = stock.data.findIndex(d => d.date.getTime() === date.getTime())
                        if(stockIndex !== -1){
                            checkConditions(stockIndex, stock.data, alert.conditions, alert.limit) && notifications.push({
                                    date: date,
                                    alert: alert._id, 
                                    stock: stocksData[i]._id
                                })
                        } 
                    }  
                }
            }
        }
        let message = 'No Data Available'
        let empty = true
        if(!noData){
            await Notification.deleteMany({date: { $in : dateArray }, alert: alert._id})
            notifications.length > 0 && await Notification.insertMany(notifications)
            message = 'Scanned for Alerts Successfully!'
            empty = false
        }
        // console.timeEnd("Execution Time 2")

        res.json({
            message: message,
            empty: empty
        })
        
        
    } catch(err) {
        console.log(err)
    }
}

exports.getAlert = async(req, res, next) => {
    try{
        const alert = await Alert.findById(req.params.id).lean()
        res.json(
            alert
        )
    } catch(err) {
        console.log(err)
    }
}

exports.saveAlert = async(req, res, next) => {
    try{
        const limit = req.body.limit
        const description = req.body.description
        const conditions = req.body.conditions

        await Alert.findByIdAndUpdate(req.body.id, {
            limit: limit,
            description: description,
            conditions: conditions
        })
        res.json({
            message: 'Alert Updated Successfully!'
        })
    } catch(err) {
        console.log(err)
    }
}

exports.deleteAlert = async(req, res, next) => {
    try{
        await Alert.findOneAndDelete({_id: req.body.id})
        res.json({
            message: 'Alert Deleted Successfully!'
        })
    } catch(err) {
        console.log(err)
    }
}

exports.getAlertScannedDays = async(req, res, next) => {
    try{
        const alert = req.body.alert
        const currentMonth = req.body.month
        let days = await Notification.aggregate([
            // {
            //     $match: { alert: ObjectId(alert) }
            // },
            {
                $project: { month: { $month: '$date' }, alert: 1, day: {$dayOfMonth: '$date'} }
            }, 
            {
                $match: { month: currentMonth, alert: ObjectId(alert) }
            },
            {
                $group: { _id: '$day' }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $group: { _id: null, days: { $push: '$_id' } }
            },
            {
                $project: {
                    _id: 0,
                    days: 1
                }
            }
        ])
        if(days[0]?.days?.length > 0 ){
            days = days[0].days
        }
        res.json(
            days
        )
    } catch(err) {
        console.log(err)
    }
}

exports.cloneAlert = async(req, res, next) => {
    try{
        let alert = await Alert.findById(req.body.id)
        let newAlert = {
            name: req.body.name,
            limit: alert.limit,
            conditions: alert.conditions,
            description: alert.description,
            tags: req.body.tags,
            color: req.body.color
        }
        newAlert = await Alert.create(newAlert)
        res.json({
            alert: newAlert,
            message: 'Alert Cloned Successfully!'
        })
    } catch(err) {
        console.log(err)
    }
}