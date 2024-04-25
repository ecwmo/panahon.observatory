import { heatIndex } from '@/lib/weather'

test('null', () => {
  expect(heatIndex(0, 0)).toBe(null)
  expect(heatIndex(24, 70)).toBe(null) // tf < 76
  expect(heatIndex(53, 70)).toBe(null) // tf > 126
  expect(heatIndex(28, -10)).toBe(null) // rh < 0
  expect(heatIndex(28, 110)).toBe(null) // rh > 100
  expect(heatIndex(37.5, 98.0)).toBe(null) // hiF > 183.5
})

test('valid', () => {
  expect(heatIndex(25.0, 60.0)).toBe(25.1) // easy
  expect(heatIndex(38.5, 12)).toBe(35.7) // adjust 1
  expect(heatIndex(29.5, 86.5)).toBe(37.9) // adjust 2
  expect(heatIndex(44.7, 15.0)).toBe(44.0) // adjust 3
})
