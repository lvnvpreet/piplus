import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Button } from '@material-ui/core'

import Links from '@components/Common/Stock/Links'

const useStyles = makeStyles(theme => ({
  root: {
    borderBottom: '1px solid #e5e5e5',
    paddingBottom: '10px'
  },
  title: {
    fontWeight: 600,
    fontSize: 28,
    fontFamily: 'Montserrat'
  },
  btn: {
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: '#DE350B',
    color: '#fff',
  },
}))

const Header = ({children, symbol, links}) => {

  const classes = useStyles()

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} className={classes.root}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box pr={1}>
            <Typography className={classes.title} color="primary">
              ${symbol}
            </Typography>
          </Box>
          <Links links={links} symbol={symbol} />
        </Box>
        <Box display="flex" alignItems="center">
          {children}
        </Box>
      </Box>
    </>
  )
}

export default Header
