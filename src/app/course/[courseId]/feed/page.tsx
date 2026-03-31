import { notFound } from 'next/navigation'
import type { CourseData } from '@/types'
import { FeedContainer } from '@/components/feed/FeedContainer'
import coursesIndex from '@/data/courses.json'

interface Props {
  params: Promise<{ courseId: string }>
}

async function getCourseData(courseId: string): Promise<CourseData | null> {
  try {
    const data = await import(`@/data/courses/${courseId}.json`)
    return data.default as CourseData
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  return coursesIndex.map((c) => ({ courseId: c.id }))
}

export default async function FeedPage({ params }: Props) {
  const { courseId } = await params
  const data = await getCourseData(courseId)
  if (!data) notFound()

  return <FeedContainer data={data} />
}
