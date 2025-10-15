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
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded'
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import Box from '@mui/joy/Box'
import Divider from '@mui/joy/Divider'
import GlobalStyles from '@mui/joy/GlobalStyles'
import IconButton from '@mui/joy/IconButton'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemContent from '@mui/joy/ListItemContent'
import ListSubheader from '@mui/joy/ListSubheader'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import { NavLink } from 'react-router'

import i18n from '@/components/T'

// import logoWhite from '@/images/logo-mini-white.svg'
import logo from '@/images/logo-mini.svg'

// import ColorSchemeToggle from './ColorSchemeToggle'

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

function NavGroup({ title, items }: { title: string; items: { icon: React.ReactNode; text: string }[] }) {
  return (
    <List
      size="sm"
      sx={{
        '--ListItem-radius': (theme) => theme.vars.radius.sm,
        '--List-gap': '2px',
      }}
    >
      <ListItem nested>
        <ListSubheader sx={{ fontWeight: '700' }}>{title}</ListSubheader>
        <List>
          {items.map(({ icon, text }) => (
            <ListItem key={text} className={`tutorial-${text}`}>
              <NavLink to={text} style={{ width: '100%', textDecoration: 'none' }}>
                {({ isActive }) => (
                  <ListItemButton selected={isActive}>
                    {icon}
                    <ListItemContent>
                      <Typography level="title-sm">{i18n(`${text}.title`)}</Typography>
                    </ListItemContent>
                  </ListItemButton>
                )}
              </NavLink>
            </ListItem>
          ))}
        </List>
      </ListItem>
    </List>
  )
}

function closeSidebar() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn')
    document.body.style.removeProperty('overflow')
  }
}

export default function Sidebar() {
  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        sx={{
          zIndex: 999,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          opacity: 'var(--SideNavigation-slideIn)',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
          transition: 'opacity 0.4s',
        }}
        onClick={() => closeSidebar()}
      />
      <Sheet
        sx={{
          zIndex: 1000,
          position: { xs: 'fixed', md: 'sticky' },
          top: 0,
          width: 'var(--Sidebar-width)',
          height: '100dvh',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 2,
          borderRight: '1px solid',
          borderColor: 'divider',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
            md: 'none',
          },
          transition: 'transform 0.4s, width 0.4s',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <img src={logo} alt="Chaos Mesh" style={{ width: 24, height: 24 }} />
            <Typography level="title-lg">Chaos Mesh</Typography>
            {/* <ColorSchemeToggle sx={{ ml: 'auto' }} /> */}
          </Box>

          <NavGroup title={i18n('sidebar.insights')} items={insights} />
          <NavGroup title={i18n('sidebar.resources')} items={resources} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <List
            size="sm"
            sx={{
              '--ListItem-radius': (theme) => theme.vars.radius.sm,
            }}
          >
            <ListItem>
              <NavLink to="settings" style={{ width: '100%', textDecoration: 'none' }}>
                {({ isActive }) => (
                  <ListItemButton selected={isActive}>
                    <SettingsRoundedIcon />
                    {i18n('settings.title')}
                  </ListItemButton>
                )}
              </NavLink>
            </ListItem>
            <ListItem>
              <a
                href="https://chaos-mesh.org/docs"
                target="_blank"
                rel="noreferrer"
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <ListItemButton>
                  <MenuBookRoundedIcon />
                  {i18n('common.doc')}
                </ListItemButton>
              </a>
            </ListItem>
          </List>
          <Divider />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">Glen</Typography>
              <Typography level="body-xs">g1en@chaos-mesh.org</Typography>
            </Box>
            <IconButton size="sm" color="neutral">
              <LogoutRoundedIcon />
            </IconButton>
          </Box>
        </Box>
      </Sheet>
    </>
  )
}
