import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import { getSession } from "next-auth/client"

import Default from '@layouts/Default'

import Header from '@components/Alert/Header'
import Content from '@components/Alert/Content/Content'

import { axiosInstance } from '../../axios'
import { toast } from 'react-toastify'

import { defaultHeaders } from '@constants/Table'

defaultHeaders.shift()

const Alert = ({session, id}) => {

  const [alert, setAlert] = useState({name: 'Alert'})
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  
  const [columns, setColumns] = useState([])
  const [limit, setLimit] = useState(0)
  const [description, setDescription] = useState('')
  const [conditionFields, setConditionFields] = useState([])

  useEffect(async() => {
    try{
      setLoading(true)
      const res = await axiosInstance.get(`/alerts/alert/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      
      setAlert(res.data)
      setLimit(res.data.limit)
      setDescription(res.data.description || '')
      setConditionFields(res.data.conditions)
      const custom = await axiosInstance.get('/cash/headers', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      let customHeaders = []
      if(custom.data.length > 0){
        customHeaders = custom.data.map(d => {
          return {accessor: d.name}
        })
      }
      const headers = [...defaultHeaders, ...customHeaders]
      setColumns(headers)

      setLoading(false)
    } catch(err) {
      setLoading(false)
      console.log(err)
    }
  }, [refresh])

  const handleSave = async() => {
    try{
      const res = await axiosInstance.post('/alerts/alert/conditions/save', {
        id: id,
        limit: limit,
        description: description,
        conditions: conditionFields,
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      toast.success(res.data.message)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <>
      <Head>
        <title>{alert.name} | Pi Plus</title>
      </Head>
      <Default>
        <Header
        session={session} 
        alert={alert} 
        refresh={refresh} 
        setRefresh={setRefresh}
        handleSave={handleSave}
        total={conditionFields.length}
        limit={limit} 
        setLimit={setLimit}
        />
        
        <Content 
        description={description} 
        setDescription={setDescription} 
        conditions={conditionFields} 
        setConditions={setConditionFields}
        loading={loading}
        limit={limit} 
        setLimit={setLimit}
        columns={columns} 
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
      id: context.query.id,
      session
    }
  }
}

export default Alert
