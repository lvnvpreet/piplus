import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Tabs, Tab } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import TabPanel from '@components/Common/TabPanel'
import CustomTab from './Tab'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 800,
    marginTop: 25,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  tab: {

    fontFamily: 'Montserrat',
    '-webkit-transition': 'all 0.1s ease 0.1s',
    '-moz-transition': 'all 0.1s ease 0.1s',
    '-o-transition': 'all 0.1s ease 0.1s',
    transition: 'all 0.1s ease 0.1s',

    '&:hover': {
      color: '#fff',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: '10px 0 0 10px',
      opacity: 1
    },
    '&.Mui-selected':{
      color: '#fff',
      backgroundColor: theme.palette.secondary.main,
      borderRadius: '10px 0 0 10px',
    }

  }
}))

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const MyTabs = ({value, setValue, alerts, loading, selectedDate, expandAll, session}) => {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {loading ?
        <Tab label={<Skeleton width={"100%"} height={'100%'} className={classes.tab} animation={"wave"} />} />
        :
        alerts.length > 0 && alerts.map((a, i) => <Tab key={i} label={a.name} className={classes.tab} {...a11yProps(i)} />)
        }
      </Tabs>

      {[...Array(25).keys()].map(a => (
          <TabPanel key={a} value={value} index={a}>
            <CustomTab alerts={alerts} value={value} selectedDate={selectedDate} expandAll={expandAll} session={session} />
          </TabPanel>
        ))
      }
      
    </div>
  )
}

export default MyTabs
