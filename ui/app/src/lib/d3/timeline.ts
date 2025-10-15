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
import { CoreWorkflowMeta, TypesExperiment, TypesSchedule } from '@/openapi/index.schemas'
import * as Plot from '@observablehq/plot'
import * as d3 from 'd3'
import { DateTime } from 'luxon'

interface Item {
  name: string
  created_at: string
}

export function genTimelineData(items: TypesExperiment[]): Item[]
export function genTimelineData(items: TypesSchedule[]): Item[]
export function genTimelineData(items: CoreWorkflowMeta[]): Item[] {
  return items.map((item) => ({
    name: item.name!,
    created_at: item.created_at!,
  }))
}

function plot(data: Item[], options?: Plot.PlotOptions) {
  const now = DateTime.now()

  return Plot.plot({
    height: 275,
    marginTop: 25,
    marks: [
      // Plot.rect(data, {
      //   x1: 'created_at',
      //   y: 'name',
      //   fill: 'black',
      // }),
      Plot.axisX(d3.timeMinutes(now.minus({ hour: 1 }).toJSDate(), now.toJSDate(), 10), {
        tickFormat: (d) => DateTime.fromJSDate(d).toLocaleString(DateTime.TIME_SIMPLE),
      }),
    ],
    x: { grid: true, label: 'Time' },
    ...options,
  })
}

export default plot
