import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent } from '@material-ui/core'

import CustomSwitch from './CustomSwitch/CustomSwitch'

import Custom from './CustomTabs/Custom'
import MA from './CustomTabs/MA'

import { toast } from 'react-toastify'

import { axiosInstance } from '../../../../axios'

const useStyles = makeStyles(theme => ({
  input__label: {
    fontFamily: 'Inter',
    color: '#ADB5BD',
  },
  input:{
    fontFamily: 'Inter',
  },
  dialog__head: {
    fontWeight: 600, 
    fontFamily: 'Montserrat'
  },
  btn: {
    fontSize: 12,
    height: 37,
    width: 120,
    fontWeight: 600
  },
}))

const AddColumnDialog = ({session, open, setOpen, headers, refresh, setRefresh}) => {

  const classes = useStyles()
  const [toggle, setToggle] = useState(false)
  const [field, setField] = useState('prev_close')
  const [days, setDays] = useState('')
  const [formula, setFormula] = useState('')

  const resetForm = () => {
    setOpen(false)
    setField('prev_close')
    setDays('')
    setFormula('')
    setToggle(false)
  }

  const handleSubmit = async() => {
    try {
      setRefresh(!refresh)
      let res
      resetForm()
      if(toggle){
        res = await axiosInstance.post('/cash/stock/field/add', {
          custom: toggle,
          formula: formula,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        })
        
      } else {
        res = await axiosInstance.post('/cash/stock/field/add', {
          custom: toggle,
          days: days,
          field: field
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        })
      }
      toast.success(res.data.message)
      
    } catch(err) {
      if(err.response){
        toast.error(err.response.data.error)
      }
    }
  }

  return (
    <>
      
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>
            Add Custom column
        </DialogTitle>
        <DialogContent>
          <CustomSwitch toggle={toggle} handleToggle={() => setToggle(!toggle)} />

          { toggle 
          ? <Custom 
          formula={formula}
          setFormula={setFormula}
          /> 
          : <MA 
          headers={headers} 
          field={field} 
          setField={setField}
          days={days}
          setDays={setDays} 
          />}  
            
        </DialogContent>

        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          <Button 
          variant="contained" 
          color="primary" 
          disableElevation 
          className={classes.btn} 
          component="span"
          onClick={handleSubmit}
          >
          Submit
          </Button>
        </Box>

      </Dialog>
      
    </>
  )
}

export default AddColumnDialog
