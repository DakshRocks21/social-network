import { useState } from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { config } from '../../../config'
import { useApi } from '../../../utils/api'

export default function SignIn() {
  const apiRequest = useApi()
  const [isValid, setIsValid] = useState(false)
  const [firstAttempt, setFirstAttempt] = useState(true);

  const navigate = useNavigate()

  const handleSubmit = (event) => {
    void (async () => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      const response = await apiRequest(`${config.backendUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.get('username'),
          password: data.get('password'),
        }),
      })

      if (!response.ok) {
        setIsValid(false);
        setFirstAttempt(false);
        return;
      }

      setIsValid(true);
      setTimeout(() => {
        navigate('/feed');
      }, 2000);
    })()
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          { !firstAttempt && !isValid && <Typography color="error">Invalid username or password</Typography> }
           <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isValid ? "Signing In!" : "Sign In"}
          </Button>
          <Box display="flex" justifyContent={'end'}>
            <Link href="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
