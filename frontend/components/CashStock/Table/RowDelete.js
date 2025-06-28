import { Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, Button } from '@material-ui/core'

const RowDelete = ({open, setOpen, del}) => {
  return (
    <>
      <Dialog open={open} onClose={() => setOpen(!open)}>
        <DialogTitle id="alert-dialog-title">{"Delete Custom Row?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            No
          </Button>
          <Button style={{ backgroundColor: '#DE350B', color: '#fff'}}  variant="contained" disableElevation onClick={() => del()}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RowDelete
