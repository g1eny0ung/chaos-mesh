import * as Plot from '@observablehq/plot'
import * as d3 from 'd3'
import { DateTime } from 'luxon'
import { CoreWorkflowMeta, TypesExperiment, TypesSchedule } from 'openapi/index.schemas'

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
