import React, { useEffect, useState, useRef } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'
import { Skeleton, Pagination } from '@material-ui/lab'

import StockItem from '@components/CashStocks/Body/StockItem'

import { toast } from 'react-toastify'

import { axiosInstance } from '../../../axios' 

const useStyles = makeStyles(theme => ({
  mainBox: {
    justifyContent: 'start',
    [theme.breakpoints.down('sm')]: {
      justifyContent: "center"
    }
  },
  
}))

const StocksList = ({session, searchStock, enterSearch, setEnterSearch}) => {

  const classes = useStyles()
  const [ stocks, setStocks ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const [ page, setPage ] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [hidePagination, setHidePagination] = useState(false)

  const setInitData = async() => {
    try {
      setHidePagination(false)
      setLoading(true)
      setPage(1)
      const res = await axiosInstance.get(`/cash/${page}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      setStocks([...res.data.stocks])
      setTotalPages(Math.ceil(res.data.totalPages / 25))
      setLoading(false)
    } catch(err) {
      console.log(err)
    }
  }


  useEffect(async() => {
    try{
      await setInitData()
    } catch(err) {
      setLoading(false)
      console.log(err)
    }
  }, [page])

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  useEffect(async() => {
    try{
      if(searchStock != '' && enterSearch){
        setLoading(true)
        const res = await axiosInstance.get('/cash/search', {
          params: {
            searchStock
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        },)
        setStocks([...res.data])
        setEnterSearch(false)
        setLoading(false)
        setHidePagination(true)
      } else if(searchStock == '' && !enterSearch){
        await setInitData()
      }
    } catch(err) {
      console.log(err)
      if(err.response){
        toast.error(err.response.data.error)
      }
    } 
  }, [searchStock, enterSearch])


  return (
    <>
      <Box pt={2} display="flex" flexWrap="wrap" alignItems="center" className={classes.mainBox}>
        {
        loading ?
        <Box display="flex" flexWrap="wrap" alignItems="center" className={classes.mainBox}>
          {[...Array(25).keys()].map(a => (
              <Box px={2} pt={4} key={a}>
              <Skeleton width={180} height={70} animation="wave" />
            </Box>
            ))}
        </Box>
        :
        (stocks.length > 0) 
        ? 
        stocks
        .map((s, i) => (
          <StockItem stock={s} key={i} />
        ))
        :
        !loading &&
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh" alignContent="center" width="100%">
          <Typography variant="h4" style={{color: '#ADB5BD'}}>
            No Stocks Found!
          </Typography>
        </Box>
        }
      </Box>

      {(!hidePagination && stocks.length > 0) &&
        <Box display="flex" justifyContent="center" alignItems="center" mt={5} mb={1}>
        <Pagination count={totalPages} color="primary" shape="rounded" onChange={handlePageChange} />
        </Box>
      }

    </>
  )
}

export default React.memo(StocksList)
