import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Item from '@components/Common/Stock/Item'

const useStyles = makeStyles(theme => ({
    mainBox: {
            justifyContent: 'start',
            [theme.breakpoints.down('sm')]: {
            justifyContent: "center"
        }
    },
}))

const StocksList = ({loading, stocks, page}) => {

    const classes = useStyles()

    return (
        <>
            <Box pt={2} display="flex" flexWrap="wrap" alignItems="center" className={classes.mainBox}>
            {loading ? 
                [...Array(25).keys()].map(a => (
                <Box px={2} pb={4} key={a}>
                    <Skeleton width={180} height={70} animation="wave" />
                </Box>
                )) : stocks.length > 0 ?
                    stocks
                    .map((s, i) => (
                    <Item key={i} page={page} item={{ _id: s.symbol, name: s.symbol }} />
                    )) :
                !loading &&
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh" alignContent="center" width="100%">
                    <Typography variant="h4" style={{color: '#ADB5BD'}}>
                    No Stocks Found!
                    </Typography>
                </Box>
            }
            </Box>
        </>
    )
}

export default StocksList
