import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import { getSession } from "next-auth/client"

import NonLogged from '@layouts/NonLogged'

import { Box, Typography, Tabs, Tab} from '@material-ui/core'

import Header from '@components/Login/Header'
import Content from '@components/Login/Content'
import RegisterContent from '@components/Login/RegisterContent'

const login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    // Clear form fields when switching tabs
    setEmail('')
    setPassword('')
    setName('')
  }

  return (
    <>
      <Head>
        <title>{tabValue === 0 ? 'Login' : 'Register'} | Pi Plus</title>
      </Head>
      <NonLogged>
        <Box p={3} px={4}>
          <Typography variant="h5" color="primary" style={{fontWeight: 600}}>
              Pi Plus
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="65vh">
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Header />
            
            {/* Tabs for Login/Register */}
            <Box mt={2} mb={1}>
              <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                <Tab label="Login" style={{textTransform: 'none', fontSize: '1rem'}} />
                <Tab label="Register" style={{textTransform: 'none', fontSize: '1rem'}} />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {tabValue === 0 ? (
              <Content email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
            ) : (
              <RegisterContent 
                name={name} 
                setName={setName}
                email={email} 
                setEmail={setEmail} 
                password={password} 
                setPassword={setPassword} 
              />
            )}
          </Box>
        </Box>
      </NonLogged>
    </>
  )
}

export const getServerSideProps = async(context) => {

  const session = await getSession(context)

  if(session){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return { props: { } }
}

export default login
