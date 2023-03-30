import type { APIRoute } from 'astro'

import { cp, mkdir, readdir, readFile, rm, writeFile } from 'fs/promises'
import { fromBuffer } from 'pdf2pic'
import { ToBase64Response } from 'pdf2pic/dist/types/toBase64Response'

import { resourceDir, resourcePath } from '@/pages/api/_common'

export const get: APIRoute = async ({ request }) => {
  try {
    let contentType = 'application/json'
    const { searchParams } = new URL(request.url)
    let imgSrc = ''
    let sImgSrc = ''
    if (searchParams.get('view') === 'draft') {
      imgSrc = 'reports/img/draft'
      sImgSrc = 'reports/img/sdraft'
    } else {
      const conf = await readFile(`${resourceDir}/reports/report.json`, 'utf8').then((d) => JSON.parse(d))
      const { repcode, reportnum } = conf['public']
      imgSrc = `reports/${repcode}/${reportnum}/img`
      sImgSrc = 'reports/img/static'
    }

    const reportImgs = await readdir(`${resourceDir}/${imgSrc}`)
      .then((d) =>
        d.filter((f) => f.endsWith('.jpg') || f.endsWith('.png')).map((f) => `${resourcePath}/${imgSrc}/${f}`)
      )
      .catch(() => [])
    const staticImgs = await readdir(`${resourceDir}/${sImgSrc}`)
      .then((d) =>
        d.filter((f) => f.endsWith('.jpg') || f.endsWith('.png')).map((f) => `${resourcePath}/${sImgSrc}/${f}`)
      )
      .catch(() => [])

    const res = JSON.stringify({ reportImgs, staticImgs })

    return new Response(res, {
      status: 200,
      headers: { 'content-type': contentType },
    })
  } catch (error) {
    return new Response(`Something went wrong in api/report route!: ${error as string}`, {
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
    const imgDraftDir = `${resourceDir}/reports/img/draft`
    const imgDir = `${uploadDir}/img`
    const repLocalPath = `${uploadDir}/${repFileName}`

    await Promise.all([rm(imgDraftDir, { recursive: true, force: true }), rm(imgDir, { recursive: true, force: true })])
    await Promise.all([
      mkdir(uploadDir, { recursive: true }),
      mkdir(imgDraftDir, { recursive: true }),
      mkdir(imgDir, { recursive: true }),
    ])
    // await rm(repLocalPath, { force: true })

    const fBuffer = Buffer.from(await repFile.arrayBuffer())
    await writeFile(repLocalPath, fBuffer)

    const reportConf = await readFile(`${resourceDir}/reports/report.json`).then((d) => JSON.parse(d.toString()))

    reportConf['draft']['repcode'] = repCode
    reportConf['draft']['reportnum'] = repNum

    await writeFile(`${resourceDir}/reports/report.json`, JSON.stringify(reportConf))

    const convert = fromBuffer(fBuffer, { width: 1440, height: 1080, density: 144, format: 'jpg' })

    let oldBase64: string
    let page = 1
    while (true) {
      const { base64 }: ToBase64Response = await convert(page, true)
      if (oldBase64 && oldBase64 === base64) {
        break
      } else {
        const iStr = `${page}`.padStart(3, '0')
        const rdmStr = Math.random().toString(20).slice(2, 11)
        await writeFile(`${imgDraftDir}/${iStr}-output-${rdmStr}.jpg`, base64, 'base64')
        oldBase64 = base64
        page++
      }
    }

    await cp(imgDraftDir, imgDir, { recursive: true })
  } else if (data.has('publish')) {
    const reportConf = await readFile(`${resourceDir}/reports/report.json`).then((d) => JSON.parse(d.toString()))

    reportConf['public']['repcode'] = reportConf['draft']['repcode']
    reportConf['public']['reportnum'] = reportConf['draft']['reportnum']

    await writeFile(`${resourceDir}/reports/report.json`, JSON.stringify(reportConf))
  }

  return new Response(JSON.stringify('success'), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
