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
import { useGetEvents, useGetExperiments, useGetSchedules, useGetWorkflows } from '@/openapi'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import { Box, CardContent, Grid, Typography } from '@mui/joy'
import GlobalStyles from '@mui/joy/GlobalStyles'
import { TourProvider, useTour } from '@reactour/tour'
import _ from 'lodash'
import { type ReactNode, useEffect } from 'react'

import EventsTimeline from '@/components/EventsTimeline'
import PanelCard from '@/components/PanelCard'
import StatusLabel from '@/components/StatusLabel'
import i18n from '@/components/T'

import TotalStatus from './TotalStatus'
import TutorialCard from './TutorialCard'
import Welcome from './Welcome'
import { steps } from './tourSteps'

const tutorialTargetCardClassName = 'tutorial-target-card'

function TutorialTargetCard() {
  const { currentStep, isOpen, steps: tourSteps } = useTour()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const selector = tourSteps[currentStep]?.selector
    const target = typeof selector === 'string' ? document.querySelector(selector) : selector

    target?.classList.add(tutorialTargetCardClassName)

    return () => target?.classList.remove(tutorialTargetCardClassName)
  }, [currentStep, isOpen, tourSteps])

  return (
    <GlobalStyles
      styles={{
        [`.${tutorialTargetCardClassName}`]: {
          position: 'relative',
          backgroundColor: 'var(--joy-palette-background-surface)',
          borderRadius: 'var(--joy-radius-md)',
          boxShadow: 'var(--joy-shadow-sm)',
        },
      }}
    />
  )
}

const NumCard: React.FC<{ icon: ReactNode; title: ReactNode; num?: number; status?: [string, number] }> = ({
  icon,
  title,
  num,
  status,
}) => (
  <PanelCard>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
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
      <Typography
        level="h2"
        component="div"
        sx={{
          fontSize: 'lg',
        }}
      >
        {title}
      </Typography>
    </Box>
    <CardContent orientation="horizontal" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
      <Typography level="h3" component="div" sx={{ ml: 0.5 }}>
        {num && num > 0 ? num : '--'}
      </Typography>
      {status && (
        <Box
          sx={{
            mt: 1,
          }}
        >
          <StatusLabel status={status} />
        </Box>
      )}
    </CardContent>
  </PanelCard>
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

  return (
    <TourProvider
      steps={steps}
      ContentComponent={TutorialCard}
      position="right"
      styles={{
        popover: (base) => ({
          ...base,
          maxWidth: 'calc(100vw - 24px)',
          padding: 0,
          backgroundColor: 'transparent',
          color: 'inherit',
          borderRadius: 'var(--joy-radius-md)',
          boxShadow: 'none',
        }),
        maskArea: (base) => ({
          ...base,
          rx: 12,
        }),
      }}
    >
      <TutorialTargetCard />
      <Grid container spacing={3}>
        <Grid xs={12} xl={9}>
          <Welcome />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4} xl={3}>
          <NumCard title={i18n('workflows.title')} num={workflows?.length} icon={<AccountTreeOutlinedIcon />} />
        </Grid>
        <Grid xs={12} sm={6} md={4} xl={3}>
          <NumCard
            title={i18n('schedules.title')}
            num={schedules?.length}
            icon={<ScheduleIcon />}
            status={calculateStatus(schedules)}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} xl={3}>
          <NumCard title={i18n('experiments.title')} num={experiments?.length} icon={<ScienceOutlinedIcon />} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} md={6} xl={4}>
          <PanelCard sx={{ my: 1.5 }}>
            <Typography
              level="h2"
              sx={{
                fontSize: 'lg',
              }}
            >
              {i18n('dashboard.totalStatus')}
            </Typography>
            <TotalStatus height={300} />
          </PanelCard>
        </Grid>
        <Grid xs={12} md={6} xl={5}>
          <PanelCard sx={{ my: 1.5 }}>
            <Typography
              level="h2"
              sx={{
                fontSize: 'lg',
              }}
            >
              {i18n('dashboard.recentEvents')}
            </Typography>
            <EventsTimeline events={events} height={300} />
          </PanelCard>
        </Grid>
      </Grid>
    </TourProvider>
  )
}
