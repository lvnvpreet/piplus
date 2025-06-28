import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Menu, MenuItem } from '@material-ui/core'

import { toast } from 'react-toastify'
import { FaBan } from 'react-icons/fa'
import { TiDelete } from 'react-icons/ti'
import { FiExternalLink } from 'react-icons/fi'
import { IoIosRemoveCircle } from 'react-icons/io'

import { axiosInstance } from '../../../axios'

const useStyles =  makeStyles(theme => ({
  stock__name: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  delete: {
    // backgroundColor: '#DE350B', 
    color: '#DE350B',
  },
  blocked: {
    color: '#DE350B',
    paddingLeft: '1px'
  }
}))

const Name = ({
  value, 
  session,
  row: { original },
  data,
  setData
}) => {

  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()
  const classes = useStyles()
  const [blockStatus, setBlockStatus] = useState(false)

  useEffect(() => {
    setBlockStatus(original.block)
  }, [value])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBlackList = async() => {
    try{
      setAnchorEl(null)
      setBlockStatus(!blockStatus)
      const res = await axiosInstance.post('/cash/stock/block/update', {
        id: original._id,
        blockStatus: blockStatus
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

  const handleDelete = async() => {
    try{
      setAnchorEl(null)
      const filteredData = data.filter(d => d._id !== original._id)
      setData(filteredData)
      const res = await axiosInstance.post('/cash/stock/delete',{
        id: original._id
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
  
  const handleLeftClick = () => {
    router.push(`/cash/${value}`)
  }
  
  document.addEventListener('contextmenu', (event) => {
    if(event.originalTarget.id === 'stockName'){
      event.preventDefault()
    }
  }, false)

  return (
    <>
      <div id='stockName' 
      aria-controls="simple-menu" 
      aria-haspopup="true"
      onClick={handleLeftClick}
      onContextMenu={e => {handleClick(e); return false}}
      className={classes.stock__name}
      >
        {value}
        {blockStatus ? <span className={classes.blocked}> <FaBan size="13" /> </span> : null}
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Box display="flex" justifyContent="space-between"  alignItems="center">
            <Box style={{paddingLeft: '4px'}}>
              <FiExternalLink size="17" />
            </Box>
            <Box pl={1}>
              <a href={`/cash/${value}`} target='_blank' style={{textDecoration: 'none', color: '#000'}}>Open in new Tab</a>
            </Box>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleBlackList}>
          <Box display="flex" justifyContent="space-between"  alignItems="center">
            <Box style={{paddingLeft: '4px'}}>
              {blockStatus ? <IoIosRemoveCircle size="17" /> : <FaBan size="15" /> }
            </Box>
            <Box pl={1}>
              {blockStatus ? 'Unblock' : 'Block'}
            </Box>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleDelete} className={classes.delete}>
        <Box display="flex" justifyContent="start"  alignItems="center">
              <TiDelete size="22"  />
            <Box pl={1}>
              Delete
            </Box>
          </Box>
        </MenuItem>
      </Menu>
    </>
  )
}

export default Name
