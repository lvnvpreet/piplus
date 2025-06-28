import { makeStyles } from '@material-ui/core/styles'
import  { Box, Typography, TextField, InputAdornment, Hidden } from '@material-ui/core'

import UploadExcel from './UploadExcel'

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 600,
    color: theme.palette.secondary.main,
    fontSize: 28,
    fontFamily: 'Montserrat'
  },
  fieldLabel: {
    color: '#ADB5BD'
  },
  
}))

const Header = ({title, openDialog, handleFileUpload}) => {

  const classes = useStyles()

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography className={classes.title}>
          {title}
        </Typography>
        <UploadExcel openDialog={openDialog} handleFileUpload={handleFileUpload} />
      </Box>
    </>
  )
}

export default Header
