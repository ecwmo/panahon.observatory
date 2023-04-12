import { PrismaClient } from '@prisma/client'
import type { APIRoute } from 'astro'

import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { convert } from 'pdf-img-convert'

import { resourceDir } from '@/pages/_common'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: import.meta.env.DATABASE_URL,
    },
  },
})

export const get: APIRoute = async ({ request }) => {
  try {
    const res = await prisma.report.findMany({
      select: {
        id: true,
        title: true,
        name: true,
        number: true,
        show: true,
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
      orderBy: {
        id: 'desc',
      },
    })

    const data = res.map((r) => {
      const { id, title, name, number, show, files } = r
      return { id, title, name, number, show, coverImg: files[0].fileName }
    })

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

export const post: APIRoute = async ({ request }) => {
  const data = await request.formData()

  if (data.has('upload')) {
    const repFile = data.get('report') as File
    const repFileName = repFile.name

    const repCode = `${data.get('repcode')}`.trim().toLowerCase()
    const repNum = `${data.get('reportnum')}`.padStart(3, '0')

    const uploadDir = `${resourceDir}/reports/${repCode}/${repNum}`
    const imgDir = `${uploadDir}/img`
    const repLocalPath = `${uploadDir}/${repFileName}`

    await rm(imgDir, { recursive: true, force: true })
    await mkdir(imgDir, { recursive: true })

    const fBuffer = Buffer.from(await repFile.arrayBuffer())
    await writeFile(repLocalPath, fBuffer)

    const reportConf = {
      code: repCode,
      num: repNum,
    }
    await writeFile(`${resourceDir}/reports/draft.json`, JSON.stringify(reportConf))

    const imgs = await convert(repLocalPath, { scale: 2 })

    for (let i = 0; i < imgs.length; i++) {
      const iStr = `${i}`.padStart(3, '0')
      const rdmStr = Math.random().toString(20).slice(2, 11)
      await writeFile(`${imgDir}/${iStr}-output-${rdmStr}.png`, imgs[i])
    }
  } else if (data.has('publish')) {
    const reportConf = await readFile(`${resourceDir}/reports/draft.json`).then((d) => JSON.parse(d.toString()))
    const { code, num } = reportConf

    const imgSrc = `${code}/${num}/img`
    const imgs = await readdir(`${resourceDir}/reports/${imgSrc}`)

    await prisma.report.create({
      data: {
        title: `${code.toUpperCase()} Report #${num}`,
        name: code,
        number: Number(num),
        files: {
          create: imgs.map((img: string, idx) => {
            return {
              fileName: `${imgSrc}/${img}`,
              order: idx,
            }
          }),
        },
      },
    })
  }

  return new Response(JSON.stringify('success'), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
