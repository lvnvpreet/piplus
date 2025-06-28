import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Button, Fade, TextField, Chip, Hidden } from '@material-ui/core'


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
}))

const Header = ({alert, handleSave, total, limit, setLimit}) => {

  const classes = useStyles()

  const [alertType, setAlertType] = useState('Stocks')

  useEffect(() => {
    switch(alert.type){
      case 1:
        break
      case 0:
        setAlertType('Options')
        break
      case -1:
        setAlertType('Mixed')
        break
      default:
        break
    }
  }, [alert])

  const FilterAlert = () => (
    <>
      <Box px={1} pr={2}>
        <TextField 
        variant="outlined"
        style={{maxWidth: 60}}
        size="small"
        value={limit}
        onChange={event => setLimit(event.target.value)}
        />
      </Box>
      <Typography style={{color: 'grey'}} variant="subtitle1">
        out of
      </Typography>
      <Box px={1} pl={2}>
        <TextField 
        variant="outlined"
        style={{maxWidth: 60}}
        size="small"
        InputProps={{
          readOnly: true,
        }}
        value={total}
        />
      </Box>
    </>
  )
    

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <Typography className={classes.title}>
            {alert.name}
          </Typography>
          
          {
            alert?.tags?.length > 0 ? 
            alert.tags.map((t, i) => {
              return (
                <Box px={1} key={i}>
                  <Chip variant="outlined" label={t} size="small" color="primary" />
                </Box>
              )
            }
            )
            :
            null
          }

        </Box>
        <Box display="flex" alignItems="center">
          <Hidden xsDown>
            <FilterAlert />
          </Hidden>
          <Box pl={2}>
            <Button
            variant="contained"
            color="primary"
            disableElevation 
            className={classes.btn}
            onClick={() => handleSave()}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
      <Hidden smUp>
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <FilterAlert />
        </Box>
      </Hidden>
    </>
  )
}

export default Header
