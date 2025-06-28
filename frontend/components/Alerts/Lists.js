import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import ListItem from './ListItem'

import { axiosInstance } from '../../axios'

const useStyles = makeStyles(theme => ({
  mainBox: {
    justifyContent: 'start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: "center"
    }
  },
}))

const Lists = ({session, refresh, tags}) => {

  const classes = useStyles()

  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toDate, handleToDateChange] = useState(new Date())
  const [fromDate, handleFromDateChange] = useState(new Date())

  useEffect(async() => {
    try {
      setLoading(true)
      const res = await axiosInstance.get('/alerts/all', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      setAlerts(res.data)
      setLoading(false)
    } catch(err) {
      setLoading(false)
      console.log(err)
    }
  }, [refresh])

  return (
    <>
      <Box pt={2} display="flex" flexWrap="wrap" alignItems="center" className={classes.mainBox}>
        {loading 
        ? 
          [...Array(25).keys()].map(a => (
            <Box px={2} pb={4} key={a}>
              <Skeleton width={180} height={70} animation="wave" />
            </Box>
          ))
        :
          alerts.length > 0
          ?
            alerts.map((alert, i) => (
                <ListItem 
                key={i} 
                alert={alert} 
                alerts={alerts}
                fromDate={fromDate}
                toDate={toDate}
                handleFromDateChange={handleFromDateChange} 
                handleToDateChange={handleToDateChange}
                setAlerts={setAlerts} 
                session={session} 
                tags={tags}
                />
            ))
        :
          !loading &&
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh" alignContent="center" width="100%">
              <Typography variant="h4" style={{color: '#ADB5BD'}}>
                No Alerts Found!
              </Typography>
          </Box>
        }
      </Box>
    </>
  )
}

export default Lists
