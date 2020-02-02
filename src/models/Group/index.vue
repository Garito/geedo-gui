<template>
  <div class="group section">

    <div class="columns">
      <div class="column">
        <AddressViewer :addresses="mixedAddresses" v-if="mixedAddresses" />
        <div v-else>{{ $t('Loading') }}...</div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-narrow">
        <div class="buttons has-addons">
          <button class="button" :class="{'is-primary is-selected': myStuff === false }" @click="myStuff = false">
            {{ $t('Everything') }}
          </button>
          <button class="button" :class="{'is-primary is-selected': myStuff === true }" @click="myStuff = true">
            {{ $t('My stuff') }}
          </button>
        </div>
      </div>

      <div class="column is-narrow">
        <div class="buttons has-addons">
          <button class="button" :class="{'is-primary is-selected': archived === 'all' }" @click="archived = 'all'">
            {{ $t('Everything') }}
          </button>
          <button class="button" :class="{'is-primary is-selected': archived === 'active' }" @click="archived = 'active'">
            {{ $t('Active') }}
          </button>
          <button class="button" :class="{'is-primary is-selected': archived === 'archived' }" @click="archived = 'archived'">
            {{ $t('Archived') }}
          </button>
        </div>
      </div>

      <div class="column is-narrow">
<!--        <Search mini @searched="searched" />-->
      </div>
    </div>

    <div class="columns respect-height">
      <div class="column">
        <h2 class="subtitle project">{{ $t('Projects') }}</h2>
        <div class="projects has-hscroll" v-if="projects && Object.keys(projects).length">
          <ProjectCard :obj="proj" v-for="proj in projects" :key="proj._id" />
        </div>
        <span v-else>{{ $t('Not found') }}</span>
      </div>
    </div>

    <div class="columns respect-height">
      <div class="column">
        <h2 class="subtitle record">{{ $t('Records') }}</h2>
        <div class="records has-hscroll" v-if="records && Object.keys(records).length">
          <RecordCard :obj="record" v-for="record in records" :key="record._id" />
        </div>
        <span v-else>{{ $t('Not found') }}</span>
      </div>
    </div>

  </div>
</template>

<script>
const AddressViewer = () => import('@/components/addressviewer')
const ProjectCard = () => import('@/components/Project/card')
const RecordCard = () => import('@/components/Record/card')
const Search = () => import('@/components/search')

export default {
  name: 'Group',
  components: { AddressViewer, ProjectCard, RecordCard, Search },
  data: () => ({ opId: 'Root/call', myStuff: false, archived: 'all', searchedIds: [] }),
  computed: {
    actor () { return this.$store.getters.actor },
    projects () {
      if (this.myStuff || this.archived !== 'all') {
        let result = {}
        let roles = this.actor.roles
        for (let [key, value] of Object.entries(this.$store.state.context.projects)) {
          let url = this.$url(value)
          if (this.searchedIds.length && !this.searchedIds.includes(value.slug)) {
            continue
          }
          if ((this.myStuff && !roles.includes('owner@' + url))) {
            continue
          }
          if ((this.archived === 'active' && value.canceled) || (this.archived === 'archived' && !value.canceled)) {
            continue
          }
          result[key] = value
        }
        return result
      } else {
        if (this.searchedIds.length) {
          let result = {}
          for (let [key, value] of Object.entries(this.$store.state.context.projects)) {
            if (this.searchedIds.includes(value.slug)) {
              result[key] = value
            }
          }
          return result
        } else {
          return this.$store.state.context.projects
        }
      }
    },
    records () {
      if (this.myStuff || this.archived !== 'all') {
        let result = {}
        let roles = this.actor.roles
        for (let [key, value] of Object.entries(this.$store.state.context.records)) {
          let url = this.$url(value)
          if (this.myStuff && !roles.includes('owner@' + url)) {
            continue
          }
          if ((this.archived === 'active' && value.canceled) || (this.archived === 'archived' && !value.canceled)) {
            continue
          }
          result[key] = value
        }
        return result
      } else {
        if (this.searchedIds.length) {
          let result = {}
          for (let [key, value] of Object.entries(this.$store.state.context.records)) {
            if (this.searchedIds.includes(value.slug)) {
              result[key] = value
            }
          }
          return result
        } else {
          return this.$store.state.context.records
        }
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
  methods: {
    searched (results) {
      let searchedIds = []
      for (let result of results) {
        searchedIds.push(result.slug)
      }
      this.searchedIds = searchedIds
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

.respect-height
  min-height: 330px
</style>
