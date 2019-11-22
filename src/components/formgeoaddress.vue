<template>
  <FormInput v-model="val" v-bind="{ ...$props, ...$attrs }" v-on="$listeners" @input="input">
    <template #under-control>
      <div class="dropdown is-active" v-if="searched && searched.length">
        <div class="dropdown-menu">
          <div class="dropdown-content">
            <a class="dropdown-item" v-for="search in searched" :key="search.label" @click="select(search)">{{ search.label }}</a>
          </div>
        </div>
      </div>
    </template>
  </FormInput>
</template>

<script>
import { EsriProvider } from 'leaflet-geosearch'

export default {
  name: 'FormGeoAddress',
  props: {
    name: String,
    label: String,
    value: [String, Number],
    sr_only: { type: Boolean, default: false },
    type: { type: String, default: 'text' },
    required: Boolean,
    placeholder: String,
    step: Number,
    icons: Object,
    text: String,
    size: String,
    error: [String, Array]
  },
  data: () => ({ val: null, searched: null }),
  methods: {
    async input (val) {
      if (val.length > 3) {
        const provider = new EsriProvider()
        this.searched = await provider.search({ query: val })
      }

      this.$emit('input', val)
    },
    select (search) {
      this.val = search.label
      this.searched = null
    }
  },
  created () { this.val = this.value }
}
</script>

<style scoped>
.dropdown {
  position: relative;
  margin-top: -14px;
  width: 100%;
}
</style>
