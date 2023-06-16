/*
 * Copyright 2021 Chaos Mesh Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import loadable from '@loadable/component'
import MenuIcon from '@mui/icons-material/Menu'
import {
  CssBaseline,
  CssVarsProvider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  ListSubheader,
  Typography,
} from '@mui/joy'
import { Alert, Box, BoxProps, Container, Divider, Portal, Snackbar, useMediaQuery, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { applyAPIAuthentication, applyNSParam } from 'api/interceptors'
import { Stale } from 'api/queryUtils'
import Cookies from 'js-cookie'
import { useGetCommonConfig } from 'openapi'
import { useEffect, useState } from 'react'
import { NavLink, BrowserRouter as Router } from 'react-router-dom'
import { Navigate, Route, Routes } from 'react-router-dom'
import routes from 'routes'

import ConfirmDialog from '@ui/mui-extends/esm/ConfirmDialog'
import Loading from '@ui/mui-extends/esm/Loading'

import { useStoreDispatch, useStoreSelector } from 'store'

import { setAlertOpen, setConfirmOpen, setNameSpace, setTokenName, setTokens } from 'slices/globalStatus'

import Helmet from 'components/Helmet'
import Layout from 'components/Layout'
import { TokenFormValues } from 'components/Token'

import insertCommonStyle from 'lib/d3/insertCommonStyle'
import LS from 'lib/localStorage'

import logoMiniWhite from 'images/logo-mini-white.svg'
import logoMini from 'images/logo-mini.svg'
import logoWhite from 'images/logo-white.svg'
import logo from 'images/logo.svg'

import Navbar from './Navbar'
import { closedWidth, listItems, openedWidth } from './Sidebar'
import Sidebar from './Sidebar'

const Auth = loadable(() => import('./Auth'))

const Root = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<BoxProps & { open: boolean }>(({ theme, open }) => ({
  position: 'relative',
  width: `calc(100% - ${open ? openedWidth : closedWidth}px)`,
  height: '100vh',
  marginLeft: open ? openedWidth : closedWidth,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration[open ? 'enteringScreen' : 'leavingScreen'],
  }),
  [theme.breakpoints.down('sm')]: {
    minWidth: theme.breakpoints.values.md,
  },
}))

function SideNav() {
  return (
    <List size="sm" sx={{ '--ListItem-radius': '8px', '--List-gap': '4px' }}>
      <ListItem nested>
        <ListSubheader>Browse</ListSubheader>
        <List
          aria-labelledby="nav-list-browse"
          sx={{
            '& .JoyListItemButton-root': { p: '8px' },
          }}
        >
          {listItems.map(({ icon, text }) => (
            <ListItem>
              <ListItemButton variant="plain">
                <ListItemDecorator sx={{ color: 'inherit' }}>{icon}</ListItemDecorator>
                <ListItemContent>{text}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ListItem>
    </List>
  )
}

const TopContainer = () => {
  const theme = useTheme()

  const { alert, alertOpen, confirm, confirmOpen } = useStoreSelector((state) => state.globalStatus)

  const dispatch = useStoreDispatch()
  const handleSnackClose = () => dispatch(setAlertOpen(false))
  const handleConfirmClose = () => dispatch(setConfirmOpen(false))

  // Sidebar related
  const miniSidebar = LS.get('mini-sidebar') === 'y'
  const [openDrawer, setOpenDrawer] = useState(miniSidebar)
  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer)
    LS.set('mini-sidebar', openDrawer ? 'y' : 'n')
  }

  const [loading, setLoading] = useState(true)
  const [authOpen, setAuthOpen] = useState(false)

  /**
   * Set authorization (RBAC token / GCP) for API use.
   *
   */
  function setAuth() {
    // GCP
    const accessToken = Cookies.get('access_token')
    const expiry = Cookies.get('expiry')

    if (accessToken && expiry) {
      const token = {
        accessToken,
        expiry,
      }

      applyAPIAuthentication(token as any)
      dispatch(setTokenName('gcp'))

      return
    }

    const token = LS.get('token')
    const tokenName = LS.get('token-name')
    const globalNamespace = LS.get('global-namespace')

    if (token && tokenName) {
      const tokens: TokenFormValues[] = JSON.parse(token)

      applyAPIAuthentication(tokens.find(({ name }) => name === tokenName)!.token)
      dispatch(setTokens(tokens))
      dispatch(setTokenName(tokenName))
    } else {
      setAuthOpen(true)
    }

    if (globalNamespace) {
      applyNSParam(globalNamespace)
      dispatch(setNameSpace(globalNamespace))
    }
  }

  useGetCommonConfig({
    query: {
      staleTime: Stale.DAY,
      onSuccess(data) {
        if (data.security_mode) {
          setAuth()
        }

        setLoading(false)
      },
    },
  })

  useEffect(() => {
    insertCommonStyle()
  }, [])

  const isTabletScreen = useMediaQuery(theme.breakpoints.down('md'))
  useEffect(() => {
    if (isTabletScreen) {
      setOpenDrawer(false)
    }
  }, [isTabletScreen])

  return (
    <Router>
      <CssVarsProvider>
        <CssBaseline />

        {openDrawer && (
          <Layout.SideDrawer onClose={() => setOpenDrawer(false)}>
            <SideNav />
          </Layout.SideDrawer>
        )}

        <Layout.Root>
          <Layout.Header>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <IconButton
                variant="outlined"
                size="sm"
                onClick={() => setOpenDrawer(true)}
                sx={{ display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <NavLink to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={logoMini} alt="Chaos Mesh" width={28} />
              </NavLink>
              <Typography component="h1" fontWeight="xl">
                Chaos Mesh
              </Typography>
            </Box>
          </Layout.Header>

          <Layout.SideNav>
            <SideNav />
          </Layout.SideNav>
        </Layout.Root>

        {/* <Root open={openDrawer}>
        <Sidebar open={openDrawer} />
        <Box component="main" sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Navbar openDrawer={openDrawer} handleDrawerToggle={handleDrawerToggle} />
          <Divider />

          <Container maxWidth="xl" disableGutters sx={{ flexGrow: 1, p: 6 }}>
            {loading ? (
              <Loading />
            ) : (
                <Routes>
                  <Route path="/" element={<Navigate replace to="/dashboard" />} />
                  {!authOpen &&
                    routes.map(({ path, element, title }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <>
                            <Helmet title={title} />
                            {element}
                          </>
                        }
                      />
                    ))}
                </Routes>
            )}
          </Container>
        </Box>
      </Root>

      <Auth open={authOpen} setOpen={setAuthOpen} />

      <Portal>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          autoHideDuration={6000}
          open={alertOpen}
          onClose={handleSnackClose}
        >
          <Alert severity={alert.type} onClose={handleSnackClose}>
            {alert.message}
          </Alert>
        </Snackbar>
      </Portal>

      <Portal>
        <ConfirmDialog
          open={confirmOpen}
          close={handleConfirmClose}
          title={confirm.title}
          description={confirm.description}
          onConfirm={confirm.handle}
        />
      </Portal> */}
      </CssVarsProvider>
    </Router>
  )
}

export default TopContainer
