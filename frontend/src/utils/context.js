import { createContext, useContext } from 'react'

export const UserContext = createContext({
  user: null,
  setUser: () => {},
})

export const useUser = () => {
  const user = useContext(UserContext)
  if (!user) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return user
}

export const UsersModalContext = createContext({
  isOpen: false,
  setIsOpen: (value) => {},
  users: [],
  setUsers: (users) => {},
})

export const useUsersModal = () => {
  const usersModal = useContext(UsersModalContext)
  if (!usersModal) {
    throw new Error('useUsersModal must be used within a UsersModalProvider')
  }
  return usersModal
}
