import { mount } from '@vue/test-utils'
import MapStationSelector from '@/components/MapStationSelector.vue'

describe('mounted, no props', () => {
  beforeEach((ctx) => {
    ctx.wrapper = mount(MapStationSelector)
  })

  it('shows "Loading..." on init', ({ wrapper }) => {
    const btn = wrapper.get('button')
    expect(btn).toBeTruthy()
    expect(btn.text()).toContain('Loading...')
  })

  it('toggles (empty) list when clicked', async ({ wrapper }) => {
    const btn = wrapper.get('button')
    expect(wrapper.find('ul').exists()).toBe(false)

    await btn.trigger('click')
    expect(wrapper.find('ul').exists()).toBe(true)
    // list should be empty
    expect(wrapper.find('ul li').exists()).toBe(false)

    await btn.trigger('click')
    expect(wrapper.find('ul').exists()).toBe(false)
  })
})

describe('mounted, w/ props', () => {
  beforeEach((ctx) => {
    const data = [
      { id: 1, name: 'stations1' },
      { id: 2, name: 'stations2' },
      { id: 3, name: 'stations3' },
      { id: 4, name: 'stations4' },
      { id: 5, name: 'stations5' },
      { id: 6, name: 'stations6' },
    ]

    const activeData = data[0]
    ctx.wrapper = mount(MapStationSelector, {
      props: {
        modelValue: activeData,
        stations: data,
      },
    })
  })

  it('displays selected item', ({ wrapper }) => {
    const btn = wrapper.get('button')
    expect(btn).toBeTruthy()
    expect(btn.text()).toContain(wrapper.props('modelValue').name)
  })

  it('toggles available items when clicked', async ({ wrapper }) => {
    const btn = wrapper.get('button')

    await btn.trigger('click')
    expect(wrapper.findAll('ul li')).toHaveLength(wrapper.props('stations').length)

    await btn.trigger('click')
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('has two-way bind', async ({ wrapper }) => {
    const btn = wrapper.get('button')

    await btn.trigger('click')

    const listItems = wrapper.findAll('ul li')
    const newIdx = listItems.length - 2
    await listItems[newIdx].trigger('click')

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([wrapper.props('stations')[newIdx]])
  })
})
