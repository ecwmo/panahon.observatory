<template>
  <div class="relative">
    <!-- Map -->
    <div ref="mapEl" class="shadow" style="width: 400px; height: 470px"></div>
  </div>
</template>

<script lang="ts">
  import { ref, toRefs, onMounted, defineComponent } from 'vue'
  import mapboxgl, { Map } from 'mapbox-gl'
  import axios from 'axios'

  export default defineComponent({
    props: { data: { type: Object, required: true }, activeVariable: { type: String, required: true } },
    setup(props) {
      const mapEl = ref()
      const map = ref()

      const { data, activeVariable } = toRefs(props)

      onMounted(async () => {
        const tok = await axios.post('api/env.php', { token: 'mapbox' }).then(({ data: tok }) => tok)
        mapboxgl.accessToken = tok

        map.value = new Map({
          container: mapEl.value,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [121.04, 14.56],
          zoom: 9.5,
          attributionControl: false,
        })

        map.value.once('load', () => {
          map.value.addSource('station', {
            type: 'geojson',
            data: data.value,
          })
          map.value.addLayer({
            id: 'station-pts',
            type: 'circle',
            source: 'station',
            paint: {
              'circle-radius': 5,
              'circle-stroke-color': '#000000',
              'circle-stroke-width': 1,
              'circle-color': ['to-color', ['get', activeVariable.value, ['get', 'colors']]],
            },
          })
        })
      })

      return { mapEl }
    },
  })
</script>
