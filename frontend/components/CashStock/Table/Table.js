import React, { useEffect, useState, useMemo } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { 
  Box, 
  TableContainer, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails 
} from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Header from './Header/Header'

import { useTable } from 'react-table'
import { toast } from 'react-toastify'
import { MdExpandMore } from 'react-icons/md'

import RowDelete from './RowDelete'

import { axiosInstance } from '../../../axios'

import { defaultHeaders } from 'constants/Table'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    maxWidth: '100%',
    width: '100%',
    overflowX: 'scroll',
    overflowY: 'scroll',
    maxHeight: 500
  },
  cell__root: {
    fontFamily: 'Inter'
  },
  custom__header: {
    color: '#fff', 
    padding: '5px', 
    borderRadius: '2px',
    cursor: 'pointer'
  }
}))


const MyTable = ({session, stockData, setStockData, refresh, setRefresh, loading}) => {

  const classes = useStyles()
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const [customRowId, setCustomRowId] = useState('')
  const [openDeleteDialog, setOpenDeleteDialog ] = useState(false)

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  const handleHeaderClick = (id) => {
    setCustomRowId(id)
    setOpenDeleteDialog(true)
  }

  const deleteCustomRow = async() => {
    try{
      // /stocks/stock/field/delete
      const res = await axiosInstance.post('/cash/stock/field/delete', {
        id: customRowId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      toast.success(res.data.message)
      setOpenDeleteDialog(!openDeleteDialog)
      setCustomRowId('')
      setRefresh(!refresh)
    } catch(err) {
      console.log(err)
    }
  }

  const getRowProps= row => ({
    onClick: () => {
      let filteredStockData = stockData.data.filter(d => d._id !== row.original._id)
      setStockData({...stockData, data: [...filteredStockData]})
    }
  })

  useEffect(async() => {
    try {
      let customColumns = []
      if(stockData?.customHeaders?.length > 0) {
          customColumns = stockData.customHeaders.map(c => {
            return {
              ID: c._id, 
              Header: () => <div style={{backgroundColor: (c.custom ? '#000' : 'green' )}} className={classes.custom__header} onClick={() => handleHeaderClick(c._id)}> {c.name} </div>,
              accessor: c.name,
            }
          })
      }
      setColumns([...defaultHeaders, ...customColumns])
      if(stockData?.data?.length > 0){
        setData([...stockData.data])
      }
    } catch(err) {
      console.log(err)
    }
  }, [refresh, stockData])


  return (
    <>
      <Header session={session} headers={columns} refresh={refresh} setRefresh={setRefresh} stockData={stockData} setStockData={setStockData} />
      
        {
          loading
          ?
          <Skeleton height={300} animation="wave" />
          :
          <Box p={1} mt={2}>
            <Accordion>
              <AccordionSummary
              expandIcon={<MdExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              >
                <Typography>Show / Hide Table</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table 
                  {...getTableProps()} 
                  classes={{
                    root: classes.root
                  }}
                  >
                    <TableHead>
                    {headerGroups.map(headerGroup => (
                      <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                          <TableCell {...column.getHeaderProps()}>
                            <Typography variant="subtitle2" style={{fontWeight: 600, fontFamily: 'Montserrat'}}>
                              {column.render('Header')}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    </TableHead>
                    <TableBody>
                      {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                          <TableRow {...row.getRowProps(getRowProps(row))} style={{ cursor: 'pointer' }}>
                            {row.cells.map(cell => {
                              return (
                                <TableCell {...cell.getCellProps()}>
                                  <Typography variant="subtitle2" className={classes.cell__root}>
                                    {cell.render('Cell')}
                                  </Typography>
                                </TableCell>
                              )
                            })}
                          </TableRow>
                          
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Box>
        }
        
        <RowDelete open={openDeleteDialog} setOpen={setOpenDeleteDialog} del={deleteCustomRow} />
      
    </>
  )
}

export default MyTable
