const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const Notification = require("../models/notification")

const CashData = require('../models/cash_data')

exports.getNotifications = async(req, res, next) => {
    try {
        const alert_id = req.body.alertId
        const date = new Date(req.body.date)
        date.setUTCHours(0, 0, 0, 0)

        let notifications = []

        const prev15dates = await CashData.aggregate([
            {
                $match: { date: { $lte: date } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date"} }
                }
            },
            {
                $sort: { _id: -1 }
            },
            {
                $limit: 14
            }
        ])
        let prev15Date = prev15dates[prev15dates.length - 1]?._id
        if(prev15Date){
            prev15Date = new Date(prev15Date)
            prev15Date.setUTCHours(0,0,0,0)
        } else {
            prev15Date = date
        }
        notifications = await Notification.aggregate([
            {
                $match: { date: { $gte: prev15Date, $lte: date}, alert: ObjectId(alert_id) }
            },
            {
                $group:{
                    _id: {stock: "$stock"},
                    count: { $sum: 1 },
                    data: { $push: "$$ROOT" }
                },
            },
            {
                $match: { 'data.date': date }
            },
            {
                $lookup: {
                    from: 'cash stocks',
                    localField: "_id.stock",
                    foreignField: "_id",
                    as: "_id.stock"
                }
            },
            {
                $unwind:"$_id.stock" 
            },
            {
                $lookup: {
                    from: 'cash datas',
                    localField: "data.stock",
                    foreignField: "stock",
                    as: "data"
                }
            },
            {
                $sort: { 'data.date': 1 }
            },
            {
                $project:{
                    _id: 0,
                    'stock': '$_id.stock.symbol',
                    'lastRecord': { $last: '$data' },
                    'currentRecord': {
                        $filter: {
                           input: "$data",
                           as: "stock_data",
                           cond: { $eq: [ "$$stock_data.date", date ] }
                        }
                    },
                    count: 1,
                }
            },
            {
                $unwind: '$currentRecord'
            },
            {
                $project: {
                    count: 1,
                    stock: 1,
                    percentage: { $round: [{
                        $multiply: [{
                            $divide: [{ 
                                $subtract: [ '$lastRecord.avg_price', '$currentRecord.avg_price' ]},  
                                '$currentRecord.avg_price'
                            ]}, 
                            100 
                        ]}, 2]
                    }
                }
            },
            {
                $sort: { count : -1, stock: 1 }
            }
        ])
        res.json(
            notifications
        )
    } catch(err) {
        console.log(err)
    }
}

exports.filterNotifications = async(req, res, next) => {
    try{
        const date =  new Date(req.body.date)
        const notInFilter = req.body.notInFilter
        let matchFilters = req.body.matchFilters
        let notifications = []

        date.setUTCHours(0, 0, 0, 0)

        const prev15dates = await CashData.aggregate([
            {
                $match: { date: { $lte: date } }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date"} }
                }
            },
            {
                $sort: { _id: -1 }
            },
            {
                $limit: 14
            }
        ])

        let prev15Date = prev15dates[prev15dates.length - 1]?._id
        if(prev15Date){
            prev15Date = new Date(prev15Date)
            prev15Date.setUTCHours(0,0,0,0)
        } else {
            prev15Date = date
        }

        let notInFilterStocks = []
        if(notInFilter){
            notInFilterStocks = await Notification.aggregate([
                {
                    $match: { date: { $gte: prev15Date, $lte: date}, alert: ObjectId(notInFilter) }
                },
                {
                    $group:{
                        _id: {stock: "$stock"},
                        dates: { $push: "$date" }
                    },
                },
                {
                    $match: { 'dates': date }
                },
                {
                    $group: {
                        _id: null,
                        stocks: { $push: "$_id.stock" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        'stocks' : '$stocks',
                    }
                },
            ])
            if(notInFilterStocks[0]?.['stocks']?.length > 0){
                notInFilterStocks = notInFilterStocks[0]['stocks']
            }
        }
        matchFilters = matchFilters.map(f => ObjectId(f))
        notifications = await Notification.aggregate([
            {
                $match: { date: { $gte: prev15Date, $lte: date}, alert: { $in: matchFilters }, stock: { $nin: notInFilterStocks }  }
            },
            {
                $group: {
                    _id: {date: '$date', stock: "$stock"},
                    count: {$sum: 1},
                    dates: { $push: "$date" }
                }
            },
            {
                $match: { count: { $gte: matchFilters.length } }
            },
            {
                $group:{
                    _id: {stock: "$_id.stock"},
                    count: { $sum: 1 },
                    dates: { $push: "$_id.date" }
                },
            },
            {
                $match: { 'dates': date }
            },
            {
                $lookup: {
                    from: 'cash stocks',
                    localField: "_id.stock",
                    foreignField: "_id",
                    as: "_id.stock"
                }
            },
            {
                $unwind:"$_id.stock" 
            },
            {
                $lookup: {
                    from: 'cash datas',
                    localField: "_id.stock._id",
                    foreignField: "stock",
                    as: "data"
                }
            },
            {
                $sort: { 'data.date': 1 }
            },
            {
                $project:{
                    _id: 0,
                    'stock': '$_id.stock.symbol',
                    'lastRecord': { $last: '$data' },
                    'currentRecord': {
                        $filter: {
                           input: "$data",
                           as: "stock_data",
                           cond: { $eq: [ "$$stock_data.date", date ] }
                        }
                    },
                    count: 1,
                }
            },
            {
                $unwind: '$currentRecord'
            },
            {
                $project: {
                    count: 1,
                    stock: 1,
                    percentage: { $round: [{
                        $multiply: [{
                            $divide: [{ 
                                $subtract: [ '$lastRecord.avg_price', '$currentRecord.avg_price' ]},  
                                '$currentRecord.avg_price'
                            ]}, 
                            100 
                        ]}, 2]
                    }
                }
            },
            {
                $sort: { count : -1, stock: 1 }
            }
        ])
        
        res.json(
            notifications
        )
    } catch(err) {
        console.log(err)
    }
}

// Option Controllers

