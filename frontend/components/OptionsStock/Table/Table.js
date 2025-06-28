import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import { 
  TableContainer, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
} from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import Header from './Header'
import { defaultHeaders } from '@constants/Options/Table'

import { useTable } from 'react-table'
import { MdExpandMore } from 'react-icons/md'

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

const OptionsTable = ({loading, stockData, updatedDate}) => {

  const classes = useStyles()
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  useEffect(() => {
    setColumns([...defaultHeaders])
    stockData.length > 1 && setData([...stockData])
  }, [stockData])
  return (
    <>
      <Box px={{xs: 1, sm: 1, md: 2}}>
        <Header 
        updatedDate={updatedDate}
        />
        {
          loading
          ?
          <Box mt={-5}>
            <Skeleton height={300} animation="wave" />
          </Box>
          :
          <Box mt={2}>
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
              </AccordionDetails>
            </Accordion>
          </Box>
        }
      </Box>
    </>
  )
}

export default OptionsTable
