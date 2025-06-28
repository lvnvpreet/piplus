import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'

import { format } from 'date-fns'

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 600,
    color: theme.palette.secondary.main,
    fontSize: 28,
    fontFamily: 'Montserrat'
  },
  btn: {
    fontSize: 12,
    height: 37,
    width: 125,
    fontWeight: 600,
  },
}))

const Header = ({updatedDate}) => {

  const classes = useStyles()

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.title}>
          Table 
        </Typography>
        <Box px={2}>
          <Typography variant="subtitle2" style={{color: 'grey'}}>
            Last Updated: {updatedDate ?  format(new Date(updatedDate), 'PPPp')  :  'Unknown'}
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default Header
