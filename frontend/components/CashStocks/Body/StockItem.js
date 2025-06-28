import Link from 'next/link'

import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Paper, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: 180,
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease-in-out',
    borderRadius: '5px',
    // backgroundColor: theme.palette.primary.main,

    '&::after': {
      content: '""',
      'z-index': -1,
      opacity: 0,
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      transition: 'opacity 0.3s ease-in-out',
    },

    '&:hover': {
      transform: 'scale(1.2, 1.2)'
    },
    '&:hover::after': {
      opacity: 1
    }
  },
  link: {
    textDecoration: 'none'
  }
}))

const StockItem = ({stock}) => {

  const classes = useStyles()

  return (
    <>
      <Link href={`cash/${stock.symbol}`} passHref>
        <a className={classes.link}>
          <Box px={2} pt={4}>
            <Paper 
            variant="outlined"
            classes={{
              root: classes.root
            }}>
              <Box p={1} display="flex" justifyContent="center">
                <Typography variant="subtitle1" color="secondary" style={{fontFamily: 'Montserrat', fontWeight: 600}}>
                  {stock.symbol}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </a>
      </Link>
    </>
  )
}

export default React.memo(StockItem)
