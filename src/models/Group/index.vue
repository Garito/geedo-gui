<template>
  <div class="group section">
    <div class="columns">
      <div class="column">
        <AddressViewer :addresses="mixedAddresses" v-if="mixedAddresses" />
        <div v-else>{{ $t('Loading') }}...</div>
      </div>
    </div>

    <div class="columns has-text-centered">
      <div class="column is-size-5">
        <a @click="myStuff = !myStuff">
          <template v-if="myStuff">
            <span class="icon">
              <FontAwesomeIcon icon="toggle-on"></FontAwesomeIcon>
            </span>
            <span>{{ $t('My stuff') }}</span>
          </template>
          <template v-else>
            <span class="icon">
              <FontAwesomeIcon icon="toggle-off"></FontAwesomeIcon>
            </span>
            <span>{{ $t('Everything') }}</span>
          </template>
        </a>
      </div>
    </div>

    <div class="columns">
      <div class="column">
          <div class="projects has-hscroll">
            <ProjectCard :obj="proj" v-for="proj in projects" :key="proj._id" />
          </div>
      </div>
    </div>

    <div class="columns">
      <div class="column">
          <div class="records has-hscroll">
            <RecordCard :obj="record" v-for="record in records" :key="record._id" />
          </div>
      </div>
    </div>

  </div>
</template>

<script>
const AddressViewer = () => import('@/components/addressviewer')
const ProjectCard = () => import('@/components/Project/card')
const RecordCard = () => import('@/components/Record/card')

export default {
  name: 'Group',
  components: { AddressViewer, ProjectCard, RecordCard },
  data: () => ({ opId: 'Root/call', myStuff: false }),
  computed: {
    actor () { return this.$store.getters.actor },
    projects () {
      if (this.myStuff) {
        let result = {}
        for (var [key, value] of Object.entries(this.$store.state.context.projects)) {
          let url = this.$url(value)
          if (this.actor.roles.includes('owner@' + url)) {
            result[key] = value
          }
        }
        return result
      } else {
        return this.$store.state.context.projects
      }
    },
    records () {
      if (this.myStuff) {
        let result = {}
        for (var [key, value] of Object.entries(this.$store.state.context.records)) {
          let url = this.$url(value)
          if (this.actor.roles.includes('owner@' + url)) {
            result[key] = value
          }
        }
        return result
      } else {
        return this.$store.state.context.records
      }
    },
    mixedAddresses () {
      let addresses = {}
      if (this.projects) {
        for (let child of Object.values(this.projects)) {
          addresses[child.name] = { address: child.address, url: this.$url(child) }
        }
      }
      if (this.records) {
        for (let child of Object.values(this.records)) {
          addresses[child.name] = { address: child.address, url: this.$url(child) }
        }
      }

      return addresses
    }
  },
  watch: {
    myStuff (val) { this.$store.commit('setMyStuff', val) }
  },
  mounted () {
    this.$store.dispatch('load', { opId: 'Root/get_projects', name: 'projects' })
    this.$store.dispatch('load', { opId: 'Root/get_records', name: 'records' })
  }
}
</script>

<style lang="sass" scoped>
.has-hscroll
  display: flex
  flex-wrap: nowrap
  overflow-x: auto

  & .card
    flex: 0 0 auto
    margin: 10px
</style>
