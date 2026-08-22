import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { createTheme, ThemeProvider } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  Link as RouterLink,
  RouterProvider,
} from 'react-router-dom'
import App from './App'
import './index.css'
import MainApp from './MainApp'
import Auth from './pages/Auth'
import Login from './pages/auth/login/login'
import Register from './pages/auth/register/Register'
import Feed from './pages/feed/Feed'
import Profile from './pages/profile/Profile'
import reportWebVitals from './reportWebVitals'

const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props
  // Map href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />
})

const theme = createTheme({
  palette: {},
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
})

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <MainApp />,
        children: [
          {
            path: '/profile/:userId',
            element: <Profile />,
          },
          {
            path: '/feed',
            element: <Feed />,
          },
          {
            path: '/',
            element: <Feed />,
          },
        ],
      },
      {
        element: <Auth />,
        children: [
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/register',
            element: <Register />,
          },
        ],
      },
    ],
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
