import React, { useState, useEffect } from 'react'
import { TextField } from '@material-ui/core'

import { axiosInstance } from '../../../axios'

const Editable = ({
  value: initialValue,
  row: { original },
  updateMyData,
}) => {

  const [value, setValue] = useState(initialValue || '')

  const onChange = e => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    updateMyData(original._id, value)
  }

  useEffect(() => {
    setValue(initialValue || '')
  }, [initialValue])

  return <TextField value={value} onChange={onChange} onBlur={onBlur} InputProps={{ disableUnderline: true }} />
}

export default Editable
