import { test as baseTest } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import RowGroupBtns from '@/components/RowGroupBtns.vue'

import type { VueWrapper } from '@vue/test-utils'
import type { ButtonProps } from '@/components/RowGroupBtns.vue'

const test = baseTest.extend<{
  items: ButtonProps<number>[]
  wrapper: VueWrapper
}>({
  items: async ({}, use) => {
    await use([
      { val: 0, text: 'test1' },
      { val: 1, text: 'test2' },
      { val: 2, text: 'test3' },
    ])
  },
  wrapper: async ({}, use) => {
    const w = shallowMount(RowGroupBtns, { props: { items: [] as ButtonProps<number>[], modelValue: 0 } })
    await use(w)
    w.unmount()
  },
})

test('default', ({ expect, wrapper }) => {
  expect(wrapper.findAll('button')).toHaveLength(0)
  wrapper.unmount()
})

test('with props', async ({ expect, items, wrapper }) => {
  const activeBtnIdx = 1
  await wrapper.setProps({ items, modelValue: items[activeBtnIdx].val })
  const btnEls = wrapper.findAll('button')
  expect(btnEls).toHaveLength(items.length)
})

test('click', async ({ expect, items, wrapper }) => {
  const activeBtnIdx = 1
  await wrapper.setProps({ items, modelValue: items[activeBtnIdx].val })
  const btnEls = wrapper.findAll('button')

  const clickIdx = 2
  await btnEls[clickIdx].trigger('click')
  expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([items[clickIdx].val])
})
