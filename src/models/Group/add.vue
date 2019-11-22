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
                  <div id="name"></div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="description"></div>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="code"></div>
                </div>
              </div>
              <div class="columns">
                <div id="record" class="column"></div>
                <div id="deadline" class="column"></div>
              </div>
              <div class="columns">
                <div class="column">
                  <div id="address"></div>
                </div>
              </div>
              <div class="columns">
                <div id="areas" class="column"></div>
                <div id="themes" class="column"></div>
                <div id="tags" class="column"></div>
              </div>
            </div>
          </div>

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
export default {
  name: 'Add',
  data: () => ({ adding: 'Project' }),
  methods: {
    async add (data) {
      let children = { project: 'projects', record: 'records' }[this.adding.toLowerCase()]
      let opId = { records: 'Root/create_record', projects: 'Root/create_project' }
      let result = await this.$store.dispatch('api', { opId: opId[children], data: data })
      if (result.ok) {
        let rjson = await result.json()
        this.$router.push(this.$url(rjson.result.object))
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
