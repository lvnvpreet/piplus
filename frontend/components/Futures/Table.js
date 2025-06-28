import React, { useState, useEffect, useMemo } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import { 
  TableContainer, 
  Table as MuiTable, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'

import { useTable, usePagination, useSortBy, useFilters } from 'react-table'

import { axiosInstance } from '../../axios'

// Constants
import { TABLE_HEADERS } from '@constants/Futures'

const Table = ({session}) => {

  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])

  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups,
    prepareRow, 
    page,
    
    gotoPage,
    state: { pageIndex  } 
  } = useTable({
    columns,
    data,

    initialState: { pageIndex: 0  },
    manualPagination: true,
    pageCount: 100,
    autoResetPage: false,
  }, 
  
  useSortBy,
  usePagination)

  useEffect(() => {
    setColumns([...TABLE_HEADERS])
  }, [])

  useEffect(() => {
    let didCancel = false
    const getData = async() => {
      try{
        const res = await axiosInstance.get(`/futures/stocks/${pageIndex}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        })
        if(!didCancel){
          setData([...res.data])
        }
      } catch(err) {
        console.log(err)
      }
    }
    getData()
    return () => {
      didCancel = true
    }
  }, [pageIndex])

  const handlePageChange = (event, value) => {
    gotoPage(value - 1)
  }


  return (
    <>
      <TableContainer>
        <MuiTable
        {...getTableProps()} 
        >
           <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <b>{column.render('Header') } </b>
                </TableCell>
              ))}
            </TableRow>
          ))}
          </TableHead>
          <TableBody {...getTableBodyProps()} > 
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render('Cell', { pageIndex: pageIndex })}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={4} mb={1}>
        <Pagination count={100} color="primary" shape="rounded" onChange={handlePageChange}/>
      </Box>
    </>
  )
}

export default Table
