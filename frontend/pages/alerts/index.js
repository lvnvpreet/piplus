import React, { useState, useEffect } from 'react'

import Head from 'next/head'
import { getSession } from "next-auth/client"

import Default from '@layouts/Default'

import Header from '@components/Alerts/Header'
import Lists from '@components/Alerts/Lists'

import { axiosInstance } from '../../axios'

const alerts = ({session}) => {

  const [refresh, setRefresh] = useState(false)
  const [tags, setTags] = useState([])

  useEffect(() => {
    let didCancel = false
    const getTags = async() => {
      try{
        const res = await axiosInstance.get('/cash/stock/tags', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        })
        if(!didCancel) {
          setTags([...res.data])
        }
      } catch(err) {
        console.log(err)
      }
    }

    getTags()

    return () => {
      didCancel = true
    }
  }, [])

  return (
    <>
      <Head>
        <title> Alerts | Pi Plus</title>
      </Head>
      <Default>
        <Header 
        session={session} 
        refresh={refresh}
        tags={tags} 
        setRefresh={setRefresh} 
        />
        <Lists
        session={session} 
        refresh={refresh}
        tags={tags} 
        />
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

export default alerts
