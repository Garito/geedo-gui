<template>
  <div class="project section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title project">
            <div class="is-pulled-left">
              <div>
                <span class="has-text-grey-dark is-size-6">Projecte:</span>&nbsp;
                <span>{{ project.name }}</span>
                <a class="icon is-size-6" @click="removeMe">
                  <FontAwesomeIcon :icon="[ 'far', 'trash-alt' ]"></FontAwesomeIcon>
                </a>
              </div>
            </div>
            <span class="tag is-size-6 is-pulled-right">
              <span class="icon"><FontAwesomeIcon :icon="[ 'far', 'file' ]"></FontAwesomeIcon></span>
              <span>{{ files }}</span>
            </span>
          </h1>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <span class="has-text-grey-dark is-size-6">Codi:</span>&nbsp;
          <span>#{{ project.code }}</span>
        </div>
      </div>

      <span class="has-text-grey-dark">Participants:</span>&nbsp;
      <Stakeholders class="is-inline-flex" :stakeholders="stakeholders" v-if="stakeholders" />

      <div class="columns" v-if="project.description">
        <div class="column">
          <span class="has-text-grey-dark is-pulled-left">Descripció:&nbsp;</span>
          <p>{{ project.description }}</p>
        </div>
      </div>

      <Phases :phases="phases || {}" @added="data => add(data, 'phases')" @finished="phase => finish(phase)" @removed="phase => remove(phase)" ref="phases" />

      <div class="level is-mobile">
        <div class="level-left">
          <span class="tag is-medium is-white">
            <span class="level-item">{{ new Intl.DateTimeFormat(locale).format(new Date(project.record)) }}</span>
          </span>
        </div>
        <div class="level-right">
          <span class="level-item">
            <span class="tag is-medium">{{ new Intl.DateTimeFormat(locale).format(new Date(project.deadline)) }}</span>
          </span>
        </div>
      </div>
      <div class="level" v-if="project.areas.length || project.themes.length || project.tags.length">
        <div class="level-item" v-if="project.areas.length">
          <span class="tags">
            <span class="tag" v-for="area in project.areas" :key="project._id + 'area' + area">{{ area }}</span>
          </span>
        </div>
        <div class="level-item" v-if="project.themes.length">
          <span class="tags">
            <span class="tag" v-for="theme in project.themes" :key="project._id + 'theme' + theme">{{ theme }}</span>
          </span>
        </div>
        <div class="level-item" v-if="project.tags.length">
          <span class="tags">
            <span class="tag" v-for="tag in project.tags" :key="project._id + 'tag' + tag">{{ tag }}</span>
          </span>
        </div>
      </div>
      <div class="columns">
        <div class="column has-text-centered">
          <AddressViewer :addresses="[project.address]" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const Stakeholders = () => import('@/components/User/stakeholders')
const Phases = () => import('@/components/Project/phases')
const AddressViewer = () => import('@/components/addressviewer')

export default {
  name: 'Project',
  components: { Stakeholders, Phases, AddressViewer },
  data: () => {
    let locale = navigator.language || navigator.userLanguage
    return { opId: 'Project/call', locale: locale }
  },
  computed: {
    project () { return this.$store.state.context.object },
    loading () { return !this.project || this.project.type !== 'Project' },
    phases () { return this.$store.state.context.phases },
    stakeholders () { return this.$store.state.context.stakeholders },
    files () { return this.$store.state.context.files }
  },
  methods: {
    async add (data, children) {
      data = { name: data }
      let result = await this.$store.dispatch('add', { opId: 'Project/create_phase', data: data, children: children })
      if (result) {
        this.$refs[children].close()
      }
    },
    async finish (phase) {
      let result = await this.$store.dispatch('api', { opId: 'Phase/finish', path: this.$url(this.phases[phase]) })
      if (result.ok) {
        let rjson = await result.json()
        this.$set(this.phases[phase], 'finished', rjson.result.finished)
        this.$set(this.phases[phase], 'finisher', rjson.result.finisher)
      }
    },
    remove (phase) {
      this.$store.dispatch('remove', { opId: 'Phase/remove', path: this.$url(this.phases[phase]), children: 'phases' })
      this.$refs['phases'].$data.newPhase = ''
    },
    async removeMe () {
      let result = await this.$store.dispatch('api', { opId: 'Project/remove', Project_Path: this.$url(this.project) })
      if (result) {
        this.$router.push('/')
      }
    }
  },
  created () {
    this.$store.dispatch('load', { opId: 'Project/get_phases', name: 'phases' })
    this.$store.dispatch('load', { opId: 'Project/get_stakeholders', name: 'stakeholders' })
    // let stats = this.$store.dispatch('api', { opId: 'Project/get_stats', Project_Path: this.$url(this.project) })
    // console.log(stats)
  }
}
</script>
