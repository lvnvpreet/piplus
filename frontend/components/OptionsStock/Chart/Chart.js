import React, { useEffect, useState } from 'react'

import { Box, Card } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Header from './Header'

import { chartOptions, } from '@constants/Options/Chart'
import { axiosInstance } from '../../../axios'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'
import 'chartjs-adapter-date-fns'

const filterSeries  = (series, type, strikePrices) => series.filter(s => {
  if(!(strikePrices.length > 0) && !type) return true
  if(strikePrices.includes(s.label) || s.label.split(' ').pop() === type) {
      return true
  }
  return false
})

const MyChart = ({session,stock}) => {

  const [loading, setLoading] = useState(true)
  const [optionStock, setOptionStock] = useState({})
  const [seriesData, setSeriesData] = useState({
      oiSeries: { 
        title: 'OI',
        yAxisTitle: 'OI',
        data: [],
      },
      magicChgInOi:{ 
        title: 'Magic No. Change in OI',
        yAxisTitle: 'Magic No.',
        data: []
      },
      magicOi: {
        title: 'Magic No. OI',
        yAxisTitle: 'Magic No.',
        data: []
      }
  })
  const [filteredSeriesData, setFilteredSeriesData] = useState({
      oiSeries: { 
        title: 'OI',
        yAxisTitle: 'OI',
        data: [],
      },
      magicChgInOi:{ 
        title: 'Magic No. Change in OI',
        yAxisTitle: 'Magic No.',
        data: []
      },
      magicOi: {
        title: 'Magic No. OI',
        yAxisTitle: 'Magic No.',
        data: []
      }
  })

  const [underlyingValuesData, setUnderlyingValuesData] = useState({})

  // Filters
  const [expiryDates, setExpiryDates] = useState([])
  const [expiryDate, setExpiryDate] = useState('')
  const [type, setType] = useState('')
  const [strikePrices, setStrikePrices] = useState([])
  const [months, setMonths] = useState()
  const [month, setMonth] = useState('')
  const [oiFilterValue, setOiFilterValue] = useState('')

  useEffect(() => {
    let didCancel = false
    setLoading(true)
    const getChartData = async() => {
      try{
        const res = await axiosInstance.post('/options/stock/chart', {
          stock: stock,
          date: expiryDate,
          oiFilter: oiFilterValue,
          monthFilter: month
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        })
        if(!didCancel){
          setMonths(res.data.months)
          setOptionStock(res.data.optionStock)
          setSeriesData({
            oiSeries: {
              ...seriesData.oiSeries,
              data: res.data.oiRecords
            },
            magicChgInOi: {
              ...seriesData.magicChgInOi,
              data: res.data.magicNoRecords
            },
            magicOi: {
              ...seriesData.magicOi,
              data: res.data.magicNoOiDataRecords
            }
          })
          setFilteredSeriesData({
              oiSeries: { 
                ...filteredSeriesData.oiSeries,
                data: filterSeries(res.data.oiRecords, type, strikePrices),
              },
              magicChgInOi:{ 
                ...filteredSeriesData.magicChgInOi,
                data: filterSeries(res.data.magicNoRecords, type, strikePrices)
              },
              magicOi: {
                ...filteredSeriesData.magicOi,
                data: filterSeries(res.data.magicNoOiDataRecords, type, strikePrices)
              }
          })
          setExpiryDates([...res.data.expiry_dates])
          setUnderlyingValuesData({...res.data.underlying_value_records})
          setLoading(false)
        }
      } catch(err){
        console.log(err)
      }
    }

    getChartData()

    return () => {
      didCancel = true
    }

  }, [expiryDate, oiFilterValue, month])
  
  useEffect(() => {
    console.log(filterSeries(seriesData.oiSeries.data, type, strikePrices))
    // console.log(newFilterType(seriesData.oiSeries.data, type, strikePrices))
    setFilteredSeriesData({
      oiSeries: {
        ...filteredSeriesData.oiSeries,
        data: filterSeries(seriesData.oiSeries.data, type, strikePrices)
      },
      magicChgInOi: {
        ...filteredSeriesData.magicChgInOi,
        data: filterSeries(seriesData.magicChgInOi.data, type, strikePrices)
      },
      magicOi: {
        ...filteredSeriesData.magicOi,
        data: filterSeries(seriesData.magicOi.data, type, strikePrices)
      }
    })
  }, [type, strikePrices])

  return (
    <>
      <Box px={{xs: 1, sm: 1, md: 2}} mt={3}>
        <Header 
        optionStock={optionStock}
        expiryDates={expiryDates}
        expiryDate={expiryDate}
        setExpiryDate={setExpiryDate}
        type={type}
        setType={setType}
        strikePrices={strikePrices}
        setStrikePrices={setStrikePrices}
        oiFilterValue={oiFilterValue}
        setOiFilterValue={setOiFilterValue}
        series={seriesData.oiSeries.data}
        months={months}
        month={month}
        setMonth={setMonth}
        />
        {
            Object.keys(filteredSeriesData).map((key) => {

              const series = filteredSeriesData[key]
              const seriesOptions = {
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: series.title
                  }
                },
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales.y,
                    title: {
                      text: series.yAxisTitle,
                      display: true
                    },
                  }
                }
              }

              return (
                <Box mt={2} key={key}>
                  {
                    loading ?
                    <Skeleton variant="rect" animation="wave" height={300} />
                    :
                    <Card variant="outlined">
                      <Box p={4}>
                      <Line 
                        data={{
                          datasets: [...series.data, underlyingValuesData]
                        }}
                        type='line'
                        options={seriesOptions}
                      />
                      </Box>
                    </Card>
                  }
                </Box>
              )
              

            })
        }

      </Box>
    </>
  )
}

export default MyChart
