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
import { T } from '@/components/T'
import logoWhite from '@/images/logo-white.svg'
import logo from '@/images/logo.svg'
import { useGetCommonConfig } from '@/openapi'
import useSettingsStore, { Theme } from '@/zustand/settings'
import { Box, Chip, Option, Typography } from '@mui/joy'
import type { SyntheticEvent } from 'react'

import Checkbox from '@ui/mui-extends/esm/Checkbox'
import PaperTop from '@ui/mui-extends/esm/PaperTop'
import SelectField from '@ui/mui-extends/esm/SelectField'
import Space from '@ui/mui-extends/esm/Space'

import Token from './Token'

const langs = [
  { label: 'English', value: 'en' },
  { label: '简体中文', value: 'zh' },
]

const Settings = () => {
  const [
    theme,
    lang,
    debugMode,
    enableKubeSystemNS,
    useNewPhysicalMachine,
    setTheme,
    setLang,
    setDebugMode,
    setEnableKubeSystemNS,
    setUseNewPhysicalMachine,
  ] = useSettingsStore((state) => [
    state.theme,
    state.lang,
    state.debugMode,
    state.enableKubeSystemNS,
    state.useNewPhysicalMachine,
    state.setTheme,
    state.setLang,
    state.setDebugMode,
    state.setEnableKubeSystemNS,
    state.setUseNewPhysicalMachine,
  ])

  const { data: config } = useGetCommonConfig({
    query: {
      enabled: false,
      staleTime: Stale.DAY,
    },
  })

  const handleChangeDebugMode = () => setDebugMode(!debugMode)
  const handleChangeEnableKubeSystemNS = () => setEnableKubeSystemNS(!enableKubeSystemNS)
  const handleChangeUseNewPhysicalMachine = () => setUseNewPhysicalMachine(!useNewPhysicalMachine)
  const handleChangeTheme = (_: SyntheticEvent | null, theme: Theme | null) => setTheme(theme!)
  const handleChangeLang = (_: SyntheticEvent | null, lang: string | null) => setLang(lang!)

  return (
    <Space>
      <PaperTop title={<T id="settings.title" />} h1 divider />

      {config?.security_mode && <Token />}

      <PaperTop title={<T id="experiments.title" />} h2 />
      <Checkbox
        label={<T id="settings.debugMode.title" />}
        helperText={<T id="settings.debugMode.choose" />}
        checked={debugMode}
        onChange={handleChangeDebugMode}
      />
      <Checkbox
        label={<T id="settings.enableKubeSystemNS.title" />}
        helperText={<T id="settings.enableKubeSystemNS.choose" />}
        checked={enableKubeSystemNS}
        onChange={handleChangeEnableKubeSystemNS}
      />
      <Checkbox
        label={
          <Space spacing={1} direction="row" alignItems="center">
            <Box>
              <T id="settings.useNewPhysicalMachineCRD.title" />
            </Box>
            <Chip size="sm">Preview</Chip>
          </Space>
        }
        helperText={<T id="settings.useNewPhysicalMachineCRD.choose" />}
        checked={useNewPhysicalMachine}
        onChange={handleChangeUseNewPhysicalMachine}
      />

      <PaperTop title={<T id="workflows.title" />} h2 />
      <Chip variant="soft" size="sm">
        No experimental features now
      </Chip>

      <PaperTop title={<T id="settings.general" />} h2 />
      <SelectField
        label={<T id="settings.theme.title" />}
        helperText={<T id="settings.theme.choose" />}
        value={theme}
        onChange={handleChangeTheme}
        sx={{ width: 300 }}
      >
        <Option value="light">
          <T id="settings.theme.light" />
        </Option>
        <Option value="dark">
          <T id="settings.theme.dark" />
        </Option>
      </SelectField>
      <SelectField
        label={<T id="settings.lang.title" />}
        helperText={<T id="settings.lang.choose" />}
        value={lang}
        onChange={handleChangeLang}
        sx={{ width: 300 }}
      >
        {langs.map(({ label, value }) => (
          <Option key={value} value={value}>
            {label}
          </Option>
        ))}
      </SelectField>

      <PaperTop title={<T id="common.about" />} />
      <img src={theme === 'light' ? logo : logoWhite} alt="Chaos Mesh" style={{ width: 192 }} />
      <div>
        <Typography level="body2" mb={1}>
          The official, comprehensive Chaos Mesh user interface.
        </Typography>
        <Chip variant="soft" size="sm">
          <T
            id="common.currentVersion"
            values={{
              version: config?.version,
            }}
          />
        </Chip>
      </div>
    </Space>
  )
}

export default Settings
