import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, TextField, MenuItem } from '@material-ui/core'

import { format, setMonth } from 'date-fns'

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 600,
    color: theme.palette.secondary.main,
    fontSize: 28,
    fontFamily: 'Montserrat'
  },
}))

const Header = ({months, month, setMonth}) => {

  const classes = useStyles()

  const handleMonthChange = (e) => {
    setMonth(e.target.value)
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.title}>
          Table 
        </Typography>
        <Box width="10%">
          <TextField
            select
            label="Month"
            size="small"
            fullWidth
            variant="outlined"
            value={month}
            onChange={handleMonthChange}
          >
            {
              months?.length > 0 ?
              months.map((date, i) => <MenuItem key={i} value={date}>{ format(new Date(date), 'MMM yyyy') }</MenuItem>)
              : <MenuItem>None</MenuItem>
            }
            
          </TextField>
        </Box>
      </Box>
    </>
  )
}

export default Header
