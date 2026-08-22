import { Box, Container } from '@mui/material'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import './App.css'
import AppAppBar from './components/AppAppBar'
import { useUser } from './utils/context'
import { useApi } from './utils/api'
import { config } from './config'

function MainApp() {
  const { user, setUser } = useUser()
  const navigate = useNavigate()
  const apiRequest = useApi()

  useEffect(() => {
    let isUser = false
    const validateToken = async () => {
      const res = await apiRequest(config.backendUrl + '/user')
      if (!res.ok) {
        navigate('/login')
      }

      try {
        isUser = true
        const data = await res.json()
        setUser(data)
      }
      catch {
        navigate('/login')
      }      
    }

    validateToken().then(() => {
      if (!isUser) {
        navigate('/login')
      }
    }).catch(() => {
      navigate('/login')
    });
  }, [])

  return (
    <Container>
      <AppAppBar />
      <Box sx={{ mt: '80px', height: 0 }} />
      <Outlet />
    </Container>
  )
}

export default MainApp
