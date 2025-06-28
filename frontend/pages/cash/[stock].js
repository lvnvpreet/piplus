import React, { useState, useEffect } from 'react'

import Head from 'next/head'
import { getSession } from "next-auth/client"

import Default from '@layouts/Default'

// import Header from '@components/Common/Stock/Header'
import Table from '@components/CashStock/Table/Table'
import Charts from '@components/CashStock/Charts/Charts'
import Header from '@components/CashStock/Header/Header'

import { Box } from '@material-ui/core'

import {axiosInstance} from '../../axios'


const stock = ({stock, session}) => {
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [stockData, setStockData] = useState({})

    useEffect(async() => {
        try{
            setLoading(true)
            const res = await axiosInstance.get(`/cash/stock/${stock}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session.token,
                }
            })
            setStockData(res.data)
            setLoading(false)
        } catch(err) {
            setLoading(false)
            console.log(err)
        }
    }, [refresh])

    return (
        <>
            <Head>
                <title>{stock} | Pi Plus</title>
            </Head>
            <Default>
                <Header session={session} stock={stock} page={'cash'} />
                <Box px={{xs: 1, sm: 1, md: 2}}>
                    <Table session={session} stockData={stockData} setStockData={setStockData} refresh={refresh} setRefresh={setRefresh} loading={loading} setLoading={setLoading} />
                    <Charts stockData={stockData} loading={loading} />
                </Box>
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
