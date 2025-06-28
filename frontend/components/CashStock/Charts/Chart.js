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


const MyChart = ({stockData, fields, title, index}) => {

  const [series, setSeries] = useState([])
  const [options, setOptions] = useState({...chartOptions})

  const handleNext = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(`#chart${index + 1}`);

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  const handlePrev = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(`#chart${index - 1}`);

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  useEffect(() => {
    let maFields = [
      {name: '1 Day MA', data: []},
      {name: '3 Days MA', data: []},
      {name: '5 Days MA', data: []},
      {name: '8 Days MA', data: []},
      {name: '13 Days MA', data: []},
    ]
    if(stockData?.data?.length > 0 && fields.length > 0){
      for(let i=0; i < fields.length; i++){
        stockData.data.map(d => {
          maFields[i].data.push([d.date, d[fields[i]] || null ])
        })
        
      }
      setOptions({...chartOptions, title: { text: title }})
      setSeries([...maFields])
    }
    
  }, [stockData, fields, title])

  return (
    <>
      <Box mt={3}>
        <Card variant="outlined">
          <Box p={4}>
            <Chart options={options} series={series} height="700" />
            <div id={`chart${index}`}>
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
                onClick={handleNext}
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

export default MyChart
