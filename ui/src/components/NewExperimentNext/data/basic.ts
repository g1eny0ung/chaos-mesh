import * as Yup from 'yup'

import { Env } from 'slices/experiments'

const data = {
  name: '',
  namespace: '',
  labels: [],
  annotations: [],
  scope: {
    namespaces: [],
    label_selectors: [],
    annotation_selectors: [],
    phase_selectors: ['all'],
    mode: 'one',
    value: '',
    pods: [],
    addresses: [],
    name: '',
    address: '',
  },
  scheduler: {
    duration: '',
  },
}

export const schema = (env: Env) =>
  Yup.object({
    name: Yup.string().trim().required('The name is required'),
    scope: Yup.object({
      namespaces: env === 'k8s' ? Yup.array().min(1, 'The namespace selectors is required') : Yup.array(),
    }),
  })

export type dataType = typeof data

export default data
