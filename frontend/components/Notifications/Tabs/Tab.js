import { useEffect, useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Item from '@components/Common/Stock/Item'

import Content from '../Content'

import { axiosInstance } from '../../../axios'

const Tab = ({ alerts, value, selectedDate, expandAll, session}) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try{
      setLoading(true)
      let didCancel = false;

      const fetchNotifications = async() => {
        try{  
          if(alerts[value]?._id){
            const res = await axiosInstance.post('/notifications/all',{
              date: selectedDate,
              alertId: alerts[value]?._id
            }, 
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': session.token,
              },
            })
            if(!didCancel){
              setNotifications(res.data)
              setLoading(false)
            }
          }
        } catch(err){
          console.log(err)
        }
      }
      fetchNotifications()
      
      return () => {
        didCancel = true
      }
    } catch(err) {
      console.log(err)
    }
  }, [alerts, value, selectedDate])

  return (
    <>
      <Content notifications={notifications} loading={loading} expandAll={expandAll} />
    </>
  )
}

export default Tab
