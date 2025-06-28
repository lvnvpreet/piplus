import { TextField, Menu, MenuItem } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

const OptionField = ({label, value, idx, name, columns, handleChange}) => {
    return (
      
        <TextField
        variant="outlined" 
        label={label}
        fullWidth
        select
        value={value}
        onChange={e => handleChange(idx, e, name)}
        >
          {columns.map(d => (
            <MenuItem key={d.accessor} value={d.accessor}>
              {d.accessor}
            </MenuItem>
          ))}
        </TextField>
          
    )
  }

export default OptionField