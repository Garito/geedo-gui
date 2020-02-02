<template>
  <div class="card project">
    <progress class="progress progress--project-card project" :value="obj.stats.phases.finished" :max="obj.stats.phases.total"></progress>
    <div class="card-content">
        <router-link :to="$url(obj)">
          <div class="level">
            <p class="is-size-4 level-left">{{ obj.name }}</p>
            <span class="tag level-right has-margin-left-10">#{{ obj.code }}</span>
          </div>
        </router-link>

        <div class="columns">
          <div class="column is-expanded has-margin-top-20">
            <Avatar :username="owner.name" class="has-margin-right-5 is-inline-flex" :size="30" :title="owner.name" />
            <Avatar :username="user.name" :size="30" class="has-margin-right-5 is-inline-flex" v-for="user in stakeholders" :title="user.name" :key="user._id" />
          </div>
        </div>

        <div class="columns">
          <div class="column is-narrow" v-if="obj.stats.files">
            <span class="icon" :data-badge="obj.stats.files">
              <FontAwesomeIcon :icon="[ 'far', 'file' ]"></FontAwesomeIcon>
            </span>
          </div>
<!--          <div class="column is-narrow" v-if="obj.stats.activity">-->
<!--            <span class="icon" :data-badge="obj.stats.activity">-->
<!--              <FontAwesomeIcon :icon="[ 'far', 'bell' ]"></FontAwesomeIcon>-->
<!--            </span>-->
<!--          </div>-->
          <div class="column is-narrow" v-if="obj.stats.messages">
            <span class="icon" :data-badge="obj.stats.messages">
              <FontAwesomeIcon :icon="[ 'far', 'comment-alt' ]"></FontAwesomeIcon>
            </span>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
const Avatar = () => import('vue-avatar')

export default {
  name: 'ProjectCard',
  components: { Avatar },
  props: { obj: Object },
  computed: {
    owner () { return Object.values(this.$store.state.users).find(u => u.roles.includes('owner@' + this.$url(this.obj))) },
    stakeholders () {
      let url = this.$url(this.obj)
      let stakeholders = []
      for (var user of Object.values(this.$store.state.users)) {
        for (var role of user.roles) {
          let path = role.split('@').pop()
          if (!role.startsWith('owner@') && url === path) {
            stakeholders.push(user)
          }
        }
      }
      return stakeholders
    }
  }
}
</script>

<style scoped>
.has-badge-project::after {
  font-family: "Font Awesome 5 Free";
  /* content: attr(data-badge) "\uf15b"; */
  content: "\uf15b";
}
</style>
