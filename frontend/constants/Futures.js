import { format } from 'date-fns'

// Cells:
import Name from '@components/Futures/Cells/Name'

export const TABLE_HEADERS = [
    {
        Header: 'No.',
        accessor: '_id',
        Cell: ({row, pageIndex}) =>  <>{(pageIndex * 100) + (row.index + 1)}</>,
        disableSortBy: true,
        disableFilters: true,
    },
    {
        Header: 'Name',
        accessor: 'symbol',
        Cell: Name,
        disableSortBy: true,
    },
]

export const STOCK_TABLE_HEADERS = [
    {
        Header: 'Date',
        accessor: 'date',
        Cell: ({value}) => <>{format(new Date(value), 'PP')}</>,
    },
    {
        Header: 'Month',
        accessor: 'month',
        Cell: ({value}) => <>{format(new Date(value), 'MMM yyyy')}</>,
    },
    {
        Header: 'Close Price',
        accessor: 'close_price',
    },
    {
        Header: 'Chg in Close Price',
        accessor: 'chg_in_close_price',
        Cell: ({value}) =>  <span style={{ color: value >= 0 ? 'green': 'red'}}>{value}</span>
    },
    {
        Header: 'PD',
        accessor: 'pd'
    },
    {
        Header: 'Chg in PD',
        accessor: 'chg_in_pd',
        Cell: ({value}) =>  <span style={{ color: value >= 0 ? 'green': 'red'}}>{value}</span>
    },
    {
        Header: 'Settlement',
        accessor: 'settlement',
    },
    {
        Header: 'Net Change',
        accessor: 'net_change',
    },
    {
        Header: 'OI NO CON',
        accessor: 'oi_no_con',
    },
    {
        Header: 'Chg in Oi',
        accessor: 'chg_in_oi',
        Cell: ({value}) =>  <span style={{ color: value >= 0 ? 'green': 'red'}}>{value}</span>
    },
    {
        Header: 'Traded Qty',
        accessor: 'quantity',
    },
    {
        Header: 'TRD NO CON',
        accessor: 'trd_no_con',
    },
    {
        Header: 'Value',
        accessor: 'value',
    },
    {
        Header: 'Underlying Value',
        accessor: 'underlying_value'
    },
    {
        Header: 'Chg in UV',
        accessor: 'chg_in_underlying_value',
        Cell: ({value}) =>  <span style={{ color: value >= 0 ? 'green': 'red'}}>{value}</span>
    },
    {
        Header: 'Money Flow',
        accessor: 'money_flow'
    },
    {
        Header: 'PD Conclusion',
        accessor: 'pd_conclusion',
        Cell: ({value,}) => typeof(value) === "boolean" ? <div style={{textAlign: 'center', background: value  ? 'green': 'red', padding: 10, color: '#fff', borderRadius: 8}}>{value ? 'True' : 'False'}</div> : '-'
        
    },
    {
        Header: 'Conclusion',
        accessor: 'conclusion',
        Cell: ({value, row}) => value ? <div style={{textAlign: 'center', background: row.original.color ? 'green': 'red', padding: 10, color: '#fff', borderRadius: 8}}>{value}</div> : '-'
        
    },
    {
        Header: 'Summary',
        accessor: 'summary',
        Cell: ({value, row}) => value ? <div style={{textAlign: 'center', background: row.original.color ? 'green': 'red', padding: 10, color: '#fff', borderRadius: 8}}>{value}</div> : '-'
    },
    {
        Header: 'Remarks',
        accessor: 'remarks',
        Cell: ({value}) => value ? value : '-'
    },
]