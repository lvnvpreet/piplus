import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, TextField, Button } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 24,
    [theme.breakpoints.down('sm')]:{
      fontSize: 22
    },
    [theme.breakpoints.down('xs')]:{
      fontSize: 20
    }
  }
}))

import Fields from './Fields'

const Content = ({description, setDescription, conditions, setConditions, loading, limit, setLimit, columns}) => {

  const classes = useStyles()

  const handleAdd = () => {
    try{
      const values = [...conditions, { 
        field1: 'prev_close',
        field1Day: '0', 
        operator: 1, 
        field2: 'open_price',
        num: false, 
        multiplier: 1, 
        field2Day: '0', 
        num_field: 1 
      }]
      setLimit(limit + 1)
      setConditions(values)
    } catch(err) {
      console.log(err)
    }
  }

  const handleChange = (i, event, op) => {
    const values = [...conditions]
    values[i][op] = event.target.value
    setConditions(values)
  }

  const handleNumChange = (i, event) => {
    const values = [...conditions]
    values[i]['num_field'] = event.target.value
    setConditions(values)
  }

  const handleToggleChange = (i) => {
    const values = [...conditions]
    values[i]['num'] = !values[i]['num']
    setConditions(values)
  }
  
  const handleRemove = (i) => {
    try{
      const values = [...conditions]
      values.splice(i, 1)
      if(limit > values.length){
        setLimit(values.length)
      }
      setConditions(values)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Box p={2} pt={3}>
          <Typography 
          color="secondary" 
          className={classes.title}
          >
            Description
          </Typography>
          <Box mt={2}>
            {loading 
            ? <Skeleton height={70} animation="wave" />
            : 
            <TextField 
            variant="outlined"
            multiline
            rowsMax={4}
            fullWidth
            value={description}
            onChange={event => setDescription(event.target.value)}
            />
            }
          </Box>
          <Box mt={3}>
            <Typography 
            color="secondary" 
            className={classes.title}
            >
              Conditions
            </Typography>
          </Box>
          {conditions.map((c, i) => (
            <Fields 
            key={i}
            idx={i} 
            {...c}
            handleRemove={handleRemove}
            handleChange={handleChange}
            handleNumChange={handleNumChange}
            handleToggleChange={handleToggleChange}
            loading={loading}
            columns={columns}
            />
          ))}
          
          <Box mt={4} display="flex" justifyContent="center">
            <Button
            variant="contained"
            color="primary"
            disableElevation
            style={{fontWeight: 600}}
            onClick={() => handleAdd()}
            >
              Add Condition
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Content
