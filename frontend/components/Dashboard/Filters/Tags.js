import React from 'react'

import {TextField, Chip} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

const ColumnFilter = ({ tags, setTagsFilterValue}) => {

  return (
    <>
      <Autocomplete 
        multiple
        id="tags-standard"
        options={tags}
        onChange={(e, v) => setTagsFilterValue([...v])}
        renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip 
              size="small" 
              label={typeof option === 'string' ? option : option.inputValue} 
              {...getTagProps({ index })}
              color="primary" 
              />
            ))
        }
        renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              InputProps={{...params.InputProps, disableUnderline: true}}
            />
          )}
        />
    </>
  )
}

export default ColumnFilter
