import React, { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'

const DeleteAlert = ({open, setOpen, handleDelete}) => {

  return (
    <>
      <Dialog aria-labelledby="simple-dialog-title" onClose={() => setOpen(false)} open={open}>
        <DialogTitle id="simple-dialog-title">Delete Alert</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            No
          </Button>
          <Button style={{ backgroundColor: '#DE350B', color: '#fff'}}  variant="contained" disableElevation onClick={() => handleDelete()}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteAlert
