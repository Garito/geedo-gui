<template>
  <div class="section">
    <AddressViewer :addresses="addrs" />
  </div>
</template>

<script>
const AddressViewer = () => import('@/components/addressviewer')

export default {
  name: 'Near',
  components: { AddressViewer },
  props: { obj: Object },
  computed: {
    addrs () {
      let addrs = {}
      addrs[this.obj.address] = this.obj
      return addrs
    }
  }
}
</script>
