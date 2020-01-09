<template>
  <div class="address viewer">
    <template v-if="addrs">
      <LMap class="address viewer" :zoom="11" :bounds="bounds">
        <LTileLayer :url="url" :attribution="attribution" />
        <Cluster ref="cluster">
          <LMarker :lat-lng="addr.center" v-for="[name, addr] in Object.entries(addrs)" :key="name" :ref="name">
            <LPopup :options="{ autoClose: false, closeOnClick: false }"><span v-html="name"></span></LPopup>
          </LMarker>
        </Cluster>
      </LMap>
    </template>
    <div v-else>{{ $t('Loading') }}...</div>
  </div>
</template>

<script>
import { latLng, Icon } from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

import 'leaflet/dist/leaflet.css'

import { EsriProvider } from 'leaflet-geosearch'

delete Icon.Default.prototype._getIconUrl

const Vue2LeafletMarkerCluster = () => import('vue2-leaflet-markercluster')

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'AddressViewer',
  components: { LMap, LTileLayer, LMarker, LPopup, Cluster: Vue2LeafletMarkerCluster },
  props: {
    addresses: Object,
    url: { type: String, default: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png' },
    attribution: { type: String, default: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }
  },
  data: () => ({ addrs: null, bounds: null, init: false }),
  methods: {
    async updateAddrs () {
      const provider = new EsriProvider()
      let result = {}
      for (let [project, addr] of Object.entries(this.addresses)) {
        const searched = await provider.search({ query: addr.address })
        result['<h3 class="is-size-5 is-marginless"><a href="/#' + addr.url + '">' + project + '</a></h3>' + addr.address] = { center: latLng(searched[0].y, searched[0].x), bounds: searched[0].bounds }
      }
      this.addrs = result
      await this.updateBounds()
    },
    async updateBounds () {
      await this.$nextTick()
      let cluster = this.$refs.cluster
      if (cluster) {
        this.bounds = cluster.mapObject.getBounds()
      }
    }
  },
  watch: {
    addresses: {
      immediate: true,
      async handler (val) {
        if (val) {
          await this.updateAddrs()
        }
      }
    }
  }
}
</script>

<style scoped>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

.viewer {
  height: 350px;
}
</style>
