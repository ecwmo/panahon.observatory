import type { APIRoute } from 'astro'
import { readdir, readFile } from 'node:fs/promises'

import { prisma } from '@/db'
import { resourceDir, resourcePath } from '@/pages/_common'

export const get: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params
    let reportId = -1
    if (!isNaN(+id)) {
      reportId = Number(id)
    } else if (id === 'latest') {
      const latestReport = await prisma.report.findMany({
        orderBy: {
          id: 'desc',
        },
        take: 1,
        select: {
          id: true,
        },
      })
      reportId = Number(latestReport[0].id)
    }

    let files = []
    let staticFiles = []

    if (id !== 'draft') {
      const res = await prisma.report.findUnique({
        where: {
          id: reportId,
        },
        select: {
          title: true,
          files: {
            select: {
              fileName: true,
            },
          },
          staticFiles: {
            select: {
              reportStaticItem: {
                select: {
                  fileName: true,
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      })

      files = res.files.map((f) => `${resourcePath}/reports/${f.fileName}`)
      staticFiles = res.staticFiles.map((f) => `${resourcePath}/reports/${f.reportStaticItem.fileName}`)
    } else {
      const conf = await readFile(`${resourceDir}/reports/draft.json`, 'utf8').then((d) => JSON.parse(d))
      const { code, num } = conf
      const imgSrc = `reports/${code}/${num}/img`
      const sImgSrc = 'reports/img/draft'

      files = await readdir(`${resourceDir}/${imgSrc}`)
        .then((d) =>
          d.filter((f) => f.endsWith('.jpg') || f.endsWith('.png')).map((f) => `${resourcePath}/${imgSrc}/${f}`)
        )
        .catch(() => [])
      staticFiles = await readdir(`${resourceDir}/${sImgSrc}`)
        .then((d) =>
          d.filter((f) => f.endsWith('.jpg') || f.endsWith('.png')).map((f) => `${resourcePath}/${sImgSrc}/${f}`)
        )
        .catch(() => [])
    }

    const data = { files, staticFiles }

    return new Response(JSON.stringify(data), {
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
