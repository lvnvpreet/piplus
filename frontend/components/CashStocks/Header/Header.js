import { makeStyles } from '@material-ui/core/styles'
import  { Box, Typography, TextField, InputAdornment, Hidden } from '@material-ui/core'

import UploadExcel from './UploadExcel'

import { AiOutlineSearch } from 'react-icons/ai'

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

const Header = ({session, searchStock, setSearchStock, setEnterSearch}) => {
  
  const classes = useStyles()

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.title}>
          Cash
        </Typography>
        <Box display="flex" alignItems="center">
          <Hidden xsDown>
            <Box mr={3}>
              <TextField
              value={searchStock}
              onChange={event => setSearchStock(event.target.value)}
              onKeyDown={event => { event.key === 'Enter' && setEnterSearch(true)}} 
              fullWidth={false}
              margin="dense"
              label="Search"
              variant="outlined"
              InputLabelProps={{
                classes: {
                  root: classes.fieldLabel,
                  focused: classes.fieldLabel,
                }
              }}
              InputProps={{
                startAdornment: 
                <InputAdornment position="start">
                  <AiOutlineSearch size="20" color="#ADB5BD" />
                </InputAdornment>,
              }}
              />
            </Box>
          </Hidden>
          <UploadExcel session={session} />
        </Box>
      </Box>
      <Hidden smUp>
        <Box mt={2}>
          <TextField 
          fullWidth
          margin="dense"
          label="Search"
          variant="outlined"
          InputLabelProps={{
            classes: {
              root: classes.fieldLabel,
              focused: classes.fieldLabel,
            }
          }}
          InputProps={{
            startAdornment: 
            <InputAdornment position="start">
              <AiOutlineSearch size="20" color="#ADB5BD" />
            </InputAdornment>,
          }}
          />
        </Box>
      </Hidden>
    </>
  )
}

export default Header
