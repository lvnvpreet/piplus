import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, Typography, } from '@material-ui/core'

import { DatePicker } from '@material-ui/pickers'

import { MdExpandMore, MdExpandLess } from 'react-icons/md'

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 600,
    color: theme.palette.secondary.main,
    fontSize: 28,
    fontFamily: 'Montserrat',
    [theme.breakpoints.down('sm')]:{
      fontSize: 26
    },
    [theme.breakpoints.down('xs')]:{
      fontSize: 24
    },
  },
  btn: {
    fontSize: 12,
    height: 37,
    fontWeight: 600
  },
  fieldLabel: {
    color: '#ADB5BD'
  },
}))

const Header = ({selectedDate, setSelectedDate, expandAll, setExpandAll}) => {

  const classes = useStyles()

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.title}>
          Notifications
        </Typography>
        <Box display="flex" justifyContent="space-between" alignContent="end">
            <Button
            size="small"
            variant="text"
            style={{color: 'grey'}}
            onClick={() => setExpandAll(!expandAll)}
            endIcon={
              expandAll ? <MdExpandLess size="18" style={{color: 'grey'}} /> : <MdExpandMore size="18" style={{color: 'grey'}} />
            }
           >
            {expandAll ? 'Collapse All' : 'Expand All '} 
           </Button>
          <Box maxWidth={110} ml={2}>
            <DatePicker
            autoOk
            variant="inline"
            label="Date"
            format="PP" 
            value={selectedDate}
            onChange={setSelectedDate}
            />
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Header
