import React, { useState, } from 'react'

import { Box, Button, TextField, MenuItem } from '@material-ui/core'

import { format } from 'date-fns'

const FilterDates = ({stockData, setStockData}) => {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const handleSubmit = () => {
    let fromDateTime = new Date(fromDate).getTime()
    let toDateTime = new Date(toDate).getTime()
    let filteredStockData = stockData.data.filter(d => {
      let dataDateTime = new Date(d.date).getTime()
      return dataDateTime >= fromDateTime && dataDateTime <= toDateTime
    })
    setStockData({...stockData, data: [...filteredStockData]})
    // setStockData({...stockData, stock: { ...stockData.stock,  data: [...filteredStockData]}})
  }

  return (
    <>
      <TextField 
      select
      label={"From"}
      variant="outlined"
      fullWidth
      value={fromDate}
      size="small"
      style={{marginRight: 20, minWidth: 150}}
      onChange={event => setFromDate(event.target.value)}
      >
      {stockData?.data?.length > 0 ?
      stockData.data.map((option, i) => (
        <MenuItem key={i} value={option.date}>
          { format(new Date(option.date), 'PP') }
        </MenuItem>
      ))
      :
      <MenuItem value=''>None</MenuItem>
      }
      </TextField>
      <TextField 
      select
      label={"To"}
      variant="outlined"
      value={toDate}
      fullWidth
      size="small"
      style={{minWidth: 150}}
      onChange={event => setToDate(event.target.value)}
      >
        {stockData?.data?.length > 0 ?
        stockData.data.map((option, i) => (
        <MenuItem key={i} value={option.date}>
          { format(new Date(option.date), 'PP') }
        </MenuItem>
      ))
      :
      <MenuItem value=''>None</MenuItem>
      }
      </TextField>
      <Box pl={2}>
        <Button
        disableElevation
        color="primary"
        variant="contained"
        onClick={() => handleSubmit()}
        >
          Filter
        </Button>
      </Box>
    </>
  )
}

export default FilterDates
