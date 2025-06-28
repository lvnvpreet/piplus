import { useState } from 'react'

import { useSession } from 'next-auth/client'

import { makeStyles } from '@material-ui/core/styles'
import { Fab } from '@material-ui/core'
import { MdKeyboardArrowUp } from 'react-icons/md'

import Drawer from '@components/Navigation/MyDrawer'
import AppBar from '@components/Navigation/MyAppBar'
import ScrollTop from '@components/Navigation/ScrollTop'

import { AiOutlineLineChart } from 'react-icons/ai'
import { FiBox } from 'react-icons/fi'
import { BiStopwatch, BiBell } from 'react-icons/bi'
import { BsFileEarmarkArrowUp } from 'react-icons/bs'

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
  content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      fontFamily: 'Inter',
      height: '100%'
  }
}))

const navItems = [
  {name: 'Cash', link: '/cash', icon: <AiOutlineLineChart size="22" />},
  {name: 'Options', link: '/options', icon: <BiBell size="22" />},
  { name: 'Futures', link: '/futures', icon: <BsFileEarmarkArrowUp size="22" /> },
  {name: 'Alerts', link: '/alerts', icon: <FiBox size="22" />},
  {name: 'Notifications', link: '/notifications', icon: <BiStopwatch size="22" />},
  
]

const Layout = ({children}) => {

  const classes = useStyles()
  const [ session, loading ] = useSession()
  const [ isOpenDrawer, setOpenDrawer ] = useState(false)

  if (loading) return null
  
  return (
    <div>
      <Drawer isOpenDrawer={isOpenDrawer} setOpenDrawer={setOpenDrawer}  nav={navItems} />
      <div id="back-to-top-anchor" />
      <AppBar setOpenDrawer={setOpenDrawer} nav={navItems} id="back-to-top-anchor" />
      <main className={classes.content}>
        {children}
      </main>
      <ScrollTop>
        <Fab color="secondary" aria-label="scroll back to top">
          <MdKeyboardArrowUp size="22" />
        </Fab>
      </ScrollTop>
    </div>
  )
}

export default Layout
