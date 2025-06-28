import React, { useState, useEffect, useRef } from 'react'

import dynamic from 'next/dynamic'

const Chart = dynamic(
  () => {
      return import('react-apexcharts')
  },
  { ssr: false }
)

import { Box, Card, Button } from '@material-ui/core'

import { chartOptions } from '@constants/Chart'

const SingleChart = ({stockData, fields}) => {
  
  const [series, setSeries] = useState([])
  const [options, setOptions] = useState({...chartOptions})

  useEffect(() => {
    let chartFields = [
      {name: 'Weighted Close Price', data: []},
      {name: 'Close Price', data: []},
    ]
    if(stockData?.data?.length > 0 && fields.length > 0){
      for(let i=0; i < fields.length; i++){
        stockData.data.map(d => {
          chartFields[i].data.push([d.date, d[fields[i]] || null ])
        })
      }
    }
    setOptions({...chartOptions, title: { text: 'Close Price and Weighted Close Price' }})
    setSeries([...chartFields])
  }, [stockData])

  const handlePrev = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(`#chart4`);

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  return (
    <>
      <Box mt={3}>
        <Card variant="outlined">
          <Box p={4}>
            <Chart options={options} series={series} height="700" />
            <div id='chart5'>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box px={2}>
                <Button
                disableElevation
                variant="contained"
                color="secondary"
                onClick={handlePrev}
                >
                  Prev </Button>
                </Box>
                <Button
                disableElevation
                variant="contained"
                color="secondary"
                >
                  Next
                </Button>
              </Box>
            </div>
          </Box>
        </Card>
      </Box>
    </>
  )
}

export default SingleChart
