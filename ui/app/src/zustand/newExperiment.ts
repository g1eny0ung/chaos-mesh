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
import { Kind } from '@/components/NewExperiment/data/types'
import { create } from 'zustand'

export type Env = 'k8s' | 'physic'

interface NewExperimentState {
  fromExternal: boolean
  step1: boolean
  step2: boolean
  env: Env
  kindAction: [Kind | '', string]
  spec: any
  basic: any
  setStep1: (step1: boolean) => void
  setStep2: (step2: boolean) => void
  setEnv: (env: Env) => void
  setKindAction: (kindAction: [Kind | '', string]) => void
  setSpec: (spec: any) => void
  setBasic: (basic: any) => void
  setExternalExperiment: (externalExperiment: any) => void
  resetNewExperiment: () => void
}

const useStore = create<NewExperimentState>((set) => ({
  fromExternal: false,
  step1: false,
  step2: false,
  env: 'k8s',
  kindAction: ['', ''],
  spec: {},
  basic: {},
  setStep1: (step1: boolean) => set({ step1 }),
  setStep2: (step2: boolean) => set({ step2 }),
  setEnv: (env: Env) => set({ env }),
  setKindAction: (kindAction: [Kind | '', string]) => set({ kindAction }),
  setSpec: (spec: any) => set({ spec }),
  setBasic: (basic: any) => set({ basic }),
  setExternalExperiment: (externalExperiment: any) => {
    const { kindAction, spec, basic } = externalExperiment

    set({ fromExternal: true, kindAction, spec, basic })
  },
  resetNewExperiment: () =>
    set({
      fromExternal: false,
      step1: false,
      step2: false,
      kindAction: ['', ''],
      spec: {},
      basic: {},
    }),
}))

export default useStore
