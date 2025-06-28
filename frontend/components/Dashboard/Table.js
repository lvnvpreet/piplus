import React, { useState, useEffect, useMemo } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import { 
  TableContainer, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'

import { defaultHeaders } from '@constants/DashBoard/Table'
import  { axiosInstance } from '../../axios'
import defaultColumnFilter from './Filters/defaultColumn'

import { useTable, usePagination, useSortBy, useFilters } from 'react-table'
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'
import { FaFilter } from 'react-icons/fa'


const MyTable = ({session}) => {

  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const [tags, setTags] = useState([])

  const[pageCount, setPageCount] = useState(0)
  const [ tagsFilterValue, setTagsFilterValue ] = useState([])
  const [ nameFilterValue, setNameFilterValue ] = useState('')

  const[ loading, setLoading] = useState(false)

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: defaultColumnFilter,
    }),
    []
  )

  const { 
    getTableProps, 
    getTableBodyProps, 
    headerGroups,
    prepareRow,  
    page, 
    
    gotoPage,
    state: { pageIndex, pageSize, sortBy } 
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0  },
    manualPagination: true,
    pageCount: 100,

    manualSortBy: true,
    autoResetPage: false,
    autoResetSortBy: false,

    defaultColumn,
    manualFilters: true,
    autoResetFilters: false,

    updateMyData: (id, value) => handleEditCell(id, value),
    session,
    tags,
    data,
    setData,
    setTagsFilterValue,
    setNameFilterValue,
  },
  useFilters,
  useSortBy,
  usePagination,
  
  )

  useEffect(() => {
    let didCancel = false
    setLoading(true)
    setColumns([...defaultHeaders])
    const getTags = async() => {
      try{  
        const res = await axiosInstance.get('/cash/stock/tags', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        })
        if(!didCancel) {
          setTags([...res.data])
          setLoading(false)
        }
      } catch(err) {
        console.log(err)
      }
    }

    getTags()

    return () => {
      didCancel = true
    }
    
  }, [])

  useEffect(() => {
    let didCancel = false
    setLoading(true)
    const getData = async() => {
      try {
        const res = await axiosInstance.post(`/cash/stocks/${pageIndex}`,
        {
          sortFields: sortBy,
          filterTags: tagsFilterValue,
          search: nameFilterValue
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': session.token,
          }
        })
        if(!didCancel){ 
          setData([...res.data.stocks])
          setPageCount(Math.ceil(res.data.totalCount / 100))
          setLoading(false)
        }
      } catch(err) {
        console.log(err)
      }
    }

    getData()

    

    return () => {
      didCancel = true
    }
  }, [pageIndex, sortBy, tagsFilterValue, nameFilterValue])

  const handlePageChange = (event, value) => {
    gotoPage(value - 1)
  }
  
  const handleEditCell = async(id, value) => {
    await axiosInstance.post('/cash/stock/note/update', {
      id: id,
      value: value
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session.token,
      }
    })
  }

  return (
    <>
      <TableContainer>
        <Table 
        {...getTableProps()} 
        >
          <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <b>{column.render('Header') } </b>
                    {
                      column.canFilter ? <FaFilter size="11" /> : null
                    }
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <MdArrowDropDown size="25" /> //" 🔽"
                          : <MdArrowDropUp size="25" />
                        : ""}
                        <span>
                        {
                          column.canFilter ? column.render('Filter') : null
                        }
                        </span>
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
        </Table>
      </TableContainer>
      
      <Box display="flex" justifyContent="center" mt={4} mb={1}>
        <Pagination count={pageCount} color="primary" shape="rounded" onChange={handlePageChange}/>
      </Box>
    </>
  )
}

export default MyTable
