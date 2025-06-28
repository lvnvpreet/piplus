import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Button } from '@material-ui/core'

import AddAlert from '@components/Common/Alerts/AddAlert'

import { toast } from 'react-toastify'
import { axiosInstance } from '../../axios'

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
    fontWeight: 600
  },
  fieldLabel: {
    color: '#ADB5BD'
  },
}))

const Header = ({session, refresh, setRefresh, tags}) => {

  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const handleSubmit = async(name, value, color) => {
    try{
      setOpen(false)
      const res = await axiosInstance.post('/alerts/add', {
        name: name,
        tags: value,
        color: color
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      toast.success(res.data.message)
      setRefresh(!refresh)
    } catch(err) {
      console.log(err)
    }
  }
  
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}> 
       <Typography className={classes.title}>
          Alerts
        </Typography>
        <Box display="flex" alignItems="center">
          <Button
          variant="contained"
          color="primary"
          disableElevation 
          className={classes.btn}
          onClick={() => setOpen(true)}
          >
            Create Alert
          </Button>
        </Box>
      </Box>

      <AddAlert 
      session={session} 
      open={open} 
      setOpen={setOpen} 
      refresh={refresh} 
      setRefresh={setRefresh}
      tags={tags} 
      handleSubmit={handleSubmit}
      />
    </>
  )
}

export default Header
