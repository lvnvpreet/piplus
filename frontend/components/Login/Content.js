import { useState } from 'react'

import { useRouter } from 'next/router'
import { signIn } from 'next-auth/client' 

import { Box, TextField, Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core'

import { BsPerson } from 'react-icons/bs'
import { BiKey } from 'react-icons/bi'
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri'

import { toast } from 'react-toastify'

import { axiosInstance } from '../../axios'

const Content = ({email, setEmail, password, setPassword}) => {

  const router = useRouter()
  const [btnText, setBtnText] = useState('Login')
  const [disabled, setDisabled] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async() => {
    try{
      setBtnText('Logging In...')
      setDisabled(true)
      const res = await signIn('credentials', {email: email, password: password, redirect: false})
      if (res?.error) {
          toast.error(res.error)
          setBtnText('Login')
          setDisabled(false)
      }
      if (res.url) {
          router.push('/')
      }
    } catch(err) {
      setBtnText('Login')
      setDisabled(false)
      err.response && toast.error(err.response.data.error)
    }
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" flexDirection="column" mt={2} width="100%" px={2}>
        <Box mt={3}>
          <TextField 
          label="Email"
          variant="outlined"
          type="text"
          fullWidth
          InputProps={{
            startAdornment: <BsPerson size="22" style={{color: '#8e8e8e'}} />,
          }}
          value={email}
          onChange={event => setEmail(event.target.value)}
          />
        </Box>
        <Box mt={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="outlined-adornment-amount">Password</InputLabel>
            <OutlinedInput 
              id="outlined-adornment-amount"
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
        <Box mt={4} display="flex" justifyContent="space-between" flexDirection="row">
          <Button style={{color: '#8e8e8e', textTransform: 'none', fontSize: '1rem'}}>
            Forgot Password?
          </Button>
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

export default Content
