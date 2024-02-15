import Card, { type CardProps } from '@/components/Card.vue'
import Popup from '@/components/Popup.vue'
import { VueWrapper, config, mount, shallowMount } from '@vue/test-utils'

type MountOpts = {
  props?: { data: CardProps; isActive?: boolean }
  slots?: Record<string, string>
}

type CardTestContext = {
  wrapper: VueWrapper
  mount: (opts: MountOpts) => void
  unmount: () => void
}

test('default', () => {
  const wrapper = shallowMount(Card)
  expect(wrapper.find('[data-test="card"]').exists()).toBe(false)
})

describe('props', () => {
  beforeEach<CardTestContext>((ctx) => {
    ctx.mount = (opts) => {
      ctx.wrapper = shallowMount(Card, { ...opts, attachTo: document.body })
    }
    ctx.unmount = () => ctx.wrapper.unmount()
  })

  afterEach<CardTestContext>((ctx) => {
    ctx.unmount()
  })

  test<CardTestContext>('title;value1', async (ctx) => {
    const data: CardProps = {
      title: 'Test1',
      value1: '0',
    }

    ctx.mount({ props: { data } })
    const { wrapper, expect } = ctx

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

  test<CardTestContext>('label1', (ctx) => {
    const data: CardProps = {
      title: 'Test1',
      value1: '0',
      label1: 'Label 1',
    }
    ctx.mount({ props: { data } })

    const { expect, wrapper } = ctx

    expect(wrapper.find('[data-test="card-info-detail1"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-info-label1"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-info-label1"]').text()).toContain(data['label1'])
    expect(wrapper.find('[data-test="card-info-value1"]').text()).toContain(data['value1'])
    expect(wrapper.find('[data-test="card-info-detail2"]').exists()).toBe(false)
  })

  test<CardTestContext>('value2', (ctx) => {
    const data: CardProps = {
      title: 'Test1',
      label1: 'test label',
      value1: '0',
      value2: '1',
    }
    ctx.mount({ props: { data } })

    const { expect, wrapper } = ctx

    expect(wrapper.find('[data-test="card-info-detail2"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="card-info-label2"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="card-info-value2"]').text()).toContain(data['value2'])
  })

  test<CardTestContext>('label2', (ctx) => {
    const data: CardProps = {
      title: 'Test1',
      label1: 'test label',
      value1: '0',
      label2: 'test label2',
      value2: '1',
    }
    ctx.mount({ props: { data } })

    const { expect, wrapper } = ctx

    expect(wrapper.find('[data-test="card-info-label2"]').text()).toContain(data['label2'])
  })

  test<CardTestContext>('isActive', async (ctx) => {
    const data: CardProps = {
      title: 'Test1',
      label1: 'test label',
      value1: '0',
      label2: 'test label2',
      value2: '1',
    }
    ctx.mount({ props: { data } })

    const { expect, wrapper } = ctx
    expect(wrapper.get('[data-test="card-info-popup"]').isVisible()).toBe(false)

    await wrapper.setProps({ isActive: true })
    expect(wrapper.get('[data-test="card-info-popup"]').isVisible()).toBe(true)
  })
})

describe('slots', () => {
  beforeEach<CardTestContext>((ctx) => {
    config.global.renderStubDefaultSlot = true
    ctx.mount = (opts) => {
      const data: CardProps = {
        title: 'Test1',
        label1: 'test label',
        value1: '0',
        label2: 'test label2',
        value2: '1',
      }
      ctx.wrapper = shallowMount(Card, { ...opts, props: { data } })
    }
    ctx.unmount = () => ctx.wrapper.unmount()
  })

  afterEach<CardTestContext>((ctx) => {
    ctx.unmount()
    config.global.renderStubDefaultSlot = false
  })

  test<CardTestContext>('popup', (ctx) => {
    ctx.mount({})
    let { expect, wrapper } = ctx
    expect(wrapper.get('[data-test="card-info-popup"] > popup-stub').text()).toBeFalsy()

    ctx.mount({ slots: { default: 'popup text' } })
    wrapper = ctx.wrapper
    expect(wrapper.get('[data-test="card-info-popup"] > popup-stub').text()).toContain('popup text')
  })

  test<CardTestContext>('icon1', (ctx) => {
    ctx.mount({})
    let { expect, wrapper } = ctx
    expect(wrapper.get('[data-test="card-icon"]').element.innerHTML).toBeFalsy()

    ctx.mount({ slots: { icon1: '<div>Icon</div>' } })
    wrapper = ctx.wrapper
    expect(wrapper.get('[data-test="card-icon"] > div').text()).toContain('Icon')
  })

  test<CardTestContext>('icon2', (ctx) => {
    ctx.mount({})
    let { expect, wrapper } = ctx
    expect(wrapper.get('[data-test="card-icon2"]').element.innerHTML).toBeFalsy()

    ctx.mount({ slots: { icon2: '<div>Icon02</div>' } })
    wrapper = ctx.wrapper
    expect(wrapper.get('[data-test="card-icon2"] > div').text()).toContain('Icon02')
  })
})

describe('events', () => {
  beforeEach<CardTestContext>((ctx) => {
    ctx.mount = (opts) => {
      const data: CardProps = {
        title: 'Test1',
        label1: 'test label',
        value1: '0',
        label2: 'test label2',
        value2: '1',
      }
      ctx.wrapper = mount(Card, { ...opts, props: { data, isActive: true } })
    }
    ctx.unmount = () => ctx.wrapper.unmount()
  })

  afterEach<CardTestContext>((ctx) => {
    ctx.unmount()
  })

  test<CardTestContext>('popup', async (ctx) => {
    ctx.mount({})
    const { expect, wrapper } = ctx
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
