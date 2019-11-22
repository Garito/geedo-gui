<template>
  <div class="columns is-multiline is-mobile">
    <div class="column is-narrow" v-for="stakeholder in stakeholders" :key="stakeholder._id">
      {{ stakeholder.name }}
      <!-- <Avatar :obj="stakeholder">
        <template v-slot="{ obj }">{{ obj.name }}</template>
      </Avatar> -->
    </div>
  </div>
</template>

<script>
const Avatar = () => import('@/components/User/avatar')

export default {
  name: 'Stakeholders',
  components: { Avatar },
  props: { stakeholders: Object }
}
</script>
