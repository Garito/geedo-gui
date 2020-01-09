<template>
  <form :id="name" @submit.prevent="submit" ref="form">
    <div class="notification is-danger" v-if="errors && errors._message">{{ errors._message }}</div>
    <DynamicLayout :name="name">
      <slot></slot>
      
    </DynamicLayout>
  </form>
</template>

<script>
const DynamicLayout = () => import('../dynamiclayout')

export default {
  name: 'Form',
  components: { DynamicLayout },
  props: {
    name: String,
    errors: Object
  },
  data: () => ({ data: {} }),
  methods: {
    submit () {
      let data = Object.fromEntries(Object.entries(this.data).filter(([key, value]) => value !== null))
      // We must validate the data before submit it to avoid server roundtrips
      this.$emit('submit', data)
    }
  }
}
</script>
