import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../../utils/context'
import Posts from '../feed/Posts'
import { config } from '../../config'
import { useApi } from '../../utils/api'

export default function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const apiRequest = useApi()
  const [user, setUser] = useState(null)
  const { user: loggedInUser } = useUser()

  const getPosts = async () => {
    if (userId === undefined) {
      navigate('/')
      return
    }

    if (isNaN(userId)) {
      navigate('/')
      return
    }
    
    const res = await apiRequest(config.backendUrl + '/user/' + userId);
    if (res.ok) {
      const user = await res.json()
      setUser(user)
    }
  }

  useEffect(
    () => {
      getPosts()

      return () => {
        setUser(null)
      }
    },
    [navigate, userId]
  )

  const isLoggedInProfile = useMemo(() => {
    return user?.id === loggedInUser?.id
  }, [user, loggedInUser])

  async function handleAddFriend() {
    if (user === null || user.isFriend) {
      return
    }
    
    alert('todo');
  }

  async function handleUpdateProfileImage() {
    if (user === null) {
      return
    }

    alert('todo');
  }

  if (user === null || loggedInUser === null) {
    return null
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Box>
            <Avatar
              src={user.avatarUrl}
              sx={{ width: 180, height: 180, mx: 'auto' }}
            />
            <Typography variant="h5" align="center" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            {!isLoggedInProfile && !user.isFriend && (
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddFriend}
                >
                  Add Friend
                </Button>
              </Box>
            )}
            {!isLoggedInProfile && user.isFriend && (
              <Box display="flex" justifyContent="center">
                <Button variant="contained" disabled>
                  Friend
                </Button>
              </Box>
            )}
            {isLoggedInProfile && (
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleUpdateProfileImage}
                >
                  Update Profile image
                </Button>
              </Box>
            )}
          </Box>
          <Box mt="24px">
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Profile Information
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body1">First Name:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{user.firstName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Last Name:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{user.lastName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Gender</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">{user.gender}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={8}>
          {(user.isFriend || isLoggedInProfile) && (
            <Box>
              { isLoggedInProfile &&
                <Box px="64px">
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Add a Post
                    </Typography>
                    <TextField
                      label="Post Content"
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => alert('nope lol')}
                      sx={{
                        mt: 2,
                      }}
                    >
                      Post
                    </Button>
                  </Paper>
                </Box>
              }
              <Typography variant="h5" align="center">Posts by {user.firstName}:</Typography>
              <Posts author={user} />
            </Box>
          )}
          {!user.isFriend && !isLoggedInProfile && (
            <Typography variant="h5" align="center">
              You need to be friends to see posts
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}
