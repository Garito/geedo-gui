<template>
  <div class="project section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title project">
            <div class="is-pulled-left">
              <div>
                <span class="has-text-grey-dark is-size-6">{{ $t('Project') }}:&nbsp;</span>
                <span class="pushes-right">{{ project.name }}</span>

                <router-link :to="$url(project) + '/edit'" class="icon is-size-6 is-spaced">
                  <FontAwesomeIcon :icon="[ 'far', 'edit' ]" size="lg"></FontAwesomeIcon>
                </router-link>

                <a class="is-size-6 is-spaced is-inline-flex align-items-center" @click="toggleStatus">
                  <template v-if="project.canceled">
                    <span class="icon">
                      <FontAwesomeIcon icon="toggle-on" size="lg"></FontAwesomeIcon>
                    </span>
                    <span>&nbsp;{{ $t('archived') }}</span>
                  </template>
                  <template v-else>
                    <span class="icon">
                      <FontAwesomeIcon icon="toggle-off" size="lg"></FontAwesomeIcon>
                    </span>
                    <span>&nbsp;{{ $t('active') }}</span>
                  </template>
                </a>

                <a class="icon is-size-6 is-spaced is-inline-flex" @click="removeMe">
                  <FontAwesomeIcon :icon="[ 'far', 'trash-alt' ]" :style="{ color: 'red' }" size="lg"></FontAwesomeIcon>
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

      <Menu :obj="project" :stats="newsAggrs" />

      <div class="columns">
        <div class="column">
          <span class="tag">
            {{ $t('Code') }}: #{{ project.code }}
          </span>
        </div>
      </div>

      <div class="columns" v-if="project.description">
        <div class="column">
          <span class="has-text-black-ter is-size-3">{{ $t('Description') }}:&nbsp;</span>
          <p class="is-size-5">{{ project.description }}</p>
        </div>
      </div>

      <div class="columns" v-if="requester">
        <div class="column is-narrow">
          <span class="has-text-black-ter is-size-4">{{ $t('Requester') }}:&nbsp;</span>
        </div>
        <div class="column">
          <Requester :obj="requester" />
        </div>
      </div>

      <div class="columns" v-if="project.department">
        <div class="column">
          <span class="has-text-black-ter is-size-4">{{ $t('Department') }}:&nbsp;</span>
          <span>{{ project.department }}</span>
        </div>
      </div>

      <Stakeholders :obj="project" :stakeholders="stakeholders" v-if="stakeholders" />

      <div class="columns">
        <div class="column is-narrow">
          <span class="has-text-black-ter is-size-5">{{ $t('Recorded') }}</span>&nbsp;
          <span class="tag">{{ new Intl.DateTimeFormat(locale).format(new Date(project.record)) }}</span>
        </div>
        <div class="column is-narrow">
          <span class="has-text-black-ter is-size-5">{{ $t('Deadline') }}</span>&nbsp;
          <span class="tag">{{ new Intl.DateTimeFormat(locale).format(new Date(project.deadline)) }}</span>
        </div>
      </div>

      <Phases :phases="phases || {}" @added="data => add(data, 'phases')" @finished="phase => finish(phase)" @removed="phase => remove(phase)" ref="phases" />

      <div class="columns">
        <div class="column">
          <span class="tags">
            <span class="tag" v-for="tag in project.tags" :key="project._id + 'tag' + tag">{{ tag }}</span>
          </span>
        </div>
      </div>

      <!-- <Classifiers :obj="project" v-if="project.areas.length || project.themes.length || project.tags.length" /> -->

      <div class="columns">
        <div class="column">
          <h2 class="is-size-3 has-text-black-ter">{{ $t('Resolution') }}:&nbsp;</h2>
          <span class="is-size-5">{{ project.resolution }}</span>
        </div>
      </div>

    </template>
  </div>
</template>

<script>
const Menu = () => import('@/components/Project/menu')
const Stakeholders = () => import('@/components/User/stakeholders')
const Phases = () => import('@/components/Project/phases')
// const Classifiers = () => import('@/components/Project/classifiers')
const Requester = () => import('@/components/User/requester')

export default {
  name: 'Project',
  components: { Menu, Stakeholders, Phases, Requester },
  data: () => {
    let locale = navigator.language || navigator.userLanguage
    return { opId: 'Project/call', locale: locale, menu: null }
  },
  computed: {
    project () { return this.$store.state.context.object },
    loading () { return !this.project || this.project.type !== 'Project' },
    requester () { return this.$store.state.context.requester },
    phases () { return this.$store.state.context.phases },
    stakeholders () { return this.$store.state.context.stakeholders },
    files () { return this.$store.state.context.files },
    newsAggrs () { return this.$store.state.context.newsAggrs }
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
      if (window.confirm('Are you sure?')) {
        this.$store.dispatch('remove', { opId: 'Phase/remove', path: this.$url(this.phases[phase]), children: 'phases' })
        this.$refs['phases'].$data.newPhase = ''
      }
    },
    async toggleStatus () {
      let opts = this.project.canceled ? { opId: 'Project/reopen' } : { opId: 'Project/cancel' }
      let result = await this.$store.dispatch('api', opts)
      if (result.ok) {
        let rjson = await result.json()
        this.$set(this.$store.state.context.object, 'canceled', rjson.result || null)
      }
    },
    async removeMe () {
      if (window.confirm('Are you sure?')) {
        let result = await this.$store.dispatch('api', { opId: 'Project/remove', Project_Path: this.$url(this.project) })
        if (result) {
          this.$router.push('/')
        }
      }
    }
  },
  created () {
    this.$store.dispatch('load', { opId: 'Project/get_phases', name: 'phases' })
    this.$store.dispatch('load', { opId: 'Project/get_stakeholders', name: 'stakeholders' })
  }
}
</script>

<style lang="scss" scoped>
.pushes-right {
  padding-right: 1rem;
}

.is-spaced {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
