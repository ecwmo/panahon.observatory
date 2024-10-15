import type { APIRoute } from 'astro'

import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'

import { prisma } from '@/db'
import { resourceDir } from '@/lib/helper/pages'

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
      })
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

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()

  if (data.has('upload')) {
    const repFile = data.get('report') as File
    const repFileName = repFile.name

    const repTitle = `${data.get('title')}`.trim()
    const repCode = `${data.get('code')}`.trim().toLowerCase()
    const repNum = `${data.get('number')}`.padStart(3, '0')

    const uploadDir = `${resourceDir}/reports/${repCode}/${repNum}`
    const imgDir = `${uploadDir}/img`
    const repLocalPath = `${uploadDir}/${repFileName}`

    await rm(imgDir, { recursive: true, force: true })
    await mkdir(imgDir, { recursive: true })

    const fBuffer = Buffer.from(await repFile.arrayBuffer())
    await writeFile(repLocalPath, fBuffer)

    const reportConf = {
      title: repTitle,
      code: repCode,
      num: repNum,
    }
    await writeFile(`${resourceDir}/reports/draft.json`, JSON.stringify(reportConf))

    const pdf2img = await import("pdf-img-convert")
    const imgs = await pdf2img.convert(repLocalPath, { scale: 2 })

    for (let i = 0; i < imgs.length; i++) {
      const iStr = `${i}`.padStart(3, '0')
      const rdmStr = Math.random().toString(20).slice(2, 11)
      await writeFile(`${imgDir}/${iStr}-output-${rdmStr}.png`, imgs[i])
    }
  } else if (data.has('publish')) {
    const reportConf = await readFile(`${resourceDir}/reports/draft.json`).then((d) => JSON.parse(d.toString()))
    const { title, code, num } = reportConf

    const imgSrc = `${code}/${num}/img`
    const imgs = await readdir(`${resourceDir}/reports/${imgSrc}`)

    await prisma.report.create({
      data: {
        title: title,
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
