import { PrismaClient } from '@prisma/client'
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

  const reports = (await walk(`${resourceDir}/${imgSrc}`))
    .flat(2)
    .reduce((o: Record<string, string[][]>, c: string[]) => {
      const m = c[0].match(/reports\/([a-z0-9]+)\/([0-9]{3})/i)
      if (m !== null) {
        const grp1 = m[1]
        const grp2 = m[2]
        const imgs = c.map((img) => img.replace(`${resourceDir}/${imgSrc}/`.replace('./', ''), ''))
        return { ...o, [m[1]]: o[grp1] ? { ...o[grp1], [grp2]: imgs } : { [grp2]: imgs } }
      }

      return o
    }, {})

  await Promise.all(
    Object.keys(reports).map(async (grp1) => {
      const report = reports[grp1]
      await Promise.all(
        Object.keys(report).map(async (grp2) => {
          const imgs = report[grp2]
          await prisma.report.create({
            data: {
              title: `${grp1.toUpperCase()} Report #${grp2}`,
              name: grp1,
              number: Number(grp2),
              files: {
                create: imgs.map((img: string) => {
                  return {
                    fileName: img.replace(`${resourceDir}/${imgSrc}/`.replace('./', ''), ''),
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
    imgs.map(
      async (img) =>
        await prisma.reportStaticItem.create({
          data: {
            fileName: `img/static/${img}`,
          },
        })
    )
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

addReports().then(() => console.log('done'))
addReportStaticFiles().then(() => console.log('done'))
