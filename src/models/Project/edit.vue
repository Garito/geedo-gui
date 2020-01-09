<template>
  <div class="edit section">
    <div class="column">
      <div class="box project">
        <h1 class="title">
          <span class="has-text-grey-dark is-size-6">{{ $t('Edit') }}</span>&nbsp;
          <span class="pushes-right project">{{ obj.name }}</span>
        </h1>
        <Form name="Project" :schema="$store.getters.schema('Project/update')" :value="value" :errors="$store.state.errors" @submit="data => update(data)" @input="$store.commit('setErrors', null)">
          <div id="Project_layout" class="columns">
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
            <div class="columns">
              <div class="column">
                <button type="submit" class="button is-fullwidth project">{{ $t('Save changes') }}</button>
              </div>
              <div class="column">
                <router-link :to="$url(obj)" class="button is-fullwidth">{{ $t('Cancel') }}</router-link>
              </div>
            </div>
          </template>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditProject',
  computed: {
    obj () { return this.$store.state.context.object },
    value () {
      let obj = this.obj
      let result = {}
      for (let field of Object.keys(this.$store.getters.schema('Project/update').properties)) {
        result[field] = obj[field]
        if (['record', 'deadline'].includes(field) && result[field].endsWith('Z')) {
          result[field] = result[field].slice(0, -1)
        }
      }

      return result
    }
  },
  methods: {
    async update (data) {
      let opts = { opId: 'Project/update', data: data }
      let result = await this.$store.dispatch('api', opts)
      if (result.ok) {
        this.$router.push(this.$url(this.obj))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.sass';

.box.project {
  border: 1px solid $project;
}
</style>
