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
import EventsTimeline from '@/components/EventsTimeline'
import StatusLabel from '@/components/StatusLabel'
import i18n from '@/components/T'
import timelinePlot, { genTimelineData } from '@/lib/d3/timeline'
import { useGetEvents, useGetExperiments, useGetSchedules, useGetWorkflows } from '@/openapi'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import { Box, Card, CardContent, Grid, IconButton, Typography } from '@mui/joy'
import { TourProvider } from '@reactour/tour'
import _ from 'lodash'
import { type ReactChild, useEffect, useRef } from 'react'

import TotalStatus from './TotalStatus'
import Welcome from './Welcome'
import { steps } from './tourSteps'

const NumCard: React.FC<{ icon: ReactChild; title: ReactChild; num?: number; status?: [string, number] }> = ({
  icon,
  title,
  num,
  status,
}) => (
  <Card variant="outlined">
    <Box display="flex" alignItems="center" gap={1.5}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 1,
          bgcolor: 'primary.softBg',
          color: 'primary.softColor',
          fontSize: 'xl',
          borderRadius: 6,
        }}
      >
        {icon}
      </Box>
      <Typography level="h2" component="div" fontSize="lg">
        {title}
      </Typography>
    </Box>
    <CardContent orientation="horizontal" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
      <Typography level="h3" component="div" sx={{ ml: 0.5 }}>
        {num && num > 0 ? num : '--'}
      </Typography>
      {status && (
        <Box mt={1}>
          <StatusLabel status={status} />
        </Box>
      )}
    </CardContent>
  </Card>
)

export default function Dashboard() {
  const { data: experiments } = useGetExperiments()
  const { data: schedules } = useGetSchedules()
  const { data: workflows } = useGetWorkflows()
  const { data: events } = useGetEvents({ limit: 50 })

  const calculateStatus = (data?: { status?: string }[]): [string, number] | undefined => {
    if (!data) {
      return undefined
    }

    const grouped = _.groupBy(data, 'status')

    if (grouped['running']?.length > 0) {
      return ['running', grouped['running'].length]
    } else if (grouped['paused']?.length > 0) {
      return ['paused', grouped['paused'].length]
    } else {
      return undefined
    }
  }

  const timelineChartRef = useRef<HTMLDivElement>()

  useEffect(() => {
    if (experiments) {
      const timelineContainer = timelineChartRef.current!

      const data = genTimelineData(experiments)
      const plot = timelinePlot(data, {
        width: timelineContainer.offsetWidth,
      })

      timelineContainer.append(plot)

      return () => plot.remove()
    }
  }, [experiments])

  return (
    <TourProvider
      steps={steps}
      prevButton={({ setCurrentStep }) => (
        <IconButton onClick={() => setCurrentStep((s) => s + 1)}>
          <ArrowBackOutlinedIcon />
        </IconButton>
      )}
      nextButton={({ setCurrentStep }) => (
        <IconButton onClick={() => setCurrentStep((s) => s + 1)}>
          <ArrowForwardOutlinedIcon />
        </IconButton>
      )}
      showCloseButton={false}
    >
      <Grid container spacing={3}>
        <Grid xs={12} lg={9}>
          <Welcome />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} lg={3}>
          <NumCard title={i18n('workflows.title')} num={workflows?.length} icon={<AccountTreeOutlinedIcon />} />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <NumCard
            title={i18n('schedules.title')}
            num={schedules?.length}
            icon={<ScheduleIcon />}
            status={calculateStatus(schedules)}
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <NumCard title={i18n('experiments.title')} num={experiments?.length} icon={<ScienceOutlinedIcon />} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} lg={4}>
          <Card variant="outlined" sx={{ my: 1.5 }}>
            <Typography level="h2" fontSize="lg">
              {i18n('dashboard.totalStatus')}
            </Typography>
            <TotalStatus height={300} />
          </Card>
        </Grid>
        <Grid xs={12} lg={5}>
          <Card variant="outlined" sx={{ my: 1.5 }}>
            <Typography level="h2" fontSize="lg">
              {i18n('dashboard.recentEvents')}
            </Typography>
            <EventsTimeline events={events} height={300} />
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} lg={9}>
          <Card variant="outlined" sx={{ my: 1.5 }}>
            <Typography level="h2" fontSize="lg">
              {i18n('dashboard.timeline')}
            </Typography>
            <Box ref={timelineChartRef} height={275} />
          </Card>
        </Grid>
      </Grid>
    </TourProvider>
  )
}
