import { format } from 'date-fns'

import Name from '@components/Dashboard/Cells/Name'
import Editable from '@components/Dashboard/Cells/Editable'
import Tags from '@components/Dashboard/Cells/Tags'

import TagsFilter from '@components/Dashboard/Filters/Tags'
import NameFilter from '@components/Dashboard/Filters/Name'

export const defaultHeaders = [
    {
        Header: 'No.',
        accessor: 'num',
        Cell: ({row, pageIndex}) =>  <>{(pageIndex * 100) + (row.index + 1)}</>,
        disableSortBy: true,
        disableFilters: true,
    },
    {
        Header: 'Name',
        accessor: 'name',
        Cell: Name,
        disableSortBy: true,
        Filter: NameFilter
    },
    {
        Header: 'Last Updated',
        accessor: 'last_updated',
        Cell: ({value}) => <>{format(new Date(value), 'PP')}</>,
        disableFilters: true,
    },
    {
        Header: 'Number of Entries',
        accessor: 'no_of_entries',
        sortType: 'number',
        disableFilters: true,
    },
    {
        Header: 'Tags',
        accessor: 'tags',
        disableSortBy: true,
        Cell: Tags,
        Filter: TagsFilter
    },
    {
        Header: 'Note',
        accessor: 'note',
        Cell: Editable,
        disableFilters: true,
        disableSortBy: true,
    }
]