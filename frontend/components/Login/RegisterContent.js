import { useState } from 'react'

import { useRouter } from 'next/router'

import { Box, TextField, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core'

import { BsPerson } from 'react-icons/bs'
import { BiKey } from 'react-icons/bi'
import { AiOutlineMail } from 'react-icons/ai'
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri'

import { toast } from 'react-toastify'

import { axiosInstance } from '../../axios'

const RegisterContent = ({name, setName, email, setEmail, password, setPassword}) => {

  const router = useRouter()
  const [btnText, setBtnText] = useState('Register')
  const [disabled, setDisabled] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async() => {
    try{
      if (!name || !email || !password) {
        toast.error('Please fill in all fields')
        return
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }

      setBtnText('Registering...')
      setDisabled(true)
      
      const res = await axiosInstance.post('/auth/register', {
        name: name,
        email: email,
        password: password
      })
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
        toast.success(res.data.message || 'Registration successful!')
        router.push('/')
      }
    } catch(err) {
      setBtnText('Register')
      setDisabled(false)
      if (err.response?.data?.error) {
        toast.error(err.response.data.error)
      } else {
        toast.error('Registration failed. Please try again.')
      }
    }
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" flexDirection="column" mt={2} width="100%" px={2}>
        <Box mt={3}>
          <TextField 
          label="Full Name"
          variant="outlined"
          type="text"
          fullWidth
          InputProps={{
            startAdornment: <BsPerson size="22" style={{color: '#8e8e8e'}} />,
          }}
          value={name}
          onChange={event => setName(event.target.value)}
          />
        </Box>
        <Box mt={3}>
          <TextField 
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          InputProps={{
            startAdornment: <AiOutlineMail size="22" style={{color: '#8e8e8e'}} />,
          }}
          value={email}
          onChange={event => setEmail(event.target.value)}
          />
        </Box>
        <Box mt={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput 
              id="outlined-adornment-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              startAdornment={ <InputAdornment><BiKey size="22" style={{color: '#8e8e8e'}} /></InputAdornment> }
              endAdornment={<InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)} style={{color: '#8e8e8e'}}>
                  {showPassword ? <RiEyeLine /> : <RiEyeCloseLine />}
                </IconButton>
              </InputAdornment>}
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </FormControl>
        </Box>
        <Box mt={4} display="flex" justifyContent="flex-end" flexDirection="row">
          <Button 
          color="primary" 
          variant="contained" 
          disableElevation 
          disabled={disabled}
          onClick={() => handleSubmit()}
          style={{textTransform: 'none', fontSize: '1rem'}}
          >
            {btnText}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default RegisterContent
