<template>
  <div class="record section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title record">
            <div class="is-pulled-left">
              <div>
                <span class="has-text-grey-dark is-size-6">Registre:</span>&nbsp;
                <span>{{ record.name }}</span>
                <a class="icon is-size-6" @click="removeMe">
                  <FontAwesomeIcon :icon="[ 'far', 'trash-alt' ]"></FontAwesomeIcon>
                </a>
              </div>
            </div>
            <span class="tag is-size-6 is-pulled-right">
              <span class="icon"><FontAwesomeIcon :icon="[ 'far', 'file' ]"></FontAwesomeIcon></span>
              <span>{{ files }}</span>
            </span>
            <!-- {{ record.name }} <small>#{{ record.code }}</small>
            <a class="icon is-size-6" @click="removeMe">
              <FontAwesomeIcon :icon="[ 'far', 'trash-alt' ]"></FontAwesomeIcon>
            </a>
            <span class="tag is-size-6 is-pulled-right">
              <span class="icon"><FontAwesomeIcon :icon="[ 'far', 'file' ]"></FontAwesomeIcon></span>
              <span>{{ files }}</span>
            </span> -->
          </h1>
        </div>
      </div>

      <div class="columns">
        <div class="column">
          <span class="has-text-grey-dark is-size-6">Codi:</span>&nbsp;
          <span>#{{ record.code }}</span>
        </div>
      </div>

      <span class="has-text-grey-dark">Participants:</span>&nbsp;
      <Stakeholders class="is-inline-flex" :stakeholders="stakeholders" v-if="stakeholders" />

      <div class="columns" v-if="record.description">
        <div class="column">
          <span class="has-text-grey-dark is-pulled-left">Descripció:&nbsp;</span>
          <p>{{ record.description }}</p>
        </div>
      </div>
      <!-- <div class="columns" v-if="record.description">
        <div class="column">
          <p>{{ record.description }}</p>
        </div>
      </div> -->

      <Phases :phases="phases || {}" @added="data => add(data, 'phases')" @finished="phase => finish(phase)" @removed="phase => remove(phase)" ref="phases" />

      <div class="level is-mobile">
        <div class="level-left">
          <span class="tag is-medium is-white">
            <span class="level-item">{{ new Intl.DateTimeFormat(locale).format(new Date(record.record)) }}</span>
          </span>
        </div>
        <div class="level-right">
          <span class="level-item">
            <span class="tag is-medium">{{ new Intl.DateTimeFormat(locale).format(new Date(record.deadline)) }}</span>
          </span>
        </div>
      </div>
      <div class="level" v-if="record.areas.length || record.themes.length || record.tags.length">
        <div class="level-item" v-if="record.areas.length">
          <span class="tags">
            <span class="tag" v-for="area in record.areas" :key="record._id + 'area' + area">{{ area }}</span>
          </span>
        </div>
        <div class="level-item" v-if="record.themes.length">
          <span class="tags">
            <span class="tag" v-for="theme in record.themes" :key="record._id + 'theme' + theme">{{ theme }}</span>
          </span>
        </div>
        <div class="level-item" v-if="record.tags.length">
          <span class="tags">
            <span class="tag" v-for="tag in record.tags" :key="record._id + 'tag' + tag">{{ tag }}</span>
          </span>
        </div>
      </div>
      <div class="columns">
        <div class="column has-text-centered">
          <AddressViewer :addresses="[record.address]" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const Stakeholders = () => import('@/components/User/stakeholders')
const Phases = () => import('@/components/Record/phases')
const AddressViewer = () => import('@/components/addressviewer')

export default {
  name: 'Record',
  components: { Stakeholders, Phases, AddressViewer },
  data: () => {
    let locale = navigator.language || navigator.userLanguage
    return { opId: 'Record/call', locale: locale }
  },
  computed: {
    record () { return this.$store.state.context.object },
    loading () { return !this.record || this.record.type !== 'Record' },
    phases () { return this.$store.state.context.phases },
    stakeholders () { return this.$store.state.context.stakeholders },
    files () { return this.$store.state.context.files }
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
