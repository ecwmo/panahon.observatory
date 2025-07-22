/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    page: import('@/stores/routes').Page | null
    user: import('better-auth').User | null
    session: import('better-auth').Session | null
  }
}
