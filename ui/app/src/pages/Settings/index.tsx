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
import { Stale } from '@/api/queryUtils'
import messages from '@/i18n/messages'
import { useGetCommonConfig } from '@/openapi'
import { getTutorialCardVisibility, setTutorialCardVisibility } from '@/utils/tutorial'
import { useAuthStore } from '@/zustand/auth'
import { useComponentActions } from '@/zustand/component'
import { useSettingActions, useSettingStore } from '@/zustand/setting'
import { type SystemTheme, useResolvedTheme, useSystemActions, useSystemStore } from '@/zustand/system'
import Box from '@mui/joy/Box'
import Checkbox from '@mui/joy/Checkbox'
import Chip from '@mui/joy/Chip'
import Divider from '@mui/joy/Divider'
import FormControl from '@mui/joy/FormControl'
import FormHelperText from '@mui/joy/FormHelperText'
import FormLabel from '@mui/joy/FormLabel'
import Option from '@mui/joy/Option'
import Select from '@mui/joy/Select'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import { useState } from 'react'

import { T } from '@/components/T'

import logoWhite from '@/images/logo-white.svg'
import logo from '@/images/logo.svg'

import Token from './Token'

interface SettingCheckboxProps {
  checked: boolean
  helperText: React.ReactNode
  label: React.ReactNode
  onChange: () => void
}

function SettingCheckbox({ checked, helperText, label, onChange }: SettingCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      label={
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ fontSize: 'sm', fontWeight: 'md', lineHeight: 'md' }}>{label}</Box>
          <Typography level="body-xs" textColor="text.tertiary" sx={{ mt: 0.25 }}>
            {helperText}
          </Typography>
        </Box>
      }
      onChange={onChange}
      size="sm"
      sx={{ alignItems: 'flex-start', '& .MuiCheckbox-checkbox': { mt: '2px' } }}
    />
  )
}

const Settings = () => {
  const theme = useSystemStore((state) => state.theme)
  const resolvedTheme = useResolvedTheme()
  const lang = useSystemStore((state) => state.lang)
  const { setTheme, setLang } = useSystemActions()
  const { setAlert } = useComponentActions()
  const debugMode = useSettingStore((state) => state.debugMode)
  const enableKubeSystemNS = useSettingStore((state) => state.enableKubeSystemNS)
  const useNewPhysicalMachine = useSettingStore((state) => state.useNewPhysicalMachine)
  const eventTimeFormat = useSettingStore((state) => state.eventTimeFormat)
  const { setDebugMode, setEnableKubeSystemNS, setUseNewPhysicalMachine, setEventTimeFormat } = useSettingActions()
  const tokenName = useAuthStore((state) => state.tokenName)
  const [showTutorialCard, setShowTutorialCard] = useState(getTutorialCardVisibility)

  const { data: config } = useGetCommonConfig({
    query: {
      enabled: false,
      staleTime: Stale.DAY,
    },
  })

  const showUpdateSuccess = () =>
    setAlert({
      type: 'success',
      message: <T id="settings.updateSuccess" />,
    })
  const handleChangeDebugMode = () => {
    setDebugMode(!debugMode)
    showUpdateSuccess()
  }
  const handleChangeEnableKubeSystemNS = () => {
    setEnableKubeSystemNS(!enableKubeSystemNS)
    showUpdateSuccess()
  }
  const handleChangeUseNewPhysicalMachine = () => {
    setUseNewPhysicalMachine(!useNewPhysicalMachine)
    showUpdateSuccess()
  }
  const handleChangeEventTimeFormat = () => {
    setEventTimeFormat(eventTimeFormat === 'absolute' ? 'relative' : 'absolute')
    showUpdateSuccess()
  }
  const handleChangeShowTutorialCard = () => {
    const nextVisibility = !showTutorialCard

    setTutorialCardVisibility(nextVisibility)
    setShowTutorialCard(nextVisibility)
    showUpdateSuccess()
  }
  const handleChangeTheme = (_event: React.SyntheticEvent | null, value: SystemTheme | null) => {
    if (value) {
      setTheme(value)
      showUpdateSuccess()
    }
  }
  const handleChangeLang = (_event: React.SyntheticEvent | null, value: string | null) => {
    if (value) {
      setLang(value)
      showUpdateSuccess()
    }
  }

  return (
    <Box sx={{ height: '100%' }}>
      <Stack spacing={3}>
        <Typography component="h1" level="h3">
          <T id="settings.title" />
        </Typography>
        <Divider />

        <Typography component="h2" level="title-lg">
          <T id="dashboard.title" />
        </Typography>
        <SettingCheckbox
          label={<T id="settings.tutorialCard.title" />}
          helperText={<T id="settings.tutorialCard.choose" />}
          checked={showTutorialCard}
          onChange={handleChangeShowTutorialCard}
        />

        {config?.security_mode && tokenName && <Token />}

        <Typography component="h2" level="title-lg">
          <T id="experiments.title" />
        </Typography>
        <Stack spacing={2}>
          <SettingCheckbox
            label={<T id="settings.debugMode.title" />}
            helperText={<T id="settings.debugMode.choose" />}
            checked={debugMode}
            onChange={handleChangeDebugMode}
          />
          <SettingCheckbox
            label={<T id="settings.enableKubeSystemNS.title" />}
            helperText={<T id="settings.enableKubeSystemNS.choose" />}
            checked={enableKubeSystemNS}
            onChange={handleChangeEnableKubeSystemNS}
          />
          <SettingCheckbox
            label={
              <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
                <Box>
                  <T id="settings.useNewPhysicalMachineCRD.title" />
                </Box>
                <Chip color="primary" size="sm" variant="soft">
                  Preview
                </Chip>
              </Stack>
            }
            helperText={<T id="settings.useNewPhysicalMachineCRD.choose" />}
            checked={useNewPhysicalMachine}
            onChange={handleChangeUseNewPhysicalMachine}
          />
        </Stack>

        <Typography component="h2" level="title-lg">
          <T id="events.title" />
        </Typography>
        <SettingCheckbox
          label={<T id="settings.eventTimeFormat.title" />}
          helperText={<T id="settings.eventTimeFormat.choose" />}
          checked={eventTimeFormat === 'absolute'}
          onChange={handleChangeEventTimeFormat}
        />

        <Typography component="h2" level="title-lg">
          <T id="settings.general.title" />
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
          <FormControl sx={{ width: 'min(300px, 100%)' }}>
            <FormLabel>
              <T id="settings.theme.title" />
            </FormLabel>
            <Select<SystemTheme>
              value={theme}
              onChange={handleChangeTheme}
              renderValue={(selected) => (
                <Typography level="body-sm">
                  <T id={`settings.theme.${selected?.value ?? theme}`} />
                </Typography>
              )}
            >
              <Option value="auto">
                <Typography level="body-sm">
                  <T id="settings.theme.auto" />
                </Typography>
              </Option>
              <Option value="light">
                <Typography level="body-sm">
                  <T id="settings.theme.light" />
                </Typography>
              </Option>
              <Option value="dark">
                <Typography level="body-sm">
                  <T id="settings.theme.dark" />
                </Typography>
              </Option>
            </Select>
            <FormHelperText>
              <T id="settings.theme.choose" />
            </FormHelperText>
          </FormControl>

          <FormControl sx={{ width: 'min(300px, 100%)' }}>
            <FormLabel>
              <T id="settings.lang.title" />
            </FormLabel>
            <Select
              value={lang}
              onChange={handleChangeLang}
              renderValue={(selected) => (
                <Typography level="body-sm">
                  <T id={`settings.lang.${selected?.value ?? lang}`} />
                </Typography>
              )}
            >
              {Object.keys(messages).map((language) => (
                <Option key={language} value={language}>
                  <Typography level="body-sm">
                    <T id={`settings.lang.${language}`} />
                  </Typography>
                </Option>
              ))}
            </Select>
            <FormHelperText>
              <T id="settings.lang.choose" />
            </FormHelperText>
          </FormControl>
        </Stack>

        <Typography component="h2" level="title-lg">
          <T id="common.version" />
        </Typography>
        <Box>
          <Box
            component="img"
            src={resolvedTheme === 'light' ? logo : logoWhite}
            alt="Chaos Mesh"
            sx={{ width: 192 }}
          />
          <Typography level="body-sm" textColor="text.tertiary">
            Git Version: {config?.version}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export default Settings
