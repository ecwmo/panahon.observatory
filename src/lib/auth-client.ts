import { createAuthClient } from 'better-auth/vue'

export const client = createAuthClient()

export const { signUp, signIn, signOut, useSession } = client
