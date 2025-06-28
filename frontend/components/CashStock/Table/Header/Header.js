import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, IconButton, Typography } from '@material-ui/core'

import AddDialog from '../AddColumn/AddDialog'
import FilterDates from './FilterDates'

import { RiRefreshLine } from 'react-icons/ri'

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

const Header = ({session, headers, refresh, setRefresh, stockData, setStockData}) => {

  const classes = useStyles()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.title}>
          Table
        </Typography>
        <Box display="flex" alignItems="center">
          <FilterDates stockData={stockData} setStockData={setStockData} />
          <Box pl={1}>
            <Button 
            className={classes.btn} 
            variant="contained" 
            color="primary" 
            disableElevation 
            onClick={() => setOpen(true)}
            >
              Add column
            </Button>
          </Box>
          <IconButton title="Reset" onClick={() => setRefresh(!refresh)}>
            <RiRefreshLine size={22} />
          </IconButton>
        </Box>
      </Box>

      <AddDialog session={session} open={open} setOpen={setOpen} headers={headers} refresh={refresh} setRefresh={setRefresh} />
    </>
  )
}

export default Header
