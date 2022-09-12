import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin } from 'vue-query'
import axios from 'axios'
import { format } from 'date-fns'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('fetch weather data', () => {
  beforeEach((ctx) => {
    const TestComponent = defineComponent({
      setup() {
        return {
          ...useWeather(),
        }
      },
    })
    ctx.mount = () => mount(TestComponent, { global: { plugins: [VueQueryPlugin] } })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('loads data successfully', async ({ mount }) => {
    const stations = [
      { id: 1, name: 'stations1' },
      { id: 2, name: 'stations2' },
      { id: 3, name: 'stations3' },
      { id: 4, name: 'stations4' },
      { id: 5, name: 'stations5' },
      { id: 6, name: 'stations6' },
    ]

    axios.get.mockResolvedValueOnce({ data: stations })

    const date = new Date(2000, 1, 1, 13)
    vi.setSystemTime(date)

    const wrapper = mount()
    expect(axios.get).toHaveBeenCalledTimes(2)
    expect(axios.get).toHaveBeenCalledWith(`/api/stations.php?ts=${format(date, 'yyyyMMddHH')}`)

    expect(wrapper.vm.isSuccess).toBe(false)
    expect(wrapper.vm.isFetching).toBe(true)
    expect(wrapper.vm.isError).toBe(false)
    expect(wrapper.vm.data).toBeUndefined()

    await flushPromises()

    expect(wrapper.vm.isSuccess).toBe(true)
    expect(wrapper.vm.isFetching).toBe(false)
    expect(wrapper.vm.isError).toBe(false)
    expect(wrapper.vm.data).toEqual(stations)
  })
})
