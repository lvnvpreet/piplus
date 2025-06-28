import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Badge } from '@material-ui/core'

import Item from '@components/Common/Stock/Item'
import DeleteAlert from './DeleteAlert'
import AddAlert from '@components/Common/Alerts/AddAlert'

import { DatePicker } from '@material-ui/pickers'
import { MdDelete } from 'react-icons/md'
import { FaClone } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { getMonth } from 'date-fns'

import { axiosInstance } from '../../axios'


const useStyles = makeStyles(theme => ({
  btn: {
    fontSize: 12,
    height: 37,
    fontWeight: 600
  },
}))

const AlertItem = ({alert, alerts, fromDate, toDate, handleFromDateChange, handleToDateChange, setAlerts, session, tags}) => {

  const classes = useStyles()
  const [btnText, setBtnText] = useState('Scan')
  const [disabled, setDisabled] = useState(false)
  
  const [selectedDays, setSelectedDays] = useState([])

  const [openDelDialog, setOpenDelDialog] = useState(false)

  useEffect(() => {
    let didCancel = false
    const getScannedDates =  async() => {
      try{
        const date = new Date()
        const res = await axiosInstance.post('/alerts/alert/scanned', {
          month: getMonth(date) + 1,
          alert: alert._id
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        })
        if(!didCancel){
          setSelectedDays(res.data)
        }
      } catch(err) {
        console.log(err)
      }
    }
    getScannedDates()
    return () => {
      didCancel = true
    }
  }, [alert])
  
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const handleMonthChange = async(month) => {
    try{

      const res = await axiosInstance.post('/alerts/alert/scanned', {
        month: getMonth(month) + 1,
        alert: alert._id
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      setSelectedDays(res.data)

    } catch(err) {
      console.log(err)
    }
  }

  const handleScan = async() => {
    try{
      if(fromDate.getTime() > toDate.getTime()){
        toast.error('From Date cannot be greater than To Date!')
        return
      }
      setBtnText('Scanning...')
      setDisabled(true)
      const res = await axiosInstance.post('/alerts/alert/scan', {
        id: alert._id,
        fromDate: fromDate,
        toDate: toDate
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      res.data.empty ? toast.error(res.data.message) : toast.success(res.data.message)
      setBtnText('Scan')
      setDisabled(false)
    } catch(err){
      console.log(err)
      setBtnText('Scan')
      setDisabled(false)
    }
  }

  const handleDelete = async() => {
    try{
      setOpenDelDialog(false)
      const filteredAlerts = alerts.filter(a => a._id !== alert._id)
      setAlerts(filteredAlerts)
      const res = await axiosInstance.post('/alerts/alert/delete', {
        id: alert._id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      toast.success(res.data.message)
    } catch(err){
      console.log(err)
    }
  }
  
  const handleClone = async(name, tags, color) => {
    try{
      setOpen(false)
      const res = await axiosInstance.post('/alerts/alert/clone', 
      {
        id: alert._id,
        name: name,
        tags: tags,
        color: color
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      setAlerts([...alerts, res.data.alert])
      setName('')
      toast.success(res.data.message)
    } catch(err) {
      setOpen(false)
      setName('')
      console.log(err)
    }
  }

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
        <Item item={alert} page="alerts" color={alert?.color} />
        <Box pb={4} px={2} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
          <Box maxWidth={110}>
            <DatePicker
            autoOk
            label="From"
            variant="inline"
            value={fromDate}
            format="PP" 
            onChange={handleFromDateChange}
            // onMonthChange={handleMonthChange}
            renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
              const isSelected = isInCurrentMonth && selectedDays.includes(day.getDate());
              return React.cloneElement(dayComponent, {style: {color: ( isSelected && '#d70070')}})
            }}
            />
          </Box>
          <Box maxWidth={110} ml={2}>
            <DatePicker
            autoOk
            label="To"
            variant="inline"
            value={toDate}
            format="PP" 
            onChange={handleToDateChange}
            onMonthChange={handleMonthChange}
            renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
              const isSelected = isInCurrentMonth && selectedDays.includes(day.getDate());
              return React.cloneElement(dayComponent, {style: {color: ( isSelected && '#d70070')}})
            }}
            />
          </Box>
          <Box pl={2}>
          <Button
          variant="contained"
          disableElevation
          style={{color: '#fff', backgroundColor: '#000'}}
          className={classes.btn}
          disabled={disabled}
          onClick={() => handleScan()} 
          >{btnText}</Button>
          </Box>
          <Box px={1}>
            <IconButton 
            style={{ color: '#DE350B'}}
            onClick={() => setOpenDelDialog(true)}
            >
              <MdDelete size="20"  />
            </IconButton>
          </Box>
          <IconButton 
          color="secondary"
          title="Clone Alert"
          onClick={() => setOpen(true)}
          >
            <FaClone size="18"  />
          </IconButton>
        </Box>
      </Box>

      <DeleteAlert open={openDelDialog} setOpen={setOpenDelDialog} handleDelete={handleDelete} />

      <AddAlert open={open} setOpen={setOpen} tags={tags} handleSubmit={handleClone} />
    </>
  )
}

export default AlertItem
