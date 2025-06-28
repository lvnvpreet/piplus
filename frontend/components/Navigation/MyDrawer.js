import React, { useState } from 'react'

import Link from 'next/link'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Drawer, List, ListItemText, ListItemIcon, Box } from '@material-ui/core'
import MuiListItem from '@material-ui/core/ListItem'

import theme from '../../theme'

const ListItem = withStyles({
  root:{
    color: theme.palette.secondary.main,
    "& .MuiListItemIcon-root": {
      color: theme.palette.secondary.main
    },
    "&$selected": {
      "& .MuiListItemIcon-root": {
        color: theme.palette.primary.main
      },
      color: theme.palette.primary.main,
      backgroundColor: '#ffedf1',
      borderRight: `3px solid ${theme.palette.primary.main}`,
    },
    "&:hover": {
      "& .MuiListItemIcon-root": {
        color: theme.palette.primary.main
      },
      color: theme.palette.primary.main,
      backgroundColor: '#ffedf1',
      borderRight: `3px solid ${theme.palette.primary.main}`,
    }
  },
  selected: {}
})(MuiListItem)

const MyDrawer = ({isOpenDrawer, setOpenDrawer, nav}) => {

  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <>
      <Drawer open={isOpenDrawer} variant="temporary" onClose={() => setOpenDrawer(false)}>
        <List style={{width: 250}} component="nav">
          {nav.map((item, index) => (
            <Box key={index} pt={2}>
              <Link href={item.link} passHref>
                <ListItem 
                button 
                selected={index === selectedIndex} 
                onClick={() => setSelectedIndex(index)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              </Link>
            </Box>
          ))}
        </List>
      </Drawer>
    </>
  )
}

export default MyDrawer
