import { format } from 'date-fns'

export const defaultHeaders = [
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ({value}) => <div style={{width: 85}}>{format(new Date(value), 'PP')}</div>
    },
    {
      Header: 'Prev_Close',
      accessor: 'prev_close',
    },
    {
      Header: 'Open_Price',
      accessor: 'open_price',
    },
    {
      Header: 'High_Price',
      accessor: 'high_price',
    },
    {
      Header: 'Low_Price',
      accessor: 'low_price',
    },
    {
      Header: 'Last_Price',
      accessor: 'last_price',
    },
    {
      Header: 'Close_Price',
      accessor: 'close_price',
    },
    {
      Header: 'Avg_Price',
      accessor: 'avg_price',
    },
    {
      Header: 'Ttl_Trd_Qnty',
      accessor: 'ttl_trd_qnty',
    },
    {
      Header: 'Turnover_Lacs',
      accessor: 'turnover_lacs',
    },
    {
      Header: 'No_Of_Trades',
      accessor: 'no_of_trades',
    },
    {
      Header: 'Deliv_Qty',
      accessor: 'deliv_qty',
    },
    {
      Header: 'Deliv_Per',
      accessor: 'deliv_per',
    },
]