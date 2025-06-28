import React, { useState, useEffect } from 'react'

import Head from 'next/head'
import { getSession } from "next-auth/client"
import Default from '@layouts/Default'

import Header from '@components/Options/Header'
import OptionsList from '@components/Options/OptionsList'
import StocksList from '@components/Common/StocksList'

import { axiosInstance } from '../../axios'

const index = ({session}) => {

  const [loading, setLoading] = useState(true)
  const [stocks, setStocks] = useState([])

  useEffect(() => {
    setLoading(true)
    let didCancel = false;
    const fetchStocks = async() => {
      try{
        const res = await axiosInstance.get('/options/stocks', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          },
        })
        if(!didCancel){
          setStocks(res.data)
          setLoading(false)
        }
      } catch(err) {
        setLoading(false)
        console.log(err)
      }
    }
    fetchStocks()
  }, [])

  return (
    <>
      <Head>
        <title>Options | Pi Plus</title>
      </Head>
      <Default>
        <Header session={session} />
        <StocksList page={'options'} loading={loading} stocks={stocks} />
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

export default index
