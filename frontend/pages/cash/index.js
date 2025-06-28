import React, { useState } from 'react'

import Head from 'next/head'
import { getSession } from "next-auth/client"

import Default from '@layouts/Default'
import Header from '@components/Common/Stocks/Header'
import Table from '@components/Dashboard/Table'

import { axiosInstance } from '../../axios'

import { toast } from 'react-toastify'

const dashboard = ({session}) => {

  const [openDialog, setOpenDialog] = useState(false)

  const handleFileUpload = async(event) => {
    try{
      setOpenDialog(true)
      let formData = new FormData()
      formData.append('excel', event.target.files[0])
      const res = await axiosInstance.post('/cash/upload-file', formData, {
        headers: {
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
        <title>Cash | Pi Plus</title>
      </Head> 
      <Default>
        <Header
        title='Cash' 
        openDialog={openDialog} 
        handleFileUpload={handleFileUpload} 
        />
        <Table 
        session={session}
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

export default dashboard
