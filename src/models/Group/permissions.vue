<template>
  <div class="group permissions section">
    <div v-if="loading">{{ $t('Loading') }}...</div>
    <template v-else>
      <h1 class="title has-text-primary">{{ $t('Permissions') }}</h1>
      <table class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>{{ $t('Name') }}</th><th>{{ $t('Roles') }}</th>
          </tr>
        </thead>
        <tbody v-for="[model, members] in Object.entries(perms)" :key="model">
          <tr :class="{ 'selected': visible === model }" @click="visible = model">
            <th class="has-text-centered" colspan="3">{{ $t(model) }}</th>
          </tr>
          <template v-if="visible === model">
            <tr v-for="[member, perm] in Object.entries(members)" :key="model + member">
              <td>{{ member }}</td>
              <td @click="editing = model + member" v-if="editing !== model + member">
                <div class="tags" v-if="perm.roles.length">
                  <span class="tag" v-for="role in perm.roles" :key="model + member + role">{{ roles[role].name }}</span>
                </div>
                <span class="tag is-warning" v-else>{{ $t('Everyone') }}</span>
              </td>
              <td v-else>
                <Form name="EditPermission" :schema="schema" :value="{ roles: perm.roles }" noLabels @submit="d => submit(model, member, d)">
                  <template v-slot:controls>
                    <div class="columns is-mobile">
                      <div class="column">
                        <button class="button is-primary is-fullwidth" type="submit">Set those roles</button>
                      </div>
                      <div class="column">
                        <button class="button is-fullwidth" type="button" @click="editing = null">Cancel</button>
                      </div>
                    </div>
                  </template>
                </Form>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'GroupPermissions',
  data: () => ({ opId: 'Permission/update', visible: 'Group', editing: null }),
  computed: {
    object () { return this.$store.state.context.object },
    loading () { return !this.object || this.object.type !== 'Group' },
    perms () {
      let perms = {}
      for (var [name, perm] of Object.entries(this.$store.state.perms)) {
        let [model, member] = name.split('/')

        if (!Object.keys(perms).includes(model)) {
          perms[model] = {}
        }

        perms[model][member] = perm
      }
      return perms
    },
    roles () { return this.$store.state.roles },
    schema () {
      let schema = this.$store.getters.schema(this.opId)
      let options = []
      for (var [value, role] of Object.entries(this.roles)) {
        options.push({ value: value, label: role.name })
      }
      schema.properties.roles['x-options'] = { result: options }
      return schema
    }
  },
  methods: {
    async submit (model, member, data) {
      let perm = this.perms[model][member]
      let result = await this.$store.dispatch('api', { opId: this.opId, path: this.$url(perm), data: data })
      let rjson = await result.json()
      if (result.ok) {
        this.$store.state.perms[model + '/' + member] = rjson.result
      }
      this.editing = null
    }
  }
}
</script>

<style scoped lang="scss">
//@import '~bulmaswatch/flatly/_variables';
@import '~bulma/sass/utilities/initial-variables';
@import '~bulma/sass/utilities/derived-variables';

tbody > tr:first-child:not(.selected) {
  cursor: pointer;
}

.selected, .selected:hover {
  background-color: rgba($primary, .3);
}
</style>
