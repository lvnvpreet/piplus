import React, { useState, useEffect } from 'react'

import Head from 'next/head'
import { getSession } from "next-auth/client"

// Components:
import Default from '@layouts/Default'
import Header from '@components/Common/Stocks/Header'
import Table from '@components/Futures/Table'
import StocksList from '@components/Common/StocksList'

import { toast } from 'react-toastify'

import { axiosInstance } from '../../axios'


const index = ({session}) => {

  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState([])

  useEffect(() => {
    setLoading(true)
    let didCancel = false
    const getData = async() => {
      try {
        const res = await axiosInstance.get(`/futures/stocks/all`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
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

    getData()
  }, [])

  const handleFileUpload = async(event) => {
    try{
      setOpenDialog(true)
      let formData = new FormData()
      formData.append('excel', event.target.files[0])
      const res = await axiosInstance.post('/futures/upload-file', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      setOpenDialog(false)
      toast.success(res.data.message)
    } catch(err) {
      console.log(err)
      if(err.response){
        setOpenDialog(false)
        toast.error(err.response.data.error)
      }
    }
  }
  return (
    <>
      <Head>
        <title>Futures | Pi Plus</title>
      </Head> 
      <Default>
        <Header
        title='Futures' 
        openDialog={openDialog} 
        handleFileUpload={handleFileUpload} 
        />
        {/* Make the Stocks List as Reusable component in Future */}
        <StocksList loading={loading} stocks={stocks} page={'futures'} />
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
