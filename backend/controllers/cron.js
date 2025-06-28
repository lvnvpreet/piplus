const {spawn} = require('child_process')

exports.oldScrapeOptionsData = async(req, res, next) => {
    try{
        const option_stocks = await OptionStock.find().sort('symbol')
        const agent = superagent.agent();
        const headers = {
            'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0`,
            'Connection': 'keep-alive',
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        }
        const base_url = 'https://www.nseindia.com/api/option-chain-equities?symbol='

        let resp
        agent
        .get('https://www.nseindia.com/option-chain')
        .set(headers)
        .proxy('http://46.29.251.231:12345:slyfox:4fJXFswI')
        .end((err, res) => {
            if(err) console.log(err)
            console.log(res)
        })

        // let option_datas = []
        // const date = new Date()
        // date.setUTCHours(0, 0, 0, 0)
        // for(let stock of option_stocks){
        //     console.log(stock.symbol)
        //     let option_expiry_dates = []
        //     let option_data = []
        //     let resp = await agent
        //     .get((base_url + stock.symbol.replace('&', '%26')))
        //     .set(headers)
            
        //     if(resp?.body?.records?.data?.length > 1){
        //         for(let d of resp.body['records']['data']){
        //             if(d?.CE?.openInterest > 0 || d?.PE?.openInterest > 0){
        //                 index = option_expiry_dates.indexOf(d?.expiryDate)
        //                 let option_records = {
        //                     ...(d?.CE?.openInterest > 0 && {
        //                         CE: {
        //                             open_interest: d['CE']['openInterest'],
        //                             change_in_OI: d['CE']['changeinOpenInterest'],
        //                             volume: d['CE']['totalTradedVolume'],
        //                             IV: d['CE']['impliedVolatility'],
        //                             last_price: d['CE']['lastPrice'],
        //                             change: d['CE']['change']
        //                         }
        //                     }),
        //                     ...(d?.PE?.openInterest > 0 && {
        //                         PE: {
        //                             open_interest: d['PE']['openInterest'],
        //                             change_in_OI: d['PE']['changeinOpenInterest'],
        //                             volume: d['PE']['totalTradedVolume'],
        //                             IV: d['PE']['impliedVolatility'],
        //                             last_price: d['PE']['lastPrice'],
        //                             change: d['PE']['change']
        //                         }
        //                     }),
        //                 }

        //                 if(index !== -1){
        //                     option_data[index].data.push({
        //                         strike_price: d.strikePrice,
        //                         ...option_records
        //                     })
        //                     continue
        //                 }
        //                 option_expiry_dates.push(d.expiryDate)
        //                 option_data.push({
        //                     date: date,
        //                     expiry_date: new Date(d.expiryDate + ' GMT'),
        //                     underlying_value: resp.body['records']['underlyingValue'],
        //                     stock: stock._id,
        //                     data: [{
        //                         strike_price: d.strikePrice,
        //                         ...option_records
        //                     }]
        //                 })
        //             }
        //         }
        //         option_datas = [...option_datas, ...option_data]
        //     } else {
        //         continue
        //     }
        //     console.log()
        //     break
        // }
        // console.log(option_datas)
        // await OptionData.insertMany(option_datas)
        next()
    } catch(err) {
        console.log(err)
    }
}

exports.scrapeOptionsData = (req, res, next) => {
    try{
        console.log("running")
        const py = spawn(`${process.env.PYTHON_VERSION}`, ['./scraper/main.py'])
        py.stderr.on('data', (err) => {
            console.log(new Date())
            console.log(err.toString())
        })
        py.stdout.on('data', (data) => {
            console.log("SCRAPED SUCCESSFULLY", new Date())
            // console.log(data.toString())
        })
    } catch(err){
        console.log(err)
    }
}

exports.scrapeDataForPreviousData = (req, res, next) => {
    try{
        console.log("running")
        const py = spawn(`${process.env.PYTHON_VERSION}`, ['./scraper/main.py', true])
        py.stderr.on('data', (err) => {
            console.log(new Date())
            console.log(err.toString())
        })
        py.stdout.on('data', (data) => {
            console.log("SCRAPED SUCCESSFULLY", new Date())
            // console.log(data.toString())
        })
    } catch(err) {
        console.log(err)
    }
}