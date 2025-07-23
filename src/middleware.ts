import { defineMiddleware, sequence } from 'astro:middleware'

import { auth } from '@/lib/auth'
import { $activePage, setActivePage } from '@/stores/routes'

const pageMiddleware = defineMiddleware((context, next) => {
  setActivePage(context.url.pathname)

  $activePage.subscribe((p) => {
    context.locals.page = p
  })
  return next()
})

const authMiddleware = defineMiddleware(async (context, next) => {
  const isAuthed = await auth.api.getSession({
    headers: context.request.headers,
  })

  if (isAuthed) {
    context.locals.user = isAuthed.user
    context.locals.session = isAuthed.session
  } else {
    context.locals.user = null
    context.locals.session = null
    if (context.locals.page?.auth) return context.redirect(`/login?ref=${context.locals.page.to}`)
  }

  return next()
})

export const onRequest = sequence(pageMiddleware, authMiddleware)
