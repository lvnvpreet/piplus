import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Item from '@components/Common/Stock/Item'

import { axiosInstance } from '../../axios'

const useStyles = makeStyles(theme => ({
  mainBox: {
    justifyContent: 'start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: "center"
    }
  },
}))

const OptionsList = ({session}) => {

  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [stocks, setStocks] = useState([])

  useEffect(() => {
    setLoading(true)
    let didCancel = false;
    const fetchStocks = async() => {
      try{
        const res = await axiosInstance.get('/options/stocks', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          },
        })
        if(!didCancel){
          setStocks(res.data)
          setLoading(false)
        }
      } catch(err) {
        setLoading(false)
        console.log(err)
      }
    }
    fetchStocks()
  }, [])


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
        stocks.length > 0
        ?
        stocks
        .map((s, i) => (
          <Item key={i} page="options" item={{ _id: s.symbol, name: s.symbol }} />
        ))
        :
        !loading &&
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh" alignContent="center" width="100%">
            <Typography variant="h4" style={{color: '#ADB5BD'}}>
              No Stocks Found!
            </Typography>
        </Box>
        }
      </Box>
    </>
  )
}

export default OptionsList
