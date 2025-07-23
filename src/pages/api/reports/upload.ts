import type { APIRoute } from 'astro'

import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { pdf } from 'pdf-to-img'

import { getJob, createJob, removeJob } from '@/lib/job'
import { resourceDir } from '@/lib/helper/pages'

export const GET: APIRoute = async ({ request, url }) => {
  const { searchParams } = url
  const jobId = searchParams.get('id') ?? ''

  const job = getJob(jobId)

  if (!job) return new Response('no such job', { status: 404 })

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: Object) => {
        controller.enqueue(`data: ${JSON.stringify({ event, ...data })}\n\n`)
      }
      const onProgress = (data: Object) => send('progress', data)
      const onDone = (data: Object) => {
        send('done', data)
        controller.close()
      }
      const onError = (data: Object) => {
        send('error', data)
        controller.close()
      }

      job.on('progress', onProgress)
      job.on('done', onDone)
      job.on('error', onError)

      // Clean up on disconnect
      request.signal.addEventListener('abort', () => {
        job.off('progress', onProgress)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    },
  })
}

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()

  const repTitle = `${data.get('title')}`.trim()
  const repCode = `${data.get('code')}`.trim().toLowerCase()
  const repNum = `${data.get('number')}`.padStart(3, '0')

  const uploadDir = path.join(resourceDir, 'reports', repCode, repNum)
  await mkdir(uploadDir, { recursive: true })

  const repFile = data.get('report') as File
  const pdfPath = path.join(uploadDir, repFile.name)
  const pdfBuffer = Buffer.from(await repFile.arrayBuffer())

  const jobId = `${repCode}${repNum}`
  const job = createJob(jobId)

  ;(async function () {
    try {
      await writeFile(pdfPath, pdfBuffer)
      job.emit('progress', { status: 'uploaded' })

      const reportConf = {
        title: repTitle,
        code: repCode,
        num: repNum,
      }
      await writeFile(`${resourceDir}/reports/draft.json`, JSON.stringify(reportConf))
    } catch (err) {
      console.error('Error saving a copy of the pdf:', err)
      job.emit('error', { err })
      removeJob(jobId)
      return new Response(JSON.stringify({ err }), {
        status: 500,
      })
    }
    const pdfDoc = await pdf(pdfPath, { scale: 2 })
    job.emit('progress', { total: pdfDoc.length, status: 'converting' })

    const imgDir = path.join(uploadDir, 'img')
    await rm(imgDir, { recursive: true, force: true })
    await mkdir(imgDir, { recursive: true })

    let i = 0
    for await (const img of pdfDoc) {
      const iStr = `${i}`.padStart(3, '0')
      const rdmStr = Math.random().toString(20).slice(2, 11)
      const imgName = `${iStr}-output-${rdmStr}.png`

      try {
        await writeFile(path.join(imgDir, imgName), img)
        job.emit('progress', { page: i + 1, total: pdfDoc.length, status: 'converted' })
      } catch (err) {
        console.error('Error processing the image:', err)
        job.emit('error', { err })
        removeJob(jobId)
        return new Response(JSON.stringify({ err }), {
          status: 500,
        })
      }
      i++
    }
    job.emit('done', {})
    removeJob(jobId)
  })()

  return new Response(JSON.stringify({ jobId }), {
    status: 200,
  })
}
