import React, { useState, useEffect } from 'react'

import {TextField, Chip} from '@material-ui/core'
import Autocomplete, { createFilterOptions }  from '@material-ui/lab/Autocomplete'
import { axiosInstance } from '../../../axios'

const filter = createFilterOptions()

const Tags = ({
  value: initialValue, 
  row: { original },
  session,
  tags
}) => {
  
  const [value, setValue] = useState([...(initialValue?.length > 0 ? initialValue : [])])

  useEffect(() => {
    setValue([...(initialValue?.length > 0 ? initialValue : [])])
  }, [initialValue])

  const handleTagsChange = async(v) => {
    try{
      v = v.map(a => (typeof a === 'object') ? a.inputValue : a)
      await axiosInstance.post('/cash/stock/tags/update', {
        id: original?._id,
        tags: v
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.token,
        }
      })
      setValue([...v])
    } catch(err) {
      console.log(err)
    }
    
  }

  

  return (
    <>
      <Autocomplete 
        multiple
        id="tags-standard"
        options={tags}
        value={value}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          // Suggest the creation of a new value
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              title: `Add "${params.inputValue}"`
            });
          }

          return filtered;
        }}
        defaultValue={value}
        getOptionLabel={(option) => {
          if (option.inputValue) {
            return `Add "${option.inputValue}"`
          }
          return option
        }}
        onChange={(e, v) => handleTagsChange(v)}
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

export default Tags
