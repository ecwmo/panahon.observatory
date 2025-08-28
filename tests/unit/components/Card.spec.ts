import { test as baseTest } from 'vitest'
import { VueWrapper, config, shallowMount } from '@vue/test-utils'

import Card from '@/components/Card.vue'
import Popup from '@/components/Popup.vue'

import type { MountingOptions } from '@vue/test-utils'
import type { CardProps } from '@/components/Card.vue'

type MountProps = { data: CardProps; isActive?: boolean; isLoading?: boolean }

const test = baseTest.extend<{
  defaultOpts: MountingOptions<MountProps>
  wrapper: VueWrapper
  mountComponent: (opts: MountingOptions<MountProps>) => VueWrapper
}>({
  defaultOpts: {
    props: {
      data: {
        title: 'Test1',
        value1: '0',
      },
    },
  },
  mountComponent: async ({ defaultOpts }, use) => {
    let wrapper = shallowMount(Card)
    await use((opts) => {
      wrapper = shallowMount(Card, { ...defaultOpts, ...opts })
      return wrapper
    })
    wrapper?.unmount()
  },
  wrapper: async ({ defaultOpts }, use) => {
    const w = shallowMount(Card, { ...defaultOpts })
    await use(w)
    w.unmount()
  },
})

test('default', async ({ expect, wrapper }) => {
  expect(wrapper?.find('[data-test="card"]').exists()).toBe(false)
})

describe('props', () => {
  test.scoped({
    defaultOpts: {
      props: {
        data: {
          title: 'Test1',
          value1: '0',
        },
        isLoading: false,
      },
      attachTo: document.body,
    },
  })

  test('title;value1', async ({ expect, wrapper }) => {
    const data: CardProps = {
      title: 'Test1',
      value1: '0',
    }
    await wrapper.setProps({ data })

    expect(wrapper.find('[data-test="card"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-icon"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-info"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-info-title"]').text()).toContain(data['title'])
    expect(wrapper.find('[data-test="card-info-detail1"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-info-label1"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="card-info-value1"]').text()).toContain(data['value1'])
    expect(wrapper.find('[data-test="card-info-detail2"]').exists()).toBe(false)

    expect(wrapper.get('[data-test="card-info-popup"]').isVisible()).toBe(false)
  })

  test('label1', async ({ expect, wrapper }) => {
    const data: CardProps = {
      title: 'Test1',
      value1: '0',
      label1: 'Label 1',
    }
    await wrapper.setProps({ data })

    expect(wrapper.find('[data-test="card-info-detail1"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-info-label1"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-info-label1"]').text()).toContain(data['label1'])
    expect(wrapper.find('[data-test="card-info-value1"]').text()).toContain(data['value1'])
    expect(wrapper.find('[data-test="card-info-detail2"]').exists()).toBe(false)
  })

  test('value2', async ({ expect, wrapper }) => {
    const data: CardProps = {
      title: 'Test1',
      label1: 'test label',
      value1: '0',
      value2: '1',
    }
    await wrapper.setProps({ data })

    expect(wrapper.find('[data-test="card-info-detail2"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-info-label2"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="card-info-value2"]').text()).toContain(data['value2'])
  })

  test('label2', async ({ expect, wrapper }) => {
    const data: CardProps = {
      title: 'Test1',
      label1: 'test label',
      value1: '0',
      label2: 'test label2',
      value2: '1',
    }
    await wrapper.setProps({ data })

    expect(wrapper.find('[data-test="card-info-label2"]').text()).toContain(data['label2'])
  })

  test('isActive', async ({ expect, wrapper }) => {
    const data: CardProps = {
      title: 'Test1',
      label1: 'test label',
      value1: '0',
      label2: 'test label2',
      value2: '1',
    }
    await wrapper.setProps({ data })

    expect(wrapper.get('[data-test="card-info-popup"]').isVisible()).toBe(false)

    await wrapper.setProps({ isActive: true })
    expect(wrapper.get('[data-test="card-info-popup"]').isVisible()).toBe(true)
  })
})

describe('slots', () => {
  beforeEach(() => {
    config.global.renderStubDefaultSlot = true
  })

  afterEach(() => {
    config.global.renderStubDefaultSlot = false
  })

  test.scoped({
    defaultOpts: {
      props: {
        data: {
          title: 'Test1',
          label1: 'test label',
          value1: '0',
          label2: 'test label2',
          value2: '1',
        },
        isLoading: false,
      },
    },
  })

  test('popup', ({ expect, wrapper, mountComponent }) => {
    expect(wrapper.get('[data-test="card-info-popup"] > popup-stub').text()).toBeFalsy()

    const w = mountComponent({ slots: { default: 'popup text' } })
    expect(w.get('[data-test="card-info-popup"] > popup-stub').text()).toContain('popup text')
  })

  test('icon1', ({ expect, wrapper, mountComponent }) => {
    expect(wrapper.get('[data-test="card-icon"]').element.innerHTML).toBeFalsy()

    const w = mountComponent({ slots: { icon1: '<div>Icon</div>' } })
    expect(w.get('[data-test="card-icon"] > div').text()).toContain('Icon')
  })

  test('icon2', ({ expect, wrapper, mountComponent }) => {
    expect(wrapper.get('[data-test="card-icon2"]').element.innerHTML).toBeFalsy()

    const w = mountComponent({ slots: { icon2: '<div>Icon02</div>' } })
    expect(w.get('[data-test="card-icon2"] > div').text()).toContain('Icon02')
  })
})

describe('events', () => {
  test.scoped({
    defaultOpts: {
      props: {
        data: {
          title: 'Test1',
          label1: 'test label',
          value1: '0',
          label2: 'test label2',
          value2: '1',
        },
        isLoading: false,
      },
    },
  })

  test('popup', async ({ expect, wrapper }) => {
    const popupParent = wrapper.get('[data-test="card-info-popup"]')
    const popupChild = wrapper.findComponent(Popup)
    expect(popupChild.exists()).toBe(true)
    expect(popupChild.props('show')).toBe(false)
    await popupParent.trigger('mouseover')
    expect(popupChild.props('show')).toBe(true)
    await popupParent.trigger('mouseout')
    expect(popupChild.props('show')).toBe(false)
  })
})
