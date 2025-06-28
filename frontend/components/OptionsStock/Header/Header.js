import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { useRouter } from 'next/router'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Button } from '@material-ui/core'

import { MdDelete } from 'react-icons/md'
import { BiLink } from 'react-icons/bi'

import { toast } from 'react-toastify'

import { axiosInstance } from '../../../axios'

const useStyles = makeStyles(theme => ({
  root: {
    borderBottom: '1px solid #e5e5e5',
    paddingBottom: '10px'
  },
  title: {
    fontWeight: 600,
    fontSize: 28,
    fontFamily: 'Montserrat'
  },
  btn: {
    fontSize: 12,
    fontWeight: 600,
    // backgroundColor: '#DE350B',
    // color: '#fff',
  },
}))

const Header = ({page, session, stock}) => {

  const classes = useStyles()
  const router = useRouter()
  const [navigatePage, setNavigatePage] = useState('')
  const [found, setFound] = useState(true)

  const [scraping, setScraping] = useState(false)

  
  useEffect(() => {
    let didCancel = false
    if(page === 'cash') {
      setNavigatePage('options')
      const fetchStock = async () => {
        try {
          const res = await axiosInstance.get(`/options/stock/${stock}/find`, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': session.token,
            }
          })
          if(!didCancel) setFound(res.data)
        } catch(err) {
          console.log(err)
        }
      }

      fetchStock()
    } else {
      setNavigatePage('cash')
    }

    return () => {
      didCancel = true
    }
  }, [page])

  const handleScrapeClick = async() => {
    try{
      setScraping(true)
      const res = await axiosInstance.post('/options/stock/scrape', {
        symbol: stock
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      toast.success(res.data.message)
      setScraping(false)
    } catch(err){
      setScraping(false)
      if(err.response){
        toast.error(err.response.data.error)
      }
    }
  }

  const handleClick = async() => {
    try {
      const res = await axiosInstance.post(`/${page}/stock/delete`, {
        symbol: stock
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      router.push(`/${page}`)
      toast.success(res.data.message)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} className={classes.root}>
        <Typography className={classes.title} color="primary">
          ${stock}&nbsp;
          <Link href={`/${navigatePage}/${stock}`} passHref>
            <a style={ found ? {cursor: 'pointer', textDecoration: 'none', color: '#0069ff'} : {color: '#ACACAC', pointerEvents: 'none', textDecoration: 'none'}}>
              <BiLink size="21" title={`Go to ${navigatePage} page`}  />
            </a>
          </Link> 
        </Typography>
        <Box display="flex" alignItems="center">
          <Box px={2}>
            <Button
            className={classes.btn} 
            variant="contained"
            disableElevation
            color="primary"
            onClick={handleScrapeClick}
            >
              { scraping ? 'Scraping...' : 'Scrape' }
            </Button>
          </Box>
          <Button 
          className={classes.btn} 
          variant="contained"
          style={{backgroundColor: '#DE350B', color: '#fff'}}  
          disableElevation
          onClick={() => handleClick()} 
          >
            <MdDelete size="22" />
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default Header
