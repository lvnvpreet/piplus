import Link from 'next/link'

import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Paper, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: 180,
    // backgroundColor: 'red',
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


const Item = ({item, page, count, color}) => {

  const classes = useStyles()
  const [bgColor, setBgColor] = useState(color || '#fff')

  useEffect(() => {
    if(count >= 2 && count <= 5){
      setBgColor('#ffe599')
    } else if(count >= 6 && count <= 10){
      setBgColor('#B9FABA')
    } else if(count >= 11 && count <= 15){
      setBgColor('#0CFB04')
    } else if(count > 15) {
      setBgColor('#0CFB04')
    } 
  }, [count])

  return (
    <>
      <Link href={`/${page}/${item._id}`} passHref>
        <a className={classes.link}>
          <Box px={2} pb={4}>
            <Paper 
            variant="outlined"
            classes={{
              root: classes.root
            }}
            style={{backgroundColor: bgColor}}
            >
              <Box p={1} display="flex" justifyContent="center">
                <Typography variant="subtitle1" color="secondary" style={{fontFamily: 'Montserrat', fontWeight: 600}}>
                  {item.name}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </a>
      </Link>
    </>
  )
}

export default Item
