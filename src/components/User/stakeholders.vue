<template>
  <div class="columns">
    <div class="column" v-for="role in Object.keys(stakeholders)" :key="$store.state.roles[role]._id">
      <div>
        <p class="heading">{{ $store.state.roles[role].name }}</p>
        <div>
          <span class="avatar" v-for="stakeholder in stakeholders[role]" :key="stakeholder._id">
            <Avatar class="is-inline-flex" :username="stakeholder.name" :size="30"  />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Avatar = () => import('vue-avatar')

export default {
  name: 'Stakeholders',
  components: { Avatar },
  props: { obj: Object, stakeholders: Object }
}
</script>

<style scoped>
.avatar {
  margin-right: .5em;
}
</style>
