import type { APIRoute } from 'astro'

import ldap from 'ldapjs'

const { createClient } = ldap

export const post: APIRoute = async ({ request }) => {
  const data = await request.formData()
  let res = {}
  if (data.has('login')) {
    const username = data.get('username')
    const pass = data.get('password')
    const client = createClient({ url: [import.meta.env.LDAP_URL] })
    const authUser = `${import.meta.env.LDAP_USER_ATTR}=${username},${import.meta.env.LDAP_DC}`

    res = await new Promise((resolve, reject) => {
      client.bind(authUser, pass, (err) => {
        if (err) {
          reject({ message: 'fail', type: 'login' })
        }
        client.unbind()
        resolve({ valid: true, timeout: new Date(), username })
      })
    })
  } else if (data.has('logout')) {
    res = { message: 'success', type: 'logout' }
  }

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}
