import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useUser, useUsersModal } from '../utils/context'
import BfAvatar from './BfAvatar'
import { SearchBar } from './SearchBar'
import { StyledLink } from './StyledLink'
import { config } from '../config'
import { useApi } from '../utils/api'

const logoStyle = {
  width: 'auto',
  height: '85px',
  marginLeft: '8px',
  cursor: 'pointer',
}
function AppAppBar() {
  const navigate = useNavigate()
  const apiRequest = useApi()
  const { user, setUser } = useUser()
  const usersModalContext = useUsersModal()

  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    void (async () => {
      if (searchValue === '') {
        return
      }
      usersModalContext.setIsOpen(true)
      const res = await apiRequest(config.backendUrl + '/user/all?q=' + searchValue)
      const users = await res.json()
      usersModalContext.setUsers(users)
    })()
  }, [searchValue])

  useEffect(() => {
    if (usersModalContext.isOpen === false) {
      setSearchValue('')
    }
  }, [usersModalContext.isOpen])

  const handleLogout = useCallback(() => {
    setUser(null)
    apiRequest(config.backendUrl + '/auth/logout', {
      method: 'POST',
    });

    navigate('/login')
  }, [navigate, setUser])

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
              <img
                src={logo}
                style={logoStyle}
                alt="logo of BookFace"
                onClick={() => navigate('/')}
              />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem sx={{ py: '6px', px: '12px' }}>
                  <StyledLink to="/feed">Home</StyledLink>
                </MenuItem>
              </Box>
            </Box>
            <Container>
              <SearchBar setValue={setSearchValue} value={searchValue} />
            </Container>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              {user !== null && <BfAvatar user={user} />}
              <Button
                sx={{
                  fontSize: '0.8rem',
                  p: 0,
                }}
                onClick={handleLogout}
              >
                Sign out
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  )
}

export default AppAppBar
