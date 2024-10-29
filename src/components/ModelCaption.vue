<template>
  <div class="model-caption">
    <span v-if="id === 'hix'">
      The figure above shows the spatial map of forecast heat stress index (HI). The HI calculation is based on
      <a href="https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml" target="_blank" rel="noopener noreferrer"
        >Rothfusz (1990)</a
      >.
      <img :src="route('resources/model/static/heat_index_static_table.png')" class="pt-5" />
    </span>
    <span v-else-if="id === 'wpd'">
      The Wind Power Potential plot uses 100-m wind speed of the model output to approximate the wind speed at 80-m, the
      typical height of wind turbines.
    </span>
    <span v-else-if="id === 'ppv'">
      The equations used for calculating Photovoltaic Power Potential were based on
      <a
        href="https://pubs.rsc.org/lv/content/articlelanding/2011/ee/c1ee01495a/unauth#!divAbstract"
        target="_blank"
        rel="noopener noreferrer"
        >Crook et al. (2011)</a
      >.
    </span>
    <span v-else-if="id === 'rainx'">
    <!--   The figure above highlights areas with forecast 24-hour rainfall possibly exceeding the typical monthly total -->
    <!--   rainfall based on data from TRMM Multi-Satellite Precipitation Analysis TMPA (3B42RT; -->
    <!--   <a href="https://doi.org/10.5067/TRMM/TMPA/DAY-E/7" target="_blank" rel="noopener noreferrer"> -->
    <!--     10.5067/TRMM/TMPA/DAY-E/7 </a -->
    <!--   >). However, caution is advised in interpreting the maps. Since TRMM is observed to underestimate rainfall in the -->
    <!--   Philippines (<a -->
    <!--     href="https://journals.ametsoc.org/view/journals/hydr/21/7/jhmD190276.xml" -->
    <!--     target="_blank" -->
    <!--     rel="noopener noreferrer" -->
    <!--   > -->
    <!--     Peralta et al., 2020 </a -->
    <!--   >) a lower baseline for monthly rainfall derived from TRMM may result in more areas forecast to receive extreme -->
    <!--   rainfall. -->
    <!-- </span> -->
    <!-- <span v-else-if="id === 'ari'"> -->
      The figure above shows daily rainfall amounts exceeding a 5-year average recurrence interval (ARI) threshold.
      <br />
      <br />
      ARI is the probability of a particular rainfall event occurring at that location within a given year (e.g., a
      5-year ARI indicates a 20% chance of occurrence in any given year). Interpretation of these maps should be
      approached with caution, as the historical ARIs were derived from the TRMM Multi-Satellite Precipitation Analysis
      (<a href="https://doi.org/10.5067/TRMM/TMPA/DAY-E/7" target="_blank" rel="noopener noreferrer">TMPA 3B42 V7</a>),
      which is known to underestimate rainfall in the Philippines (<a
        href="https://journals.ametsoc.org/view/journals/hydr/21/7/jhmD190276.xml"
        target="_blank"
        rel="noopener noreferrer"
        >Peralta et al., 2020</a
      >) and has a limited record length. Consequently, using a lower baseline for historical ARIs from TRMM data may
      lead to more areas being forecasted to experience rarer rainfall events.
    </span>
    <span v-else></span>
  </div>
</template>

<script setup lang="ts">
  import { route } from '@/stores/routes'
  defineProps<{
    id: string
  }>()
</script>

<style scoped>
  .model-caption a {
    @apply underline text-blue-600;
  }

  .model-caption a:hover {
    @apply underline text-blue-400;
  }
</style>
