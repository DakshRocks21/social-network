import { Avatar } from '@mui/material'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BfAvatar({ user, onClick }) {
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    if (onClick !== undefined) {
      onClick()
    }
    navigate(`/profile/${user.id}`)
  }, [navigate, onClick, user.id])

  return (
    <Avatar
      sx={{ cursor: 'pointer' }}
      src={user.avatarUrl}
      aria-label="recipe"
      onClick={handleClick}
    >
      {`${user.firstName[0]} ${user.lastName[0]}`}
    </Avatar>
  )
}
