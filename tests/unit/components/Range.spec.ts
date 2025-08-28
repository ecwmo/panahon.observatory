import { test as baseTest } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import Range from '@/components/Range.vue'

import type { VueWrapper } from '@vue/test-utils'
import type { RangeTicks } from '@/components/Range.vue'

const test = baseTest.extend<{
  ticks: RangeTicks
  wrapper: VueWrapper
}>({
  ticks: async ({}, use) => {
    await use({
      0: { label: 'test 1', popup: 'popup 1' },
      1: { label: 'test 2' },
      2: { label: 'test 3', popup: 'popup 3' },
      3: { popup: 'popup 4' },
      4: { label: 'test 5', popup: 'popup 5' },
      5: { label: 'test 6', popup: 'popup 6' },
      9: { popup: 'popup 10' },
      10: { popup: 'popup 11' },
      11: { label: 'test 12', popup: 'popup 12' },
    })
  },
  wrapper: async ({}, use) => {
    const w = shallowMount(Range, { props: { ticks: {} as RangeTicks, modelValue: 0 } })
    await use(w)
    w.unmount()
  },
})

test('default', ({ expect, wrapper }) => {
  expect(wrapper.exists()).toBe(true)
})

describe('props', () => {
  test('ticks', async ({ expect, ticks, wrapper }) => {
    await wrapper.setProps({ ticks })
    expect(wrapper.exists()).toBe(true)

    const rangeEl = wrapper.find<HTMLInputElement>('input[type="range"]')
    expect(rangeEl.exists()).toBe(true)

    const svgEl = wrapper.find<SVGElement>('svg[data-test="range-ticks"]')
    expect(svgEl.exists()).toBe(true)

    const gEl = svgEl.findAll('g')
    expect(gEl).toHaveLength(12)
    expect(svgEl.findAll('g rect')).toHaveLength(12)
    expect(svgEl.findAll('g text')).toHaveLength(6)

    expect(wrapper.find('[data-test="play-pause"]').exists()).toBe(false)
  })

  test('step', async ({ expect, ticks, wrapper }) => {
    await wrapper.setProps({ ticks, step: 3 })

    const svgEl = wrapper.find<SVGElement>('svg[data-test="range-ticks"]')
    expect(svgEl.exists()).toBe(true)

    const gEl = svgEl.findAll('g')
    expect(gEl).toHaveLength(5)
    expect(svgEl.findAll('g rect')).toHaveLength(5)
    expect(svgEl.findAll('g text')).toHaveLength(1)
  })

  test('minVal;maxVal', async ({ expect, ticks, wrapper }) => {
    await wrapper.setProps({ ticks, step: 2, minVal: 2, maxVal: 9 })

    const svgEl = wrapper.find<SVGElement>('svg[data-test="range-ticks"]')
    expect(svgEl.exists()).toBe(true)

    const gEl = svgEl.findAll('g')
    expect(gEl).toHaveLength(5)
    expect(svgEl.findAll('g rect')).toHaveLength(5)
    expect(svgEl.findAll('g text')).toHaveLength(2)

    const rangeEl = wrapper.find<HTMLInputElement>('input[type="range"]')
    expect(rangeEl.element.valueAsNumber).toEqual(2)
  })

  test('canPlay', async ({ expect, ticks, wrapper }) => {
    vi.useFakeTimers()

    await wrapper.setProps({ ticks, step: 3, canPlay: true })

    const playBtn = wrapper.find('[data-test="play-pause"]')
    expect(playBtn.exists()).toBe(true)

    await playBtn.trigger('click')
    vi.advanceTimersByTime(2000)

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)

    vi.useRealTimers()
  })

  test('timerDelay', async ({ expect, ticks, wrapper }) => {
    vi.useFakeTimers()

    await wrapper.setProps({ ticks, step: 3, canPlay: true, timerDelay: 200 })

    const playBtn = wrapper.find('[data-test="play-pause"]')
    expect(playBtn.exists()).toBe(true)

    await playBtn.trigger('click')
    vi.advanceTimersByTime(2000)

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(10)

    vi.useRealTimers()
  })
})
