import React, { useState } from 'react'

import Head from 'next/head'
import { getSession } from "next-auth/client"

import { makeStyles } from '@material-ui/core/styles'
import { Box, Button } from '@material-ui/core'

import Default from '@layouts/Default'
import Header from '@components/Common/Stock/Header'
import Table from '@components/FuturesStock/Table'

// Icons
import { AiOutlineLineChart } from 'react-icons/ai'
import { BiBell } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'

import { axiosInstance } from '../../axios'

const useStyles = makeStyles(theme => ({
    btn: {
      fontSize: 12,
      fontWeight: 600,
      backgroundColor: '#DE350B',
      color: '#fff',
    },
}))

const stock = ({stock, session}) => {
    
    const classes = useStyles()
    const [links, setLinks] = useState([
        {
            found: true, icon: <AiOutlineLineChart size="20" title={'Go to cash page'} />, navigateTo: 'cash'
        },
        {
            found: false, icon: <BiBell size="20" title={'Go to options page'} />, navigateTo: 'options'
        }
    ])

    const handleClickDelete = async() => {
        try {
            await axiosInstance.post('/futures/stock/delete', {
                stock
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': session.token,
                }
            })
            console.log("Stock Deleted!")
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <>
            <Head>
                <title>{stock} | Pi Plus</title>
            </Head>
            <Default>
                <Header symbol={stock} links={links}>
                    <Button 
                    className={classes.btn} 
                    variant="contained"
                    disableElevation
                    style={{backgroundColor: '#DE350B', color: '#fff',}}
                    onClick={handleClickDelete} 
                    >
                        <MdDelete size="22" />
                    </Button>
                </Header>
                <Box px={{xs: 1, sm: 1, md: 2}}>
                    <Table session={session} symbol={stock} />
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
