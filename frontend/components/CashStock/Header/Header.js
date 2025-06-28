import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { useRouter } from 'next/router'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Button } from '@material-ui/core'

import UploadExcel from './UploadExcel'

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
    backgroundColor: '#DE350B',
    color: '#fff',
  },
}))

const Header = ({page, session, stock}) => {

  const classes = useStyles()
  const router = useRouter()
  const [navigatePage, setNavigatePage] = useState('')
  const [found, setFound] = useState(true)

  const [openDialog, setOpenDialog] = useState(false)
  
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

  const handleFileUpload = async(event) => {
    try{
      setOpenDialog(true)
      let formData = new FormData()
      formData.append('excel', event.target.files[0])
      formData.append('stock', stock)
      const res = await axiosInstance.post('/cash/stock/upload-file', formData, {
        headers: {
          'Authorization': session.token,
        }
      })
      setOpenDialog(false)
      toast.success(res.data.message)
    } catch(err){
      if(err.response){
        setOpenDialog(false)
        toast.error(err.response.data.error)
      }
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
          <Box pr={2}>
          <UploadExcel handleFileUpload={handleFileUpload} openDialog={openDialog} />
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
