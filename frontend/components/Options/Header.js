import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, Typography } from '@material-ui/core'
import UploadExcel from '@components/Common/Stocks/UploadExcel'
import { axiosInstance } from '../../axios'
import { toast } from 'react-toastify'

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 600,
    color: theme.palette.secondary.main,
    fontSize: 28,
    fontFamily: 'Montserrat'
  },
  fieldLabel: {
    color: '#ADB5BD'
  },
  btn: {
    fontSize: 12,
    height: 37,
    width: 120,
    fontWeight: 600
  },
}))

const Header = ({session}) => {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)

  const handleFileUpload = async(event) => {
    try{
      setOpenDialog(true)
      let formData = new FormData()
      formData.append("excel", event.target.files[0])
      const res = await axiosInstance.post('/options/upload-file', formData, {
        headers: {
          'Authorization': session.token,
        }
      })
      setOpenDialog(false)
      toast.success(res.data.message)
    } catch(err) {
      console.log(err)
    }
    
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography className={classes.title}>
          Options
        </Typography>
        <UploadExcel openDialog={openDialog} handleFileUpload={handleFileUpload} />
      </Box>
    </>
  )
}

export default Header
