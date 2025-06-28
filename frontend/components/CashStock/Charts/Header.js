import { Box, Typography } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 600,
    color: theme.palette.secondary.main,
    fontSize: 28,
    fontFamily: 'Montserrat'
  },
}))

const Header = () => {

  const classes = useStyles()

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography className={classes.title}>
          Charts
        </Typography>
      </Box>
    </>
  )
}

export default Header
