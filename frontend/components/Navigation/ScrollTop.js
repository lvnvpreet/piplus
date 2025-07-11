import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Zoom, useScrollTrigger } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
}))

const ScrollTop = ({children}) => {

  const classes = useStyles()
  const trigger = useScrollTrigger();

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };


  return (
    <>
      <Zoom in={trigger}>
        <div onClick={handleClick} role="presentation" className={classes.root}>
          {children}
        </div>
      </Zoom>
    </>
  )
}

export default ScrollTop
