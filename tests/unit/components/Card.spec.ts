import Card from '@/components/Card.vue'
import Popup from '@/components/Popup.vue'
import { mount } from '@vue/test-utils'

test('Default', () => {
  const wrapper = mount(Card, { attachTo: document.body })
  expect(wrapper.find('[data-test="card"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-icon"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-icon"] > svg').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info-title"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info-detail1"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info-label1"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info-value1"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info-detail2"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info-label2"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info-value2"]').exists()).toBe(false)
})

test('With data props 1', () => {
  const data = {
    title: 'Test1',
    value1: '0',
    value2: '1',
    iconName: 'fa6s-wind',
  }
  const wrapper = mount(Card, { props: { data, isActive: true }, attachTo: document.body })
  expect(wrapper.find('[data-test="card"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-icon"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-icon"] > svg').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info-title"]').text()).toContain(data['title'])
  expect(wrapper.find('[data-test="card-info-detail1"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info-label1"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info-value1"]').text()).toContain(data['value1'])
  expect(wrapper.find('[data-test="card-info-detail2"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info-label2"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info-value2"]').text()).toContain(data['value2'])

  expect(wrapper.get('[data-test="card-info-popup"]').isVisible()).toBe(true)
})

test('With data props 2', () => {
  const data = {
    title: 'Test1',
    label1: 'test label',
    value1: '0',
    value2: '1',
    iconName: 'fa6s-wind',
  }
  const wrapper = mount(Card, { props: { data } })
  expect(wrapper.find('[data-test="card"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-icon"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-icon"] > svg').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info-title"]').text()).toContain(data['title'])
  expect(wrapper.find('[data-test="card-info-detail1"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info-label1"]').text()).toContain(data['label1'])
  expect(wrapper.find('[data-test="card-info-value1"]').text()).toContain(data['value1'])
  expect(wrapper.find('[data-test="card-info-detail2"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info-label2"]').exists()).toBe(false)
  expect(wrapper.find('[data-test="card-info-value2"]').text()).toContain(data['value2'])
})

test('With data props 3', () => {
  const data = {
    title: 'Test1',
    label1: 'test label',
    value1: '0',
    label2: 'test label2',
    value2: '1',
    iconName: 'fa6s-wind',
  }
  const wrapper = mount(Card, { props: { data } })
  expect(wrapper.find('[data-test="card"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-icon"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-icon"] > svg').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info-title"]').text()).toContain(data['title'])
  expect(wrapper.find('[data-test="card-info-detail1"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info-label1"]').text()).toContain(data['label1'])
  expect(wrapper.find('[data-test="card-info-value1"]').text()).toContain(data['value1'])
  expect(wrapper.find('[data-test="card-info-detail2"]').exists()).toBe(true)
  expect(wrapper.find('[data-test="card-info-label2"]').text()).toContain(data['label2'])
  expect(wrapper.find('[data-test="card-info-value2"]').text()).toContain(data['value2'])
})

test('Mouse events', async () => {
  const data = {
    title: 'Test1',
    label1: 'test label',
    value1: '0',
    label2: 'test label2',
    value2: '1',
    iconName: 'fa6s-wind',
  }
  const wrapper = mount(Card, { props: { data, isActive: true }, attachTo: document.body })
  const popupParent = wrapper.find('[data-test="card-info-popup"]')
  const popupChild = wrapper.findComponent(Popup)
  expect(popupChild.exists()).toBe(true)
  expect(popupChild.props('show')).toBe(false)
  await popupParent.trigger('mouseover')
  expect(popupChild.props('show')).toBe(true)
  await popupParent.trigger('mouseout')
  expect(popupChild.props('show')).toBe(false)
})
