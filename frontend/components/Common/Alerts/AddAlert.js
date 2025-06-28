import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { TextField, Box, Button, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { HexColorPicker } from "react-colorful";


const useStyles = makeStyles(theme => ({
  color:{
    '& .react-colorful':{ 
      width: '100%'
    }
  }
    
}))


const AddAlert = ({open, setOpen, tags, handleSubmit}) => {

  const classes = useStyles()
  const [name, setName] = useState('')
  const [value, setValue] = useState([])
  const [color, setColor] = useState("#ffffff")

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Create Alert
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <Box>
              <TextField 
              variant="outlined"
              label="Name"
              value={name}
              onChange={event => setName(event.target.value)}
              />
            </Box>
            <Box my={2}>
            <Autocomplete 
              multiple
              id="tags-standard"
              options={tags}
              onChange={(e, v) => setValue([...v])}
              renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                    size="small" 
                    label={typeof option === 'string' ? option : option.inputValue} 
                    {...getTagProps({ index })}
                    color="primary" 
                    />
                  ))
              }
              renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Stock Tags"
                  />
                )}
              />
            </Box>
            <Box
            mb={2}
            >
              <TextField 
              variant="outlined"
              label="Color"
              value={color}
              onChange={event => setColor(event.target.value)}
              
              />
            </Box>
            <Box className={classes.color}>
             <HexColorPicker color={color} onChange={setColor}  />
            </Box>
          </Box>
        </DialogContent>
        <Box mt={1} mb={2} display="flex" alignItems="center" justifyContent="center">
        <DialogActions>
          <Button variant="contained" color="primary" disableElevation onClick={() => handleSubmit(name, value, color)}>
            Submit
          </Button>
        </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}

export default AddAlert
