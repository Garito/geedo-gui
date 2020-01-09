<template>
  <div class="record section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title record">
            <div class="is-pulled-left">
              <div>
                <span class="has-text-grey-dark is-size-6">{{ $t('Record') }}&nbsp;</span>
                <span class="pushes-right">{{ record.name }}</span>

                <router-link :to="$url(record) + '/edit'" class="icon is-size-6 is-spaced">
                  <FontAwesomeIcon :icon="[ 'far', 'edit' ]"></FontAwesomeIcon>
                </router-link>

                <a class="is-size-6 is-spaced" @click="toggleStatus">
                  <template v-if="record.canceled">
                    <span class="icon">
                      <FontAwesomeIcon icon="toggle-on"></FontAwesomeIcon>
                    </span>
                    <span>{{ $t('canceled') }}</span>
                  </template>
                  <template v-else>
                    <span class="icon">
                      <FontAwesomeIcon icon="toggle-off"></FontAwesomeIcon>
                    </span>
                    <span>{{ $t('active') }}</span>
                  </template>
                </a>

                <a class="icon is-size-6 is-spaced" @click="removeMe">
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

      <Menu :obj="record" :stats="newsAggrs" />

      <div class="columns">
        <div class="column">
          <span class="has-text-grey-dark is-size-6">{{ $t('Code') }}:&nbsp;</span>
          <span>#{{ record.code }}</span>
        </div>
      </div>

      <div class="columns" v-if="record.description">
        <div class="column">
          <span class="has-text-grey-dark is-pulled-left">{{ $t('Description') }}:&nbsp;</span>
          <p>{{ record.description }}</p>
        </div>
      </div>

      <div class="columns is-gapless" v-if="requester">
        <div class="column is-narrow">
          <span class="has-text-grey-dark">{{ $t('Requester') }}:&nbsp;</span>
        </div>
        <div class="column">
          <Requester :obj="requester" />
        </div>
      </div>

      <div class="columns" v-if="record.department">
        <div class="column">
          <span class="has-text-grey-dark is-pulled-left">{{ $t('Department') }}:&nbsp;</span>
          <span>{{ record.department }}</span>
        </div>
      </div>

      <Stakeholders :stakeholders="stakeholders" v-if="stakeholders" />

      <div class="columns">
        <div class="column is-narrow">
          <span class="has-text-grey-dark is-size-6">{{ $t('Recorded') }}</span>&nbsp;
          <span>{{ new Intl.DateTimeFormat(locale).format(new Date(record.record)) }}</span>
        </div>
        <div class="column is-narrow">
          <span class="has-text-grey-dark is-size-6">{{ $t('Deadline') }}</span>&nbsp;
          <span class="tag">{{ new Intl.DateTimeFormat(locale).format(new Date(record.deadline)) }}</span>
        </div>
      </div>

      <Phases :phases="phases || {}" @added="data => add(data, 'phases')" @finished="phase => finish(phase)" @removed="phase => remove(phase)" ref="phases" />

      <div class="columns">
        <div class="column">
          <span class="tags">
            <span class="tag" v-for="tag in record.tags" :key="record._id + 'tag' + tag">{{ tag }}</span>
          </span>
        </div>
      </div>

      <!-- <Classifiers :obj="record" v-if="record.areas.length || record.themes.length || record.tags.length" /> -->

      <div class="columns">
        <div class="column">
          <span class="has-text-grey-dark is-pulled-left">{{ $t('Resolution') }}:&nbsp;</span>
          <span>{{ record.resolution }}</span>
        </div>
      </div>

    </template>
  </div>
</template>

<script>
const Menu = () => import('@/components/Record/menu')
const Stakeholders = () => import('@/components/User/stakeholders')
const Phases = () => import('@/components/Record/phases')
// const Classifiers = () => import('@/components/Project/classifiers')
const Requester = () => import('@/components/User/requester')

export default {
  name: 'Record',
  components: { Menu, Stakeholders, Phases, Requester },
  data: () => {
    let locale = navigator.language || navigator.userLanguage
    return { opId: 'Record/call', locale: locale }
  },
  computed: {
    record () { return this.$store.state.context.object },
    loading () { return !this.record || this.record.type !== 'Record' },
    requester () { return this.$store.state.context.requester },
    phases () { return this.$store.state.context.phases },
    stakeholders () { return this.$store.state.context.stakeholders },
    files () { return this.$store.state.context.files },
    newsAggrs () { return this.$store.state.context.newsAggrs }
  },
  methods: {
    async add (data, children) {
      data = { name: data }
      let result = await this.$store.dispatch('add', { opId: 'Record/create_phase', data: data, children: children })
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
    async toggleStatus () {
      let opts = this.record.canceled ? { opId: 'Record/reopen' } : { opId: 'Record/cancel' }
      let result = await this.$store.dispatch('api', opts)
      if (result.ok) {
        let rjson = await result.json()
        this.$set(this.$store.state.context.object, 'canceled', rjson.result || null)
      }
    },
    async removeMe () {
      let result = await this.$store.dispatch('api', { opId: 'Record/remove', Record_Path: this.$url(this.record) })
      if (result) {
        this.$router.push('/')
      }
    }
  },
  created () {
    this.$store.dispatch('load', { opId: 'Record/get_phases', name: 'phases' })
    this.$store.dispatch('load', { opId: 'Record/get_stakeholders', name: 'stakeholders' })
  }
}
</script>

<style scoped>
.pushes-right {
  padding-right: 1rem;
}

.is-spaced {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
