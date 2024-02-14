import RowGroupBtns from '@/components/RowGroupBtns.vue'
import { mount } from '@vue/test-utils'

const items = [
  { val: 0, text: 'test1' },
  { val: 1, text: 'test2' },
  { val: 2, text: 'test3' },
]

test('default', () => {
  const wrapper = mount(RowGroupBtns)
  expect(wrapper.findAll('button')).toHaveLength(0)
})

test('with props', () => {
  const activeBtnIdx = 1
  const wrapper = mount(RowGroupBtns, { props: { items, modelValue: items[activeBtnIdx].val } })
  const btnEls = wrapper.findAll('button')
  expect(btnEls).toHaveLength(items.length)
})

test('click', async () => {
  const activeBtnIdx = 1
  const wrapper = mount(RowGroupBtns, {
    props: {
      items,
      modelValue: items[activeBtnIdx].val,
    },
  })
  const btnEls = wrapper.findAll('button')

  const clickIdx = 2
  await btnEls[clickIdx].trigger('click')
  expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([items[clickIdx].val])
})
