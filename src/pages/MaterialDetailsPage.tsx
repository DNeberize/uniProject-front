import { useParams } from 'react-router'
import PageContainer from '../components/layout/PageContainer.tsx'

export default function MaterialDetailsPage() {
  const { id } = useParams()

  return (
    <PageContainer title="მასალის დეტალები">
      <p className="mt-space-sm font-code text-code-sm text-secondary">ID: {id}</p>
    </PageContainer>
  )
}
