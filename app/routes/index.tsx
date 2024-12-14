import { ScoringSheet } from '../features/scoring/ScoringSheet'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ScoringSheet />
}
