import Button from '@/components/Button.vue'
import { mount } from '@vue/test-utils'

test('Default', () => {
  const wrapper = mount(Button)
  const btn = wrapper.find('button[type="button"]')
  expect(btn.exists()).toBe(true)
  expect(btn.text()).toContain('Ok')
})

test('With props and slots', () => {
  const wrapper = mount(Button, { props: { type: 'submit', isActive: true }, slots: { default: 'Submit' } })
  const btn = wrapper.find('button[type="submit"]')
  expect(btn.exists()).toBe(true)
  expect(btn.text()).toContain('Submit')
})
