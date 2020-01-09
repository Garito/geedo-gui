<template>
  <div class="project card">
    <div class="card-content">
      <div class="container">
        <div class="columns">
          <div class="column">
            <router-link :to="$url(obj)" class="is-size-5 project">
              <div>
                <span class="has-text-grey-dark is-size-6">Projecte:</span>&nbsp;
                <span>{{ obj.name }}</span>
              </div>
              <div>
                <span class="has-text-grey-dark is-size-6">Codi:</span>&nbsp;
                <span class="is-size-6">{{ obj.code }}</span>
              </div>
            </router-link>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <progress class="progress project" :value="obj.stats.phases.finished" :max="obj.stats.phases.total" />
          </div>
        </div>

        <div class="columns">
          <div class="column is-narrow" v-if="owner">
            <Avatar :username="owner.name" :size="30" />
          </div>
          <div class="column is-expanded" v-if="stakeholders">
            <Avatar :username="user.name" :size="30" class="is-inline-flex" v-for="user in stakeholders" :key="user._id" />
          </div>
        </div>

        <div class="columns">
          <div class="column is-narrow" v-if="obj.stats.files">
            <span class="icon" :data-badge="obj.stats.files">
              <FontAwesomeIcon :icon="[ 'far', 'file' ]"></FontAwesomeIcon>
            </span>
          </div>
          <div class="column is-narrow" v-if="obj.stats.activity">
            <span class="icon" :data-badge="obj.stats.activity">
              <FontAwesomeIcon :icon="[ 'far', 'bell' ]"></FontAwesomeIcon>
            </span>
          </div>
          <div class="column is-narrow" v-if="obj.stats.messages">
            <span class="icon" :data-badge="obj.stats.messages">
              <FontAwesomeIcon :icon="[ 'far', 'comment-alt' ]"></FontAwesomeIcon>
            </span>
          </div>
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
