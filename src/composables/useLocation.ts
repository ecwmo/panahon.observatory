import { IP } from '@/schemas/location'

export default () => {
  const fetchLocation = async () => {
    try {
      const {
        coords: { latitude, longitude },
      } = await new Promise((resolve: (pos: GeolocationPosition) => void, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      return { latitude, longitude }
    } catch {
      try {
        const { latitude, longitude } = await axios.get('https://ipapi.co/json').then(({ data }) => IP.parse(data))
        return { latitude, longitude }
      } catch {
        return undefined
      }
    }
  }

  return useQuery('userLocation', fetchLocation)
}
