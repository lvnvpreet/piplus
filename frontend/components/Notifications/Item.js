import Link from 'next/link'

import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'

import { Links, externalLinks } from '@constants/Notifications'

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
    textDecoration: 'none',
    color: '#000',
    '&:hover': {
        '--tw-text-opacity': 1,
        color: 'rgba(0,122,255,var(--tw-text-opacity))'
        // transform: 'scale(1.2, 1.2)'
    },
    '&:active': {
        color: '#1890ff'
    }
  },
  content: {
      display: 'flex',
      justifyContent: 'center'
  }
}))

const Item = ({ item, count, percentage, expandAll}) => {

  const classes = useStyles()
  const [bgColor, setBgColor] = useState('#fff')
  const [expand, setExpand] = useState(true)


  useEffect(() => {
    setExpand(expandAll)
  }, [expandAll])

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
  }, [])

  return (
    <>
        <Box px={2} pb={4} display="flex" justifyContent="center" alignItems="center">
            <Accordion
            classes={{
                root: classes.root
            }}
            variant="outlined"
            elevation={0}
            style={{borderColor: bgColor}}
            TransitionProps={{ unmountOnExit: true }}
            expanded={expand}
            onChange={() => setExpand(!expand)}
            >
                <AccordionSummary
                aria-controls="panel2a-content"
                id="panel2a-header"
                classes={{
                    content: classes.content
                }}
                style={{backgroundColor: bgColor}}
                >
                    <Typography variant="subtitle1" color="secondary" style={{fontFamily: 'Montserrat', fontWeight: 600}}>
                            {item.name}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                  <Box pr={2}>
                  {
                    percentage >= 0
                    ? <Typography variant="subtitle1" style={{color: 'green'}}>+{percentage}%</Typography>
                    : <Typography variant="subtitle1" style={{color: 'red'}}>{percentage}%</Typography>
                  } 
                  </Box>
                    {Links.map((link, i) => (
                        <Box pr={1} key={i}>
                            <Link href={`/${link.page}/${item._id}`} passHref>
                                <a className={classes.link}>
                                    <Typography variant="subtitle1">{link.name}</Typography>
                                </a>
                            </Link>
                        </Box>
                    ))}
                    {
                        externalLinks.map((link, i) => (
                            <Box pr={1} key={i}>
                                <a className={classes.link} href={`${link.url}${item._id}`}>
                                    <Typography variant="subtitle1">{link.name}</Typography>
                                </a>
                            </Box>
                        ))
                    }
                </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    </>
  )
}

export default Item
