import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Auth() {
  return (
    <Container>
      <img
        src={logo}
        alt="Logo"
        style={{
          width: '300px',
          height: 'auto',
          display: 'block',
          margin: 'auto',
          marginTop: '-50px',
          marginBottom: '-50px',
        }}
      />

      <Outlet />
    </Container>
  )
}
