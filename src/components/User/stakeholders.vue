<template>
  <div class="columns">
    <div class="column user-list">
      <div class="user-card" v-for="role in Object.keys(stakeholders)" :key="$store.state.roles[role]._id">
          <p class="heading is-size-6">{{ $store.state.roles[role].name }}</p>
          <div class="has-text-centered">
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

<style lang="scss" scoped>
.avatar {
  margin-right: .5em;
}
  .user-list {
    display: flex;
    flex-wrap: wrap;
  }
  .user-card {
    margin: 20px;
    &:first-of-type {
      margin-left: 0;
     }
  }
</style>
