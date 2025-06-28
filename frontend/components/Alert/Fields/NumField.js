import { TextField } from '@material-ui/core'

const NumField = ({idx, numField, handleNumChange}) => {
    return (
      <TextField
      label="Field 2"
      value={numField || ''}
      variant="outlined"
      fullWidth
      onChange={e => handleNumChange(idx, e)}
      />
    )
  }

  export default NumField
