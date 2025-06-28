import {TextField} from '@material-ui/core'

const Name = ({setNameFilterValue}) => {
  return (
    <>
      <TextField
        onChange={e => setNameFilterValue(e.target.value)}
        size="small"
        InputProps={{ disableUnderline: true}}
      />
    </>
  )
}

export default Name
