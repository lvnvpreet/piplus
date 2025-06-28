import React from 'react'

import { Box, Typography, Accordion, AccordionSummary, AccordionDetails  } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Item from './Item'

const Content = ({loading, notifications, expandAll}) => {

  return (
    <>
      <Box display="flex" flexWrap="wrap" alignItems="center">
      {
        loading ?
        <Box display="flex" flexWrap="wrap" alignItems="center">
          {[...Array(25).keys()].map(a => (
              <Box px={2} pt={4} key={a}>
              <Skeleton width={180} height={70} animation="wave" />
            </Box>
            ))}
        </Box>
        :
        (notifications?.length > 0)
        ?
        notifications.map((n, i) => <Item key={i} item={{_id: n.stock, name: n.stock,}} percentage={n.percentage} count={n.count} expandAll={expandAll} /> )
        :
        !loading &&
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh" alignContent="center" width="100%">
          <Typography variant="h4" style={{color: '#ADB5BD'}}>
            No Notifications Found!
          </Typography>
        </Box>
      }
      </Box>
    </>
  )
}

export default Content
