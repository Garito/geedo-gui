<template>
  <div class="roles section">
    <ListManager :title="$t('Roles')" :opId="addOpId" :value="roles" :addBtnTitle="$t('Add a new role')" :submitBtnTitle="$t('Add this role')" @input="add" ref="list">
      <template v-slot="{ item }">
        <div class="column">
          <Card :obj="item" @remove="remove(item)" />
        </div>
      </template>
    </ListManager>
  </div>
</template>

<script>
const ListManager = () => import('@/components/listmanager')
const Card = () => import('@/components/Role/card')

export default {
  name: 'Roles',
  components: { ListManager, Card },
  data: () => ({ opId: 'Root/get_roles', addOpId: 'Root/create_role', removeOpId: 'Role/remove' }),
  computed: {
    roles () { return this.$store.state.roles }
  },
  methods: {
    async add (data) {
      let result = await this.$store.dispatch('add', { opId: this.addOpId, data: data, global: true, children: 'roles' })
      if (result.ok) {
        this.$refs.list.close()
      }
    },
    remove (role) {
      this.$store.dispatch('remove', { opId: this.removeOpId, path: this.$url(role), global: true, children: 'roles' })
    }
  }
}
</script>
