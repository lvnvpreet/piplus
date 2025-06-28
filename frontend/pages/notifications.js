import React, { useState, useEffect } from 'react'

import Default from '@layouts/Default'

import Head from 'next/head'
import { getSession } from "next-auth/client"

import { Box } from '@material-ui/core'

import Header from '@components/Notifications/Header'
import Filter from '@components/Notifications/Filter'
import Content from '@components/Notifications/Content'
import Tabs from '@components/Notifications/Tabs/Tabs'

import { axiosInstance } from '../axios'

const notifications = ({session}) => {

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [value, setValue] = useState(0)
  const [alerts, setAlerts] = useState([])
  const [expandAll, setExpandAll] = useState(true)
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [filterSwitch, setFilterSwitch] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)

  useEffect(async() => {
    const res =  await axiosInstance.get('/alerts/all',{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session.token,
      }
    })
    setAlerts(res.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    console.log(expandAll)
  }, [expandAll])

  return (
    <>
      <Head>
        <title>Notifications | Pi Plus</title>
      </Head>
      <Default>
        <Header 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate}
        expandAll={expandAll}
        setExpandAll={setExpandAll}
        />
        <Filter 
        alerts={alerts}
        filterSwitch={filterSwitch}
        setAlerts={setAlerts} 
        setFilterSwitch={setFilterSwitch} 
        selectedDate={selectedDate} 
        session={session} 
        setFilteredNotifications={setFilteredNotifications} 
        setFilterLoading={setFilterLoading} 
        />

        {filterSwitch ?
        <Box mt={2}>
          <Content 
          notifications={filteredNotifications} 
          loading={filterLoading} 
          expandAll={expandAll} 
          />
        </Box>
        :
        <Tabs 
        value={value} 
        setValue={setValue} 
        alerts={alerts}  
        loading={loading} 
        selectedDate={selectedDate}
        expandAll={expandAll}  
        session={session} 
        />
        }
      </Default>
      
    </>
  )
}

export const getServerSideProps = async(context) => {

  const session = await getSession(context)

  if(!session){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  return { props: { session } }
}

export default notifications
