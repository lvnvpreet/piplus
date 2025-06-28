import { useState, useEffect, Fragment } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, TextField, MenuItem, IconButton } from '@material-ui/core'

import { MdClear } from 'react-icons/md'

import { axiosInstance } from '../../axios'

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]:{
      flexDirection: 'column'
    },
  },
  field: {
    [theme.breakpoints.down('sm')]:{
      marginTop: 10
    }
  }
}))

const disableValues = (i, values) => {
  for(let n=i; n < values.length; n++){
    values[n].disabled = true
    values[n].value = ''
  }
}

const Filter = ({alerts, filterSwitch, setAlerts, setFilterSwitch, selectedDate, session, setFilteredNotifications, setFilterLoading}) => {

  const classes = useStyles()
  const [filterAlerts, setFilterAlerts] = useState([])

  const [filterValues, setFilterValues] = useState([
    {value: '', disabled: false}, 
    {value: '', disabled: true}, 
    {value: '', disabled: true}, 
    {value: '', disabled: true}, 
    {value: '', disabled: true},
  ])
  const [filterOps, setFilterOps] = useState([
    {value: '', disabled: true},
    {value: '', disabled: true},
    {value: '', disabled: true},
  ])

  useEffect(() => {
    if(filterSwitch) fetchFileterdNotifications(filterValues, filterOps)
  }, [selectedDate])

  useEffect(() => {
    setFilterAlerts([alerts, alerts, alerts, alerts])
  }, [alerts])
  

  const fetchFileterdNotifications = async(values, opValues) => {
    setFilterLoading(true)
    try {
      let notInFilter
      let matchFilters = []
      matchFilters = [...values.reduce((result, {value}) => [...result, ...value !== '' ? [value] : []], [])]
      if(matchFilters.length > 1 && opValues[matchFilters.length - 2]?.value === 1) {
        notInFilter =  matchFilters[matchFilters.length - 1]
        matchFilters = matchFilters.slice(0, -1)
      }

      const res = await axiosInstance.post('/notifications/filter', {
        date: selectedDate,
        matchFilters: matchFilters,
        notInFilter: notInFilter
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      setFilteredNotifications(res.data)
      setFilterLoading(false)
    } catch(err) {
      setFilterLoading(false)
      console.log(err)
    }
  }

  const handleAlertChange = (i, event) => {

    setFilterSwitch(true)

    const values = filterValues
    const opValues = filterOps
    values[i].value = event.target.value
    if(i < 3 && filterOps[i - 1]?.value !== 1){
      // values[i + 1].disabled = false
      opValues[i].disabled = false
      setFilterOps([...opValues])
    }
    setFilterValues([...values])
    fetchFileterdNotifications(values, opValues)
    const newFilterAlerts = [...filterAlerts]
    for(let j=i+1; j<filterAlerts.length; j++){
      newFilterAlerts[j] = filterAlerts[j].filter(f => f._id != event.target.value)
    }
    setFilterAlerts(newFilterAlerts)
  }

  const handleOpChange = (i, event) => {
    setFilterSwitch(true)
    const values = filterOps
    const tempFilterValues = filterValues
    values[i].value = event.target.value
    tempFilterValues[i + 1].disabled = false
    if(event.target.value === 1){
      disableValues(i+1, values)
      disableValues(i+2,tempFilterValues)
    }
    setFilterOps([...values])
    setFilterValues([...tempFilterValues])

    fetchFileterdNotifications(tempFilterValues, values)
  }

  const resetFilters = () => {
    setFilterSwitch(false)
    setFilterValues([
      {value: '', disabled: false}, 
      {value: '', disabled: true}, 
      {value: '', disabled: true}, 
      {value: '', disabled: true}, 
      {value: '', disabled: true},
    ])
    setFilterOps([
      {value: '', disabled: true},
      {value: '', disabled: true},
      {value: '', disabled: true},
    ])
  }

  const CommonTextField = ({i}) => (
    <TextField 
    select
    label="Alert"
    variant= "outlined"
    size="small"
    style={{marginRight: 20}}
    fullWidth
    value={filterValues[i].value}
    disabled={filterValues[i].disabled}
    onChange={event => handleAlertChange(i, event)}
    className={classes.field}
    >
      {filterAlerts[i]?.length > 0 ?
      filterAlerts[i].map((a, i) => (
        <MenuItem key={i} value={a._id}>
          { a.name }
        </MenuItem>
      ))
    :
    <MenuItem> None </MenuItem>
    }
    </TextField>
  )

  const Operator = ({i}) => (
    <TextField
    select
    label="Op"
    variant= "outlined"
    size="small"
    style={{marginRight: 10, maxWidth: 100}}
    fullWidth
    color="secondary"
    value={filterOps[i].value}
    disabled={filterOps[i].disabled}
    onChange={event => handleOpChange(i, event)}
    className={classes.field}
    >
      <MenuItem value={0}>And</MenuItem>
      <MenuItem value={1}>Not In</MenuItem>
    </TextField>
  )

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" mt={2} className={classes.root}>
        {[...Array(3).keys()].map(a => (
          <Fragment key={a}>
            <CommonTextField i={a} />
            <Operator i={a} />
          </Fragment>
        ))}
        <CommonTextField i={3} />
        <IconButton onClick={() => resetFilters()}>
          <MdClear size="20" />
        </IconButton>
      </Box>
    </>
  )
}

export default Filter
