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
 */
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, Button, Card, CardContent, IconButton, LinearProgress, Typography } from '@mui/joy'
import type { PopoverContentProps } from '@reactour/tour'
import type { ReactNode } from 'react'
import { useIntl } from 'react-intl'

function renderStepContent(props: PopoverContentProps): ReactNode {
  const content = props.steps[props.currentStep]?.content

  return typeof content === 'function' ? (content(props) as ReactNode) : content
}

export default function TutorialCard(props: PopoverContentProps) {
  const { currentStep, disabledActions, setCurrentStep, setIsOpen, steps } = props
  const intl = useIntl()
  const totalSteps = steps.length
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  const close = () => {
    if (!disabledActions) {
      setIsOpen(false)
    }
  }

  const next = () => {
    if (isLastStep) {
      close()
    } else {
      setCurrentStep((step) => Math.min(step + 1, totalSteps - 1))
    }
  }

  return (
    <Card
      variant="outlined"
      sx={{
        width: { xs: 'calc(100vw - 32px)', sm: 360 },
        maxWidth: 360,
        minHeight: 232,
        gap: 2,
        boxShadow: 'sm',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 40,
            height: 40,
            bgcolor: 'primary.softBg',
            color: 'primary.softColor',
            borderRadius: 6,
          }}
        >
          <Typography level="title-lg" color="primary">
            {currentStep + 1}
          </Typography>
        </Box>

        <Typography id="tutorial-card-title" level="h2" component="h2" sx={{ flex: 1, fontSize: 'lg' }}>
          {intl.formatMessage({ id: 'dashboard.tutorial.title' })}
        </Typography>

        <IconButton
          variant="outlined"
          color="neutral"
          size="sm"
          aria-label={intl.formatMessage({ id: 'common.close' })}
          disabled={disabledActions}
          onClick={close}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <CardContent sx={{ justifyContent: 'center' }}>
        <Typography level="body-md" color="neutral">
          {renderStepContent(props)}
        </Typography>
      </CardContent>

      <LinearProgress
        determinate
        value={((currentStep + 1) / totalSteps) * 100}
        size="sm"
        aria-label={intl.formatMessage(
          { id: 'dashboard.tutorial.progress' },
          { current: currentStep + 1, total: totalSteps },
        )}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Typography level="body-xs" color="neutral">
          {intl.formatMessage({ id: 'dashboard.tutorial.progress' }, { current: currentStep + 1, total: totalSteps })}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            startDecorator={<ArrowBackOutlinedIcon />}
            disabled={disabledActions || isFirstStep}
            onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
          >
            {intl.formatMessage({ id: 'dashboard.tutorial.previous' })}
          </Button>
          <Button
            size="sm"
            endDecorator={isLastStep ? undefined : <ArrowForwardOutlinedIcon />}
            disabled={disabledActions}
            onClick={next}
          >
            {intl.formatMessage({
              id: isLastStep ? 'dashboard.tutorial.finish' : 'dashboard.tutorial.next',
            })}
          </Button>
        </Box>
      </Box>
    </Card>
  )
}
