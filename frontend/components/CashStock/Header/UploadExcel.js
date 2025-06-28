import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, Dialog, DialogTitle, DialogContent, CircularProgress, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  btn: {
    fontSize: 12,
    height: 37,
    width: 120,
    fontWeight: 600
  },
  dialog__head: {
    fontWeight: 500, 
    fontFamily: 'Montserrat'
  }
}))
const UploadExcel = ({handleFileUpload, openDialog}) => {

  const classes = useStyles()
  

  return (
    <>
      <input 
      id="contained-button-file"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      type="file"
      style={{display: 'none'}}
      onChange={event => handleFileUpload(event)}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" disableElevation className={classes.btn} component="span">
          Upload File
        </Button>
      </label>

      <Dialog open={openDialog}>
          <DialogTitle>
            <Typography className={classes.dialog__head} variant="h6">
              Uploading the excel...
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="center" alignItems="center" p={4} flexDirection="column">
              <CircularProgress 
              color="primary"
              size={60} 
              />
              <Box pt={4} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
              <Typography color="secondary" variant="subtitle1">
              This may take a few minutes!
              </Typography>
              <Typography style={{fontWeight: 600}} variant="h6">
                Please do not go back or refresh the page!
              </Typography>
              </Box>
            </Box>
            
          </DialogContent>
      </Dialog>
    </>
  )
}

export default UploadExcel
