import type { APIRoute } from 'astro'

import { readFile, readdir } from 'node:fs/promises'

import { prisma } from '@/db'
import { resourceDir } from '@/lib/helper/pages'

export const POST: APIRoute = async () => {
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

  return new Response(JSON.stringify('success'), {
    status: 200,
  })
}
