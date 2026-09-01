/*
 * Copyright 2026 Chaos Mesh Authors.
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
 */
import { Box, Typography } from '@mui/joy'
import type { BoxProps } from '@mui/joy'

interface PanelHeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  h1?: boolean
  boxProps?: BoxProps
}

const toSxArray = (sx: BoxProps['sx']) => (Array.isArray(sx) ? sx : sx ? [sx] : [])

const PanelHeader: ReactFCWithChildren<PanelHeaderProps> = ({ title, subtitle, h1, boxProps, children }) => (
  <Box
    {...boxProps}
    sx={[
      {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      ...toSxArray(boxProps?.sx),
    ]}
  >
    <Box sx={{ flex: 1 }}>
      <Typography
        level={h1 ? 'h3' : 'title-md'}
        component={h1 ? 'h1' : 'div'}
        sx={{ fontWeight: h1 ? 'bold' : undefined }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography level="body-sm" color="neutral">
          {subtitle}
        </Typography>
      )}
    </Box>
    {children}
  </Box>
)

export default PanelHeader
