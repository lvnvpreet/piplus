import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import { getSession } from "next-auth/client"

import Default from '@layouts/Default'

import Header from '@components/OptionsStock/Header/Header'
import Table from '@components/OptionsStock/Table/Table'
import Chart from '@components/OptionsStock/Chart/Chart'

import { axiosInstance } from '../../axios'

const stock = ({stock, session}) => {

  const [loading, setLoading] = useState(false)
  const [stockData, setStockData] = useState([])
  const [updatedDate, setUpdatedDate] = useState('')

  useEffect(() => {
    let didCancel = false
    const fetchData = async() => {
      try{
        const res = await axiosInstance.get(`/options/stock/${stock}`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': session.token,
          }
        })
        if(!didCancel){
          setStockData(res.data.optionData)
          setUpdatedDate(res.data.updatedDate)
        }
      } catch(err) {
        console.log(err)
      }
    }
    fetchData()
    return () => {
      didCancel = true
    }
  }, [])

  return (
    <>
      <Head>
        <title>{stock} | Pi Plus</title>
      </Head>
      <Default>
        <Header
        page="options" 
        stock={stock}
        session={session}
        />
        <Table 
        loading={loading}
        stockData={stockData}
        updatedDate={updatedDate}
        />
        <Chart 
        session={session}
        stock={stock}
        />
      </Default>
    </>
  )
}

export async function getServerSideProps(context) {

  const session = await getSession(context)

  if(!session){
      return {
          redirect: {
              destination: '/login',
              permanent: false,
          }
      }
  }
  return {
      props: {
          stock: context.query.stock,
          session
      }
  }
}

export default stock
