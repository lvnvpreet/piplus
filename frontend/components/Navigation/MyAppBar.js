import React from 'react'

import { useRouter } from 'next/router'
import Link from 'next/link'
import { signOut } from 'next-auth/client'

import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Button, Typography, Box, Hidden } from '@material-ui/core'

import { BiMenuAltLeft } from 'react-icons/bi'
import { FiLogOut } from 'react-icons/fi'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        borderBottom: '1px solid #e5e5e5'
    },
    menu: {
        color: '#ADB5BD', //'#ADB5BD',
        marginRight: theme.spacing(3),
        cursor: 'pointer',
    },
    title: {
        [theme.breakpoints.down('sm')]: {
            flexGrow: 1
        },
        fontWeight: 600,
        fontFamily: 'Inter'
    },
    link: {
        [theme.breakpoints.down('sm')]:{
            paddingRight: 15,
            paddingLeft: 15,
        },
        paddingRight: 30,
        paddingLeft: 30,
        fontWeight: 500,
        cursor: 'pointer',
        letterSpacing: '1px'
    }
}))




const MyAppBar = ({setOpenDrawer, nav}) => {

    const classes = useStyles()
    const router = useRouter()

    const handleLogout = () => {
        signOut({redirect: false})
        router.push('/login')
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" elevation={0} color="default">
                <Toolbar>
                    <Hidden smUp>
                        <BiMenuAltLeft className={classes.menu} size="28" onClick={() => setOpenDrawer(true)} />
                    </Hidden>
                    <Link href='/' passHref>
                        <a style={{textDecoration: 'none'}}>
                            <Typography variant="h6" color="primary" className={classes.title}>
                                Pi Plus
                            </Typography>
                        </a>
                    </Link>
                    <Hidden xsDown>
                        <Box display="flex" justifyContent="center" flexGrow={1} alignItems="center">
                            {nav.map((item, index) => (
                                <Link href={item.link} passHref key={index}>
                                    <a style={{textDecoration: 'none'}}>
                                        <Typography variant="caption" color="secondary" className={classes.link} >
                                            {item.name.toUpperCase()}
                                        </Typography>
                                    </a>
                                </Link>
                            ))}
                    </Box>
                    </Hidden>
                    <Button 
                    variant="contained" 
                    style={{backgroundColor: '#DE350B', color: '#fff', fontSize: 14, fontWeight: 600}} 
                    disableElevation
                    title="Logout"
                    onClick={handleLogout}
                    >
                        <FiLogOut size="22" />
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default MyAppBar
