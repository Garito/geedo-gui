<template>
  <div class="add section">
    <div class="column">
      <div class="box" :class="adding.toLowerCase()">
        <div class="columns is-vcentered">
          <div class="column is-size-4 is-narrow">{{ $t("Add a new")}}</div>
          <div class="column">
            <span class="field has-addons">
              <p class="control">
                <button class="button" :class="{ 'project': adding === 'Project' }" @click="adding = 'Project'">{{ $t('Project') }}</button>
              </p>
              <p class="control">
                <button class="button" :class="{ 'record': adding === 'Record' }" @click="adding = 'Record'">{{ $t('Record') }}</button>
              </p>
            </span>
          </div>
        </div>
        <Form name="Projects" :schema="$store.getters.schema('Root/create_project')" :errors="$store.state.errors" @submit="data => add(data)" @input="$store.commit('setErrors', null)">
          <div id="Projects_layout" class="columns">
            <div class="column">
              <div class="columns">
                <div class="column">
                  <div id="Projects_name"></div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="Projects_code"></div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="Projects_description"></div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="Projects_requester"></div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="Projects_record"></div>
                </div>
                <div class="column">
                  <div id="Projects_deadline"></div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="Projects_address"></div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="Projects_department"></div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="Projects_tags"></div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="Projects_resolution"></div>
                </div>
              </div>
            </div>
          </div>

          <template v-slot:requester="{ formName }">
            <div :id="formName + '_requester'" class="box" :class="adding.toLowerCase()">
              <div class="columns">
                <div class="column">
                  <FormSelect :name="formName + '_requester'" label="requester" v-model="requester.reqType" :options="peticionaris" :required="true" />
                </div>
                <div class="column">
                  <FormSelect :name="formName + '_subrequester'" label="Name" v-model="requester.subtype" :options="subrequester" :required="true" v-if="requester.reqType && subrequester.length" />
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <FormInput name="requester_name" type="text" label="Name" v-model="requester.name" :required="true" />
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <FormInput name="requester_email" type="email" label="Email" v-model="requester.email" :required="true" />
                </div>
                <div class="column">
                  <FormInput name="requester_phone" type="phone" label="Phone" v-model="requester.phone" :required="true" />
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <FormInput name="requester_address" type="text" label="Address" v-model="requester.address" :required="true" />
                </div>
                <div class="column">
                  <FormInput name="requester_nif" type="text" label="NIF" v-model="requester.nif" :required="true" />
                </div>
              </div>
            </div>
          </template>

          <template v-slot:controls>
            <button type="submit" class="button is-fullwidth" :class="adding.toLowerCase()">
              {{ $t('Create this new') }} {{ $t(adding.toLowerCase()) }}
            </button>
          </template>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import requesters from './requesters.json'

export default {
  name: 'Add',
  data: () => ({
    adding: 'Project',
    peticionaris: Object.keys(requesters),
    requester: { reqType: '', subtype: '', name: '', email: '', phone: '', address: '', nif: '' }
  }),
  computed: {
    subrequester () { return this.reqType ? requesters[this.reqType] : [] }
  },
  methods: {
    async add (data) {
      let children = { project: 'projects', record: 'records' }[this.adding.toLowerCase()]
      let opId = { records: 'Root/create_record', projects: 'Root/create_project' }
      let result = await this.$store.dispatch('api', { opId: opId[children], data: data })
      if (result.ok) {
        let rjson = await result.json()
        console.log(rjson)
        let url = this.$url(rjson.result.object)
        let opIdPet = { records: 'Record/create_requester', projects: 'Project/create_requester' }
        let opts = { opId: opIdPet[children], path: url, data: this.requester }
        let petRes = await this.$store.dispatch('api', opts)
        if (petRes.ok) {
          console.log(await petRes.json())
          this.$router.push(url)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
//@import '~bulmaswatch/flatly/_variables';
// @import '~bulma/sass/utilities/initial-variables';
// @import '~bulma/sass/utilities/derived-variables';
@import '@/assets/_variables.sass';

.project {
  border: 1px solid $project;
}

.record {
  border: 1px solid $record;
}
</style>
