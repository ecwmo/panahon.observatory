import { PrismaClient } from '@prisma/client'
import { statSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

import { loadEnv } from 'vite'

const { APP_RES_DIR } = loadEnv(process.env.MODE, process.cwd(), '')

const resourceDir = APP_RES_DIR

const prisma = new PrismaClient()

const addReports = async () => {
  const imgSrc = 'reports'
  const imgRegex = /\.(gif|jpg|jpeg|tiff|png)$/i
  const excludeFolderRegex = new RegExp(`${imgSrc}\/img`)

  const walk = async (dirPath: string) =>
    Promise.all(
      await readdir(dirPath, { withFileTypes: true }).then((entries) =>
        entries
          .map((entry) => {
            const childPath = join(dirPath, entry.name)
            return entry.isDirectory() && !excludeFolderRegex.test(childPath)
              ? walk(childPath)
              : imgRegex.test(childPath)
              ? childPath
              : undefined
          })
          .filter((entries) => entries !== undefined)
      )
    )

  interface Img {
    name: string
    birthTime: Date
  }

  const reports = (await walk(`${resourceDir}/${imgSrc}`))
    .flat(2)
    .reduce((o: Record<string, Record<string, Img[]>>, c: string[]) => {
      const m = c[0].match(/reports\/([a-z0-9]+)\/([0-9]{3})/i)
      if (m !== null) {
        const grp1 = m[1]
        const grp2 = m[2]
        const imgs = c.map((img) => {
          const { birthtime } = statSync(img)
          return { name: img.replace(`${resourceDir}/${imgSrc}/`.replace('./', ''), ''), birthTime: birthtime }
        })

        return { ...o, [m[1]]: o[grp1] ? { ...o[grp1], [grp2]: imgs } : { [grp2]: imgs } }
      }

      return o
    }, {})

  const reportNames = Object.keys(reports)
    .map((grp1) => grp1)
    .sort((a, b) => {
      const c = a.match(/\d+/)[0]
      const d = b.match(/\d+/)[0]
      const e = `${c.slice(2)}${c.slice(0, 2)}`
      const f = `${d.slice(2)}${d.slice(0, 2)}`
      if (e < f) return -1
      if (e > f) return 1
      return 0
    })

  await Promise.all(
    reportNames.map(async (grp1) => {
      const report = reports[grp1] as Record<string, Img[]>
      await Promise.all(
        Object.keys(report).map(async (grp2) => {
          const imgs = report[grp2]
          const createdAt = imgs.at(-1).birthTime as Date
          await prisma.report.create({
            data: {
              title: `${grp1.toUpperCase()} Report #${grp2}`,
              name: grp1,
              number: Number(grp2),
              createdAt: createdAt,
              updatedAt: createdAt,
              files: {
                create: imgs.map((img, idx) => {
                  return {
                    fileName: img.name,
                    order: idx,
                    createdAt: img.birthTime,
                    updatedAt: img.birthTime,
                  }
                }),
              },
            },
          })
        })
      )
    })
  )
}

const addReportStaticFiles = async () => {
  const imgSrc = 'reports/img/static'

  const imgs = await readdir(`${resourceDir}/${imgSrc}`)

  const reports = await prisma.report.findMany({
    select: {
      id: true,
    },
  })

  const staticItems = await Promise.all(
    imgs.map(async (img) => {
      const { birthtime } = statSync(`${resourceDir}/${imgSrc}/${img}`)
      return await prisma.reportStaticItem.create({
        data: {
          fileName: `img/static/${img}`,
          createdAt: birthtime,
          updatedAt: birthtime,
        },
      })
    })
  )

  await Promise.all(
    reports.map(async (report) => {
      await prisma.report.update({
        where: report,
        data: {
          staticFiles: {
            create: staticItems.map((item, idx) => ({
              order: idx,
              reportStaticItem: {
                connect: {
                  id: item.id,
                },
              },
            })),
          },
        },
      })
    })
  )
}

// addReports().then(() => console.log('done'))
// addReportStaticFiles().then(() => console.log('done'))
