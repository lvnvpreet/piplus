import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, TextField, MenuItem, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Inter',
    color: '#ADB5BD',
  },
  input:{
    fontFamily: 'Inter',
  },
}))

const MA = ({headers, field, setField, days, setDays}) => {

  const classes = useStyles()

  return (
    <>
      <Box pt={3} pb={2}>
        <Box pb={2}>
          <TextField
          label="Field"
          variant="outlined"
          select
          value={field}
          onChange={event => setField(event.target.value)}
          
          fullWidth    
          InputLabelProps={{
            className: classes.root
          }}
          InputProps={{
            className: classes.input
          }}
          >
          {headers
          .filter(h => h.accessor !== 'date')
          .map((h, i) => (
            <MenuItem key={i} value={h.accessor}>
              {h.accessor}
            </MenuItem>
          ))}  
          </TextField>
        </Box>
          <TextField
          label="MA Days"
          variant="outlined"
          fullWidth    
          value={days}
          onChange={event => setDays(event.target.value)}
          InputLabelProps={{
            className: classes.root
          }}
          InputProps={{
            className: classes.input
          }}
          />
          <Box mt={2}>
            <Typography variant="caption" style={{fontFamily: 'Inter', fontWeight: 600, color: '#ADB5BD'}}>
              Note: Custom Field Name will be set as <span style={{color: '#031b4e'}}> field_name_days_ma </span> to avoid clashing of header names! <span style={{color: '#031b4e'}}>Eg: prev_close_3_ma </span>
            </Typography>
          </Box>
      </Box>
    </>
  )
}

export default MA
