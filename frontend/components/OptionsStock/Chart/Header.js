import { useState, useEffect, Fragment } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, TextField, MenuItem, Chip } from '@material-ui/core'
import Autocomplete  from '@material-ui/lab/Autocomplete'

import { format } from 'date-fns'
import { DatePicker } from '@material-ui/pickers'

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 600,
    color: theme.palette.secondary.main,
    fontSize: 28,
    fontFamily: 'Montserrat'
  },
  btn: {
    fontSize: 12,
    height: 37,
    width: 125,
    fontWeight: 600,
  },
}))

const Header = ({
  optionStock,
  expiryDates, 
  expiryDate, 
  setExpiryDate, 
  setType, 
  setStrikePrices, 
  oiFilterValue, 
  setOiFilterValue, 
  series,
  months,
  month,
  setMonth
}) => {

  const classes = useStyles()
  const [strikePricesOptions, setStrkePricesOptions] = useState([])

  useEffect(() => {
    (!expiryDate && expiryDates.length > 0) && setExpiryDate(expiryDates[0])
    setStrkePricesOptions([...series.map(s => s.label)])
  }, [expiryDates, series])
  
  function disableWeekends(date) {
    // console.log(date)
    console.log( Boolean(expiryDates.find(eD => new Date(eD).toISOString() == new Date(date).toISOString())))
    return Boolean(expiryDates.find(eD => new Date(eD).toISOString() == new Date(date).toISOString()));
  }

  const handleDateChange = (value) => {
    try{
      setExpiryDate(value)
    } catch(err){
      console.log(err)
    }
  }

  const handleTypeChange = (e) => {
    try{
      setType(e.target.value)
    } catch(err){
      console.log(err)
    }
  }

  return (
    <>
      <Box display="flex"  alignItems="center" mb={5}>
        <Box width="20%">
          <Typography className={classes.title}>
          Chart
          </Typography>
        </Box>
        <Box width="80%" display="flex">
          <Box pr={2}>
            <TextField 
              size="small"
              fullWidth
              label="OI Filter"
              value={oiFilterValue}
              onChange={e => setOiFilterValue(e.target.value)}
            />
          </Box>

          <Box width="15%" >
            <TextField
            select
            label="Type"
            size="small"
            fullWidth
            onChange={handleTypeChange}
            >
              <MenuItem value=''>None</MenuItem>
              <MenuItem value={'CE'}>Call</MenuItem>
              <MenuItem value={'PE'}>Put</MenuItem>
            </TextField>
          </Box>
            
          <Box px={1} width="20%">
           
            {
              !optionStock.index ?
              <TextField
              select
              label="Expiry Date"
              size="small"
              fullWidth
              value={expiryDate}
              onChange={e => handleDateChange(e.target.value)}
              >
                {
                  expiryDates?.length > 0 ?
                  expiryDates.map((date, i) => <MenuItem key={i} value={date}>{ format(new Date(date), 'PP') }</MenuItem>) 
                  
                  : <MenuItem value=''>None</MenuItem>
                }
              </TextField>

              :
              <DatePicker 
                autoOk
                label="Expiry Date"
                format="dd/MM/yyyy"
                value={new Date(expiryDate)}
                onChange={newValue => handleDateChange(new Date(newValue))}
                shouldDisableDate={disableWeekends}
              />
            }
            
          </Box>

          <Box px={1} width="20%">
            <TextField
              select
              label="Month"
              size="small"
              fullWidth
              value={month}
              onChange={e => setMonth(e.target.value)}
              >
                <MenuItem value=''>None</MenuItem>
                {
                  months?.length > 0 &&
                  months.map((date, i) => <MenuItem key={i} value={date}>{date}</MenuItem>) 
                  
                }
              </TextField>
          </Box>
          
          <Box width="100%">
            <Autocomplete 
            multiple
            id="tags-standard"
            options={strikePricesOptions}
            getOptionLabel={(option) => option}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                size="small" 
                label={option} 
                {...getTagProps({ index })} 
                // style={{backgroundColor: `${option.borderColor}`, color: '#fff'}} 
                />
              ))
            }
            onChange={(e, v)=> setStrikePrices([...v])}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                fullWidth
                label="Filter Strike Prices"
              />
            )}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Header
