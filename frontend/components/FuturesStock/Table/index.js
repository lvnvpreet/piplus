import React, { useState, useEffect } from 'react'

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
  Paper
} from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import { useTable } from 'react-table'

// Components:
import Header from './Header'

import { axiosInstance } from '../../../axios'

// Constants:
import { STOCK_TABLE_HEADERS } from '@constants/Futures'

const useStyles = makeStyles(theme => ({
  title: {
    fontWeight: 600,
    color: theme.palette.secondary.main,
    fontSize: 28,
    fontFamily: 'Montserrat'
  },
  root: {
    maxHeight: 1000
  },
}))

const MyTable = ({session, symbol}) => {

  const classes = useStyles()
  const [columns, setColumns] = useState([])
  const [months, setMonths] = useState([])
  const [month, setMonth] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  useEffect(() => {
    setColumns([...STOCK_TABLE_HEADERS])
    const getMonths = async() => {
      try{
        const res = await axiosInstance.get('/futures/stock/months', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        })
        setMonths(res.data)
        const currentMonth = res.data.find(m => new Date(m).getMonth() === (new Date()).getMonth())
        if(!currentMonth){
          setMonth(res.data[res.data.length - 1])
        } else {
          setMonth(currentMonth)
        }
      } catch(err) {
        console.log(err)
      }
    }

    getMonths()
  }, [])

  useEffect(() => {
    setLoading(true)
    let didCancel = false
    const getData = async() => {
      try {
        const res = await axiosInstance.post(`/futures/stock/${symbol}`, 
        {
          month: month
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        })
        if(!didCancel){
          console.log(res.data)
          setData(res.data)
          setLoading(false)
        }
      } catch(err) {
        console.log(err)
      }
    }
    if(month) getData()

    return () => {
      didCancel = true
    }
  }, [month])

  return (
    <>
      <Header 
      months={months}
      month={month}
      setMonth={setMonth}
      />
      <Box mt={2}>
        <Paper style={{width: '100%'}}>
        <TableContainer classes={{ root: classes.root }}>
          <Table 
            {...getTableProps()} 
            stickyHeader
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
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        </Paper>  
      </Box>
    </>
  )
}

export default MyTable
