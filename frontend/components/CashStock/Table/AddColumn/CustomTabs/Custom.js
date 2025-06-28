import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Box, TextField } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Inter',
    color: '#ADB5BD',
  },
  input:{
    fontFamily: 'Inter',
  },
}))

const Custom = ({formula, setFormula,}) => {

  const classes = useStyles()

  return (
    <>
      <Box pt={3} pb={2}>
        <TextField
        label="Formula"
        variant="outlined"
        value={formula}
        onChange={event => setFormula(event.target.value)}
        fullWidth    
        InputLabelProps={{
          className: classes.root
        }}
        InputProps={{
          className: classes.input
        }}
        helperText="Eg: (prev_close * open_price) / 2"
        >
        </TextField>
      </Box>
    </>
  )
}

export default Custom
