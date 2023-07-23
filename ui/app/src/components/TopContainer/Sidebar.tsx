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
import i18n, { T } from '@/components/T'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import ViewTimelineOutlinedIcon from '@mui/icons-material/ViewTimelineOutlined'
import { ListItem, ListItemButton, ListItemContent, ListItemDecorator, ListSubheader } from '@mui/joy'
import { NavLink } from 'react-router-dom'

export const insightsItems = [
  { icon: <DashboardCustomizeOutlinedIcon />, text: 'dashboard' },
  {
    icon: <ViewTimelineOutlinedIcon />,
    text: 'events',
  },
]

export const resourcesItems = [
  {
    icon: <AccountTreeOutlinedIcon />,
    text: 'workflows',
  },
  {
    icon: <ScheduleIcon />,
    text: 'schedules',
  },
  {
    icon: <ScienceOutlinedIcon />,
    text: 'experiments',
  },

  {
    icon: <ArchiveOutlinedIcon />,
    text: 'archives',
  },
]

export const otherItems = [
  {
    icon: <SettingsOutlinedIcon />,
    text: 'settings',
  },
]

export function NavList({ header, items }: { header: string; items: typeof insightsItems }) {
  return (
    <ListItem nested>
      <ListSubheader>
        <T id={header} />
      </ListSubheader>
      {items.map(({ icon, text }) => (
        <ListItem key={text} className={`tutorial-${text}`}>
          <NavLink to={'/' + text} style={{ width: '100%', textDecoration: 'none' }}>
            {({ isActive }) => (
              <ListItemButton variant={isActive ? 'soft' : 'plain'} color={isActive ? 'primary' : 'neutral'}>
                <ListItemDecorator sx={{ color: 'inherit' }}>{icon}</ListItemDecorator>
                <ListItemContent>{i18n(`${text}.title`)}</ListItemContent>
              </ListItemButton>
            )}
          </NavLink>
        </ListItem>
      ))}
    </ListItem>
  )
}
