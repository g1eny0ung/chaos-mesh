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
import { applyAPIAuthentication, applyNSParam } from '@/api/interceptors'
import { Stale } from '@/api/queryUtils'
import Helmet from '@/components/Helmet'
import Layout from '@/components/Layout'
import i18n, { T } from '@/components/T'
import { TokenFormValues } from '@/components/Token'
import logoWhite from '@/images/logo-mini-white.svg'
import logo from '@/images/logo-mini.svg'
import LS from '@/lib/localStorage'
import ConfirmDialog from '@/mui-extends/ConfirmDialog'
import Loading from '@/mui-extends/Loading'
import { useGetCommonConfig } from '@/openapi'
import { setAlertOpen, setConfirmOpen, setNameSpace, setTokenName, setTokens } from '@/slices/globalStatus'
import { useStoreDispatch, useStoreSelector } from '@/store'
import loadable from '@loadable/component'
import MenuIcon from '@mui/icons-material/Menu'
import {
  Box,
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
import { Alert, Portal, Snackbar, useMediaQuery } from '@mui/material'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

import { NavList, insightsItems, otherItems, resourcesItems } from './Sidebar'

const Auth = loadable(() => import('./Auth'))

function SideNav() {
  return (
    <List sx={{ '--ListItem-radius': '8px' }}>
      <NavList header="insights" items={insightsItems} />
      <NavList header="resources" items={resourcesItems} />
      <NavList header="common.other" items={otherItems} />
    </List>
  )
}

const TopContainer = () => {
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
      dispatch(setAuthOpen(true))
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

  return (
    <>
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
              <NavLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img src={logo} alt="Chaos Mesh" width={28} />

                <Typography level="h1" component="div" fontSize="md" sx={{ ml: 1.5 }}>
                  Chaos Mesh
                </Typography>
              </NavLink>
            </Box>
          </Layout.Header>

          <Layout.SideNav>
            <SideNav />
          </Layout.SideNav>

          <Layout.Main>{loading ? <Loading /> : <Outlet />}</Layout.Main>
        </Layout.Root>

        {/* <Root open={openDrawer}>
        <Sidebar open={openDrawer} />
        <Box component="main" sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Navbar openDrawer={openDrawer} handleDrawerToggle={handleDrawerToggle} />

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

      <Auth open={authOpen} />

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
    </>
  )
}

export default TopContainer
