import { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, TextField, IconButton, MenuItem } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import { MdDelete } from 'react-icons/md'

import ToggleButton from '@components/CashStock/Table/AddColumn/CustomSwitch/ToggleButton'
import NumField from '../Fields/NumField'
import OptionField from  '../Fields/OptionField'
import { comparisonOperators } from '@constants/Alert'

const useStyles = makeStyles(theme => ({
  textfield__box: {
    minWidth: 430,
    [theme.breakpoints.down('xs')]:{
      minWidth: 0,
      // maxWidth: 200
    }
  }
}))

const Fields = (props) => {

  const classes = useStyles()
  const {
    idx, 
    field1, 
    operator, 
    field2, 
    num, 
    multiplier, 
    field1Day, 
    field2Day, 
    num_field, 
    handleRemove, 
    handleChange,
     handleNumChange, 
     handleToggleChange,  
     loading, 
     columns
  } = props


  return (
    <>
      <Box mt={2} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
        <Box  display="flex" justifyContent="center" alignItems="center" pr={1}>
          <Box pr={1}>
            Num: 
          </Box>
          <ToggleButton 
          toggle={num || false}
          handleToggle={() => handleToggleChange(idx)}
          />
        </Box>
        <Box px={1} className={classes.textfield__box} mt={{xs: 2, sm: 2, md:1}}>
          {loading
          ? <Skeleton height={75} animation="wave" />
          :
          <OptionField 
            label='Field 1' 
            value={field1} 
            idx={idx} 
            name='field1' 
            columns={columns} 
            handleChange={handleChange} 
          />
          }
          
        </Box>
        <Box px={1} mt={{xs: 2, sm: 2, md:1}}>
          {loading
          ? <Skeleton height={75} width={60} animation="wave" />
          :
          <TextField
          label="D1"
          value={field1Day === '0' ? '0' : field1Day}
          variant="outlined"
          fullWidth
          style={{width: 60}}
          onChange={e => handleChange(idx, e, 'field1Day')}
          />
          }
        </Box>
        <Box px={1} mt={{xs: 2, sm: 2, md:1}}>
        {loading
        ? <Skeleton height={75} width={60} animation="wave" />
        :
        <TextField
        variant="outlined" 
        select
        value={operator}
        onChange={e => handleChange(idx, e, 'operator')}
        style={{width: 60}}
        label="Op"
        >
          {comparisonOperators.map(c => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>
        }
        </Box>
        <Box px={1} mt={{xs: 2, sm: 2, md:1}}>
        {loading
        ? <Skeleton height={75} width={60} animation="wave" />
        :
        <TextField
        label="M"
        value={multiplier || ''}
        variant="outlined"
        fullWidth
        style={{width: 60}}
        onChange={e => handleChange(idx, e, 'multiplier')}
        />
        }
        </Box>
        <Box px={1} mt={{xs: 2, sm: 2, md:1}}>
        {loading
        ? <Skeleton height={75} width={60} animation="wave" />
        :
        <TextField
        label="D2"
        value={field2Day === '0' ? '0' : field2Day}
        variant="outlined"
        fullWidth
        style={{width: 60}}
        onChange={e => handleChange(idx, e, 'field2Day')}
        />
        }
        </Box>
        <Box px={1} mt={{xs: 2, sm: 2, md:1}}  className={classes.textfield__box}>
          { num 
          ?  <NumField 
            idx={idx} 
            numField={num_field} 
            handleNumChange={handleNumChange} 
            /> 
          : <OptionField 
            label='Field 2' 
            value={field2} 
            idx={idx} 
            name='field2' 
            columns={columns} 
            handleChange={handleChange} 
            />
            }
        </Box>
        <Box px={1} mt={{xs: 2, sm: 3, md:1}}>
          <IconButton 
          style={{backgroundColor: '#DE350B', color: '#fff'}}
          onClick={() => handleRemove(idx)}
          >
            <MdDelete size="22"  />
          </IconButton>
        </Box>
      </Box>
    </>
  )
}

export default Fields
