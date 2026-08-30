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
import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

import LS from '@/lib/localStorage'

export type SystemTheme = 'auto' | 'light' | 'dark'
export type ResolvedSystemTheme = Exclude<SystemTheme, 'auto'>

const colorSchemeQuery = '(prefers-color-scheme: dark)'

const getInitialTheme = (): SystemTheme => {
  const storedTheme = LS.get('theme')

  return storedTheme === 'auto' || storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'auto'
}

const getBrowserTheme = (): ResolvedSystemTheme =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(colorSchemeQuery).matches
    ? 'dark'
    : 'light'

const subscribeToBrowserTheme = (onStoreChange: () => void) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => undefined
  }

  const mediaQuery = window.matchMedia(colorSchemeQuery)
  mediaQuery.addEventListener('change', onStoreChange)

  return () => mediaQuery.removeEventListener('change', onStoreChange)
}

export const useSystemStore = create(
  combine({ theme: getInitialTheme(), lang: LS.get('lang') || 'en' }, (set) => ({
    actions: {
      setTheme: (theme: SystemTheme) => {
        set({ theme })
        LS.set('theme', theme)
      },
      setLang: (lang: string) => {
        set({ lang })
        LS.set('lang', lang)
      },
    },
  })),
)

export const useSystemActions = () => useSystemStore((state) => state.actions)

export const useResolvedTheme = (): ResolvedSystemTheme => {
  const theme = useSystemStore((state) => state.theme)
  const browserTheme = useSyncExternalStore(
    subscribeToBrowserTheme,
    getBrowserTheme,
    (): ResolvedSystemTheme => 'light',
  )

  return theme === 'auto' ? browserTheme : theme
}
