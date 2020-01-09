<template>
  <div class="requester">
    <div class="columns requester">
      <div class="column">{{ obj.name }}</div>
      <div class="column">{{ obj.email }}</div>
      <div class="column">{{ obj.phone }}</div>
      <div class="column">{{ obj.nif }}</div>
    </div>
    <div class="columns">
      <div class="column">{{ obj.reqType }}</div>
      <div class="column" v-if="obj.subtype">{{ obj.subtype }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Requester',
  props: { obj: Object }
}
</script>

<style scoped>
.requester {
  margin-bottom: 0;
}
</style>
