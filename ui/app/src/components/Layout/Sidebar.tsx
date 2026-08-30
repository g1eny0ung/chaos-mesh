/*
 * Copyright 2025 Chaos Mesh Authors.
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
import { useResolvedTheme } from '@/zustand/system'
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded'
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import Box from '@mui/joy/Box'
import Divider from '@mui/joy/Divider'
import IconButton from '@mui/joy/IconButton'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemContent from '@mui/joy/ListItemContent'
import ListSubheader from '@mui/joy/ListSubheader'
import Sheet from '@mui/joy/Sheet'
import Tooltip from '@mui/joy/Tooltip'
import Typography from '@mui/joy/Typography'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { NavLink } from 'react-router'

import logoMini from '@/images/logo-mini.svg'
import logoWhite from '@/images/logo-white.svg'
import logo from '@/images/logo.svg'

// import ColorSchemeToggle from './ColorSchemeToggle'

const sidebarRailMediaQuery = '@media (min-width: 768px)'
const sidebarCollapsedStorageKey = 'chaos-mesh-sidebar-collapsed'

const insights = [
  { icon: <DashboardRoundedIcon />, text: 'dashboard' },

  {
    icon: <TimelineRoundedIcon />,
    text: 'events',
  },
]

const resources = [
  {
    icon: <AccountTreeRoundedIcon />,
    text: 'workflows',
  },
  {
    icon: <ScheduleRoundedIcon />,
    text: 'schedules',
  },
  {
    icon: <ScienceRoundedIcon />,
    text: 'experiments',
  },
  {
    icon: <ArchiveRoundedIcon />,
    text: 'archives',
  },
]

interface NavGroupProps {
  collapsed: boolean
  items: { icon: React.ReactNode; text: string }[]
  onNavigate: () => void
  title: string
}

type Viewport = 'mobile' | 'compact' | 'large'

interface SidebarState {
  collapsed: boolean
  mobileOpen: boolean
  viewport: Viewport
}

function getStoredCollapsedPreference(): boolean | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedValue = window.localStorage.getItem(sidebarCollapsedStorageKey)

    if (storedValue === 'true') {
      return true
    }

    if (storedValue === 'false') {
      return false
    }
  } catch {
    return null
  }

  return null
}

function storeCollapsedPreference(collapsed: boolean) {
  try {
    window.localStorage.setItem(sidebarCollapsedStorageKey, String(collapsed))
  } catch {
    // Keep the sidebar usable when storage is unavailable.
  }
}

function getViewport(): Viewport {
  if (typeof window === 'undefined') {
    return 'compact'
  }

  if (window.matchMedia('(min-width: 1280px)').matches) {
    return 'large'
  }

  if (window.matchMedia('(min-width: 768px)').matches) {
    return 'compact'
  }

  return 'mobile'
}

function getInitialSidebarState(): SidebarState {
  const viewport = getViewport()
  const storedCollapsed = getStoredCollapsedPreference()

  return {
    collapsed: storedCollapsed ?? viewport !== 'large',
    mobileOpen: false,
    viewport,
  }
}

function NavGroup({ collapsed, items, onNavigate, title }: NavGroupProps) {
  const intl = useIntl()

  return (
    <List
      size="sm"
      sx={{
        '--ListItem-radius': (theme) => theme.vars.radius.sm,
        '--List-gap': '2px',
        ...(collapsed ? { '--ListItem-paddingX': '0px' } : {}),
      }}
    >
      {!collapsed && <ListSubheader sx={{ fontWeight: '700' }}>{intl.formatMessage({ id: title })}</ListSubheader>}
      {items.map(({ icon, text }) => {
        const label = intl.formatMessage({ id: `${text}.title` })

        return (
          <ListItem key={text} className={`tutorial-${text}`}>
            <Tooltip title={collapsed ? label : ''} placement="right">
              <NavLink
                to={text}
                aria-label={collapsed ? label : undefined}
                onClick={onNavigate}
                style={{ width: '100%', textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <ListItemButton
                    selected={isActive}
                    sx={{
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      px: collapsed ? 1 : undefined,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        flexShrink: 0,
                        '& svg': { fontSize: 18 },
                      }}
                    >
                      {icon}
                    </Box>
                    {!collapsed && (
                      <ListItemContent>
                        <Typography level="title-sm">{label}</Typography>
                      </ListItemContent>
                    )}
                  </ListItemButton>
                )}
              </NavLink>
            </Tooltip>
          </ListItem>
        )
      })}
    </List>
  )
}

export default function Sidebar() {
  const intl = useIntl()
  const theme = useResolvedTheme()
  const [sidebarState, setSidebarState] = useState(getInitialSidebarState)
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const { collapsed, mobileOpen, viewport } = sidebarState
  const isDesktop = viewport !== 'mobile'
  const isCollapsed = isDesktop && collapsed
  const navigationLabel = intl.formatMessage({ id: 'sidebar.navigation' })
  const openLabel = intl.formatMessage({ id: 'sidebar.open' })
  const closeLabel = intl.formatMessage({ id: 'sidebar.close' })
  const collapseLabel = intl.formatMessage({ id: 'sidebar.collapse' })
  const expandLabel = intl.formatMessage({ id: 'sidebar.expand' })
  const dashboardLabel = intl.formatMessage({ id: 'dashboard.title' })
  const settingsLabel = intl.formatMessage({ id: 'settings.title' })
  const docsLabel = intl.formatMessage({ id: 'common.doc' })
  const logoutLabel = intl.formatMessage({ id: 'common.logout' })

  const closeMobileSidebar = useCallback((restoreFocus = false) => {
    setSidebarState((current) => ({ ...current, mobileOpen: false }))

    if (restoreFocus) {
      window.requestAnimationFrame(() => openButtonRef.current?.focus())
    }
  }, [])

  const setManuallyCollapsed = useCallback((nextCollapsed: boolean) => {
    storeCollapsedPreference(nextCollapsed)
    setSidebarState((current) => ({ ...current, collapsed: nextCollapsed }))
  }, [])

  useEffect(() => {
    const compactQuery = window.matchMedia('(min-width: 768px)')
    const largeQuery = window.matchMedia('(min-width: 1280px)')
    const handleBreakpointChange = () => {
      const nextViewport = getViewport()

      setSidebarState((current) =>
        current.viewport === nextViewport
          ? current
          : {
              collapsed: getStoredCollapsedPreference() ?? nextViewport !== 'large',
              mobileOpen: false,
              viewport: nextViewport,
            },
      )
    }

    compactQuery.addEventListener('change', handleBreakpointChange)
    largeQuery.addEventListener('change', handleBreakpointChange)

    return () => {
      compactQuery.removeEventListener('change', handleBreakpointChange)
      largeQuery.removeEventListener('change', handleBreakpointChange)
    }
  }, [])

  useEffect(() => {
    if (isDesktop || !mobileOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileSidebar(true)
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeMobileSidebar, isDesktop, mobileOpen])

  return (
    <>
      <IconButton
        ref={openButtonRef}
        aria-label={openLabel}
        variant="outlined"
        color="neutral"
        onClick={() => setSidebarState((current) => ({ ...current, mobileOpen: true }))}
        sx={{
          zIndex: 998,
          position: 'fixed',
          top: 16,
          left: 16,
          display: mobileOpen ? 'none' : 'inline-flex',
          bgcolor: 'background.surface',
          boxShadow: 'sm',
          [sidebarRailMediaQuery]: { display: 'none' },
        }}
      >
        <MenuRoundedIcon />
      </IconButton>
      <Box
        aria-hidden="true"
        sx={{
          zIndex: 999,
          position: 'fixed',
          inset: 0,
          display: 'block',
          backgroundColor: 'background.backdrop',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
          [sidebarRailMediaQuery]: { display: 'none' },
        }}
        onClick={() => closeMobileSidebar(true)}
      />
      <Sheet
        component="nav"
        aria-label={navigationLabel}
        sx={{
          zIndex: 1000,
          position: 'fixed',
          top: 0,
          left: 0,
          width: isCollapsed
            ? '72px'
            : isDesktop
              ? viewport === 'large'
                ? '240px'
                : '220px'
              : 'min(280px, calc(100vw - 48px))',
          height: '100dvh',
          p: isCollapsed ? 1 : 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 2,
          overflowX: 'hidden',
          overflowY: 'auto',
          borderRight: '1px solid',
          borderColor: 'divider',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          visibility: mobileOpen ? 'visible' : 'hidden',
          transition: 'transform 0.3s ease, width 0.25s ease, padding 0.25s ease',
          [sidebarRailMediaQuery]: {
            position: 'sticky',
            transform: 'none',
            visibility: 'visible',
          },
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 0.5,
              pt: isCollapsed ? 1 : 0,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: 1,
                minHeight: 32,
              }}
            >
              <Tooltip title={isCollapsed ? 'Chaos Mesh' : ''} placement="right">
                <NavLink
                  to="dashboard"
                  aria-label={dashboardLabel}
                  onClick={() => closeMobileSidebar()}
                  style={{ display: 'inline-flex', flexShrink: 0 }}
                >
                  <Box
                    component="img"
                    src={isCollapsed ? logoMini : theme === 'light' ? logo : logoWhite}
                    alt="Chaos Mesh"
                    sx={{
                      width: isCollapsed ? 24 : 140,
                      height: isCollapsed ? 24 : 'auto',
                    }}
                  />
                </NavLink>
              </Tooltip>
              {!isCollapsed && (
                <Tooltip title={collapseLabel} placement="right">
                  <IconButton
                    aria-label={collapseLabel}
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => setManuallyCollapsed(true)}
                    sx={{
                      ml: 'auto',
                      display: 'none',
                      flexShrink: 0,
                      '& svg': { fontSize: 18 },
                      [sidebarRailMediaQuery]: { display: 'inline-flex' },
                    }}
                  >
                    <MenuOpenRoundedIcon />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton
                ref={closeButtonRef}
                aria-label={closeLabel}
                size="sm"
                variant="plain"
                color="neutral"
                onClick={() => closeMobileSidebar(true)}
                sx={{
                  ml: 'auto',
                  display: 'inline-flex',
                  flexShrink: 0,
                  '& svg': { fontSize: 18 },
                  [sidebarRailMediaQuery]: { display: 'none' },
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>
            {isCollapsed && (
              <Tooltip title={expandLabel} placement="right">
                <IconButton
                  aria-label={expandLabel}
                  size="sm"
                  variant="plain"
                  color="neutral"
                  onClick={() => setManuallyCollapsed(false)}
                  sx={{
                    alignSelf: 'center',
                    display: 'none',
                    flexShrink: 0,
                    '& svg': { fontSize: 18 },
                    [sidebarRailMediaQuery]: { display: 'inline-flex' },
                  }}
                >
                  <MenuRoundedIcon />
                </IconButton>
              </Tooltip>
            )}
            {/* <ColorSchemeToggle sx={{ ml: 'auto' }} /> */}
          </Box>

          <NavGroup
            collapsed={isCollapsed}
            title="sidebar.insights"
            items={insights}
            onNavigate={() => closeMobileSidebar()}
          />
          <NavGroup
            collapsed={isCollapsed}
            title="sidebar.resources"
            items={resources}
            onNavigate={() => closeMobileSidebar()}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isCollapsed ? 1 : 2 }}>
          <List
            size="sm"
            sx={{
              '--ListItem-radius': (theme) => theme.vars.radius.sm,
              ...(isCollapsed ? { '--ListItem-paddingX': '0px' } : {}),
            }}
          >
            <ListItem>
              <Tooltip title={isCollapsed ? settingsLabel : ''} placement="right">
                <NavLink
                  to="settings"
                  aria-label={isCollapsed ? settingsLabel : undefined}
                  onClick={() => closeMobileSidebar()}
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  {({ isActive }) => (
                    <ListItemButton
                      selected={isActive}
                      sx={{
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        px: isCollapsed ? 1 : undefined,
                        '& svg': { fontSize: 18 },
                      }}
                    >
                      <SettingsRoundedIcon />
                      {!isCollapsed && (
                        <ListItemContent>
                          <Typography level="title-sm">{settingsLabel}</Typography>
                        </ListItemContent>
                      )}
                    </ListItemButton>
                  )}
                </NavLink>
              </Tooltip>
            </ListItem>
            <ListItem>
              <Tooltip title={isCollapsed ? docsLabel : ''} placement="right">
                <a
                  href="https://chaos-mesh.org/docs"
                  aria-label={isCollapsed ? docsLabel : undefined}
                  target="_blank"
                  rel="noreferrer"
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <ListItemButton
                    sx={{
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      px: isCollapsed ? 1 : undefined,
                      '& svg': { fontSize: 18 },
                    }}
                  >
                    <MenuBookRoundedIcon />
                    {!isCollapsed && (
                      <ListItemContent>
                        <Typography level="title-sm">{docsLabel}</Typography>
                      </ListItemContent>
                    )}
                  </ListItemButton>
                </a>
              </Tooltip>
            </ListItem>
          </List>
          <Divider />
          <Box
            sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'initial' }}
          >
            {!isCollapsed && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography level="title-sm">Glen</Typography>
                <Typography level="body-xs" noWrap>
                  g1en@chaos-mesh.org
                </Typography>
              </Box>
            )}
            <Tooltip title={isCollapsed ? logoutLabel : ''} placement="right">
              <IconButton aria-label={logoutLabel} size="sm" color="neutral" sx={{ '& svg': { fontSize: 18 } }}>
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Sheet>
    </>
  )
}
