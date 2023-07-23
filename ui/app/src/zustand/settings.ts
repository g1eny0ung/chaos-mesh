/*
 * Copyright 2023 Chaos Mesh Authors.
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
import LS from '@/lib/localStorage'
import { create } from 'zustand'

export type Theme = 'light' | 'dark'

interface SettingsState {
  theme: Theme
  lang: string
  debugMode: boolean
  enableKubeSystemNS: boolean
  useNewPhysicalMachine: boolean
  setTheme: (theme: Theme) => void
  setLang: (lang: string) => void
  setDebugMode: (debugMode: boolean) => void
  setEnableKubeSystemNS: (enableKubeSystemNS: boolean) => void
  setUseNewPhysicalMachine: (useNewPhysicalMachine: boolean) => void
}

const userStore = create<SettingsState>((set) => ({
  theme: (LS.get('theme') || 'light') as Theme,
  lang: LS.get('lang') || 'en',
  debugMode: LS.get('debug-mode') === 'true',
  enableKubeSystemNS: LS.get('enable-kube-system-ns') === 'true',
  useNewPhysicalMachine: LS.get('use-new-physical-machine') === 'true',
  setTheme: (theme: Theme) => set({ theme }),
  setLang: (lang: string) => set({ lang }),
  setDebugMode: (debugMode: boolean) => set({ debugMode }),
  setEnableKubeSystemNS: (enableKubeSystemNS: boolean) => set({ enableKubeSystemNS }),
  setUseNewPhysicalMachine: (useNewPhysicalMachine: boolean) => set({ useNewPhysicalMachine }),
}))

export default userStore
