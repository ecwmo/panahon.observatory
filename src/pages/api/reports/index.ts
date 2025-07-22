import type { APIRoute } from 'astro'

import { prisma } from '@/db'

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const { searchParams } = url
    const take = searchParams.has('take') ? +searchParams.get('take') : 5
    const skip = searchParams.has('skip') ? +searchParams.get('skip') : 0

    const reportNames = await prisma.report.groupBy({
      by: ['name'],
      skip: skip,
      take: take,
      _max: {
        number: true,
      },
      orderBy: {
        _max: {
          createdAt: 'desc',
        },
      },
    })

    const reports = await Promise.all(
      reportNames.map(async (r) => {
        const { id, title, name, number, files } = await prisma.report.findFirst({
          where: {
            name: r.name,
            number: r._max.number,
            show: true,
          },
          select: {
            id: true,
            title: true,
            name: true,
            number: true,
            files: {
              select: {
                fileName: true,
              },
              orderBy: {
                order: 'asc',
              },
              take: 1,
            },
          },
        })

        return {
          id,
          title,
          name,
          number,
          coverImg: files[0].fileName,
        }
      }),
    )

    return new Response(JSON.stringify(reports), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch (error) {
    return new Response(`Something went wrong in api/reports route!: ${error as string}`, {
      status: 501,
      statusText: 'Server error',
    })
  }
}
