import Button from '@/components/Button.vue'
import RowGroupBtns from '@/components/RowGroupBtns.vue'
import { mount } from '@vue/test-utils'

test('Default', () => {
  const wrapper = mount(RowGroupBtns)
  expect(wrapper.props('buttons')).toBeUndefined()
  expect(wrapper.props('activeButton')).toBeUndefined()
})

test('With props', () => {
  const items = [
    { val: 0, text: 'test1' },
    { val: 1, text: 'test2' },
    { val: 2, text: 'test3' },
  ]
  const activeBtnIdx = 1
  const wrapper = mount(RowGroupBtns, { props: { items, activeItem: items[activeBtnIdx] } })
  const btnComponents = wrapper.findAllComponents(Button)
  expect(btnComponents).toHaveLength(items.length)
})

test('Click', async () => {
  const items = [
    { val: 0, text: 'test1' },
    { val: 1, text: 'test2' },
    { val: 2, text: 'test3' },
  ]
  const activeBtnIdx = 1
  const wrapper = mount(RowGroupBtns, {
    props: {
      items,
      activeItem: items[activeBtnIdx],
    },
  })
  const btnComponents = wrapper.findAllComponents(Button)

  const clickIdx = 2
  await btnComponents[clickIdx].trigger('click')
  expect(wrapper.emitted()).toHaveProperty('update:activeItem')
  expect(wrapper.emitted('update:activeItem')[0]).toEqual([items[clickIdx]])
})
