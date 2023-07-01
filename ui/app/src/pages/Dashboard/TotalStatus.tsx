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
import NotFound from '@/components/NotFound'
import i18n from '@/components/T'
import { useGetExperimentsState } from '@/openapi'
import type { StatusAllChaosStatus } from '@/openapi/index.schemas'
import Box, { BoxProps } from '@mui/joy/Box'
import type { PropertyAccessor } from '@nivo/core'
import { ComputedDatum, ResponsivePie } from '@nivo/pie'
import { useState } from 'react'
import { useIntl } from 'react-intl'

interface SingleData {
  id: keyof StatusAllChaosStatus
  label: string
  value: number
}

const statusColors = {
  injecting: 'var(--joy-palette-info-softActiveBg)',
  running: 'var(--joy-palette-success-softActiveBg)',
  paused: 'var(--joy-palette-warning-softActiveBg)',
  finished: 'var(--joy-palette-primary-softActiveBg)',
  deleting: 'var(--joy-palette-neutral-softActiveBg)',
}

const TotalStatus: React.FC<BoxProps> = (props) => {
  const intl = useIntl()

  const [state, setState] = useState<SingleData[]>([])

  useGetExperimentsState(undefined, {
    query: {
      onSuccess(data) {
        setState(
          (Object.entries(data) as [keyof StatusAllChaosStatus, number][])
            .filter(([_, v]) => v !== 0)
            .map(([k, v]) => ({
              id: k,
              label: i18n(`status.${k}`, intl),
              value: v,
            }))
        )
      },
    },
  })

  const arcLinkLabel: PropertyAccessor<ComputedDatum<SingleData>, string> = (d) => d.data.label

  return (
    <Box {...props}>
      {state.some((d) => d.value >= 1) ? (
        <ResponsivePie
          data={state}
          margin={{ top: 25, bottom: 25 }}
          innerRadius={0.75}
          padAngle={4}
          cornerRadius={4}
          arcLabelsTextColor={(d) => statusColors[d.data.id].replace('ActiveBg', 'Color')}
          arcLinkLabel={arcLinkLabel}
          arcLinkLabelsColor={{
            from: 'color',
          }}
          activeInnerRadiusOffset={4}
          activeOuterRadiusOffset={4}
          tooltip={() => null}
          colors={(d) => statusColors[d.data.id]}
        />
      ) : (
        <NotFound>{i18n('experiments.notFound')}</NotFound>
      )}
    </Box>
  )
}

export default TotalStatus
