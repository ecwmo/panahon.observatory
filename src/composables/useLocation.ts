export default () => {
  const fetchLocation = async () => {
    try {
      const { coords } = await new Promise((resolve: (pos: GeolocationPosition) => void, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      return coords
    } catch {
      try {
        const { data } = await axios.get('https://ipapi.co/json')
        return data
      } catch (err) {
        console.log(err)
      }
      console.log('blocked')
      return { lat: -1, lng: -1 }
    }
  }

  return useQuery('userLocation', fetchLocation)
}
