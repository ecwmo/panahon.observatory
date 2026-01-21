<template>
    <div class="legend">
        <ul>
            <li v-for="(entry, idx) in style.ramp" :key="idx">
                <span class="swatch" :style="{ backgroundColor: entry.color }"></span>
                <span class="label">{{ entry.label }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: "Legend",
  props: {
    style: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
    .legend {
        font-family: sans-serif;
        background: #f8f9fa;
        border: 1px solid #ccc;
        padding: 0.75rem;
        border-radius: 4px;
    }

    .legend h4 {
        margin: 0 0 0.5rem;
        font-size: 0.95rem;
        color: #333;
    }

    .legend ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .legend li {
        display: flex;
        align-items: center;
        margin-bottom: 0.4rem;
    }

    .legend li:last-child {
        margin-bottom: 0;
    }

    .legend .swatch {
        width: 20px;
        height: 20px;
        border: 1px solid #999;
        margin-right: 0.5rem;
    }

    .legend .label {
        font-size: 0.85rem;
        color: #222;
    }
</style>