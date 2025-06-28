import { format } from 'date-fns'
import Chip from '@material-ui/core/Chip'

export const defaultHeaders = [
    {
      Header: 'Strike Price',
      accessor: 'strike_price',
    },
    {
      Header: 'OI',
      accessor: 'oi',
    },
    {
      Header: 'Change in OI',
      accessor: 'change_in_oi',
    },
    {
      Header: 'IV',
      accessor: 'iv',
    },
    {
      Header: 'LTP',
      accessor: 'ltp',
    },
    {
      Header: 'Change in LTP',
      accessor: 'change_in_ltp',
    },
    {
      Header: 'Magic No',
      accessor: 'magic_no',
    },
    {
      Header: 'PREMIUM_TR',
      accessor: 'PREMIUM_TR'
    },
    {
      Header: 'settlement',
      accessor: 'settlement'
    },
    {
      Header: 'TRADED_QUA',
      accessor: 'TRADED_QUA'
    },
    {
      Header: 'Type',
      accessor: 'type',
      Cell: ({value}) => <Chip label={value} style={{backgroundColor: value== 'CE' ? '#D70070' : '#00A9E0', color: '#fff'}} />
    },
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ({value}) => <div style={{width: 100}}>{format(new Date(value), 'PP')}</div>
    },
    {
      Header: 'Expiry Date',
      accessor: 'expiry_date',
      Cell: ({value}) => <div style={{width: 100}}>{format(new Date(value), 'PP')}</div>
    },
]