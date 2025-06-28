import { Box, Typography } from '@material-ui/core'

import ToggleButton from './ToggleButton'

const CustomSwitch = ({toggle, handleToggle}) => {
  return (
    <>
      <Box display="flex" justifyContent="start" alignItems="center">
        <Box pr={1}>
          <Typography variant="subtitle1" style={{fontFamily: 'Inter'}}>
            Custom:
          </Typography>
        </Box>
        <Box>
          <Typography style={{fontFamily: 'Inter'}} variant="subtitle2">
            Off
          </Typography>
        </Box>
        <Box px={1}>
          <ToggleButton toggle={toggle} handleToggle={handleToggle} />
        </Box>
        <Box>
          <Typography style={{fontFamily: 'Inter'}} variant="subtitle2">
            On
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default CustomSwitch
