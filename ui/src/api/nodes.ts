import http from './http'

export interface Node {
  name: string
  kind: 'k8s' | 'physic'
  config: string
}

export const add = (data: Node) => http.post('/node/registry', data)

export const nodes = () => http.get<Node[]>('/node/list')

export const del = (name: string) => http.delete(`/node/delete/${name}`)
