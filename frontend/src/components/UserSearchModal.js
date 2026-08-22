import { Card, Container, Dialog, Grid, Typography } from '@mui/material'
import { useUsersModal } from '../utils/context'
import BfAvatar from './BfAvatar'

export default function UserSearchModal() {
  const usersModalContext = useUsersModal()

  return (
    <Dialog
      open={usersModalContext.isOpen}
      onClose={() => {
        usersModalContext.setIsOpen(false)
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      disableAutoFocus
      hideBackdrop
    >
      <Card sx={{ width: 400, height: 400, p: '16px' }}>
        <Container>
          <Typography variant="h5">Search Results</Typography>
          <Grid container spacing={1} mt="8px">
            {usersModalContext.users && usersModalContext.users.map((user) => (
              <>
                <Grid item sm={2}>
                  <BfAvatar
                    user={user}
                    key={user.id}
                    onClick={() => usersModalContext.setIsOpen(false)}
                  />
                </Grid>
                <Grid item sm={10} alignContent="center">
                  <Typography key={user.id}>{user.firstName + ' ' + user.lastName}</Typography>
                </Grid>
              </>
            ))}
          </Grid>
        </Container>
      </Card>
    </Dialog>
  )
}
