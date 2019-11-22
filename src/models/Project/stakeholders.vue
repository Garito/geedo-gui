<template>
  <div class="project stakeholders section">
    <div v-if="!stakeholders">{{ $t('Loading') }}...</div>
    <template v-else>
      <div class="columns">
        <div class="column">
          <h1 class="title project">{{ $t('stakeholdersTitle', { project: obj.name }) }}</h1>
        </div>
      </div>
      <div class="columns box">
        <div class="column is-narrow"><h2 class="subtitle">{{ $t('Owner') }}:</h2></div>
        <div class="column is-narrow">
          <Media :obj="stakeholders.owner" :imgSize="32">
            <template v-slot="{ obj }">
              <router-link :to="$url(obj)" class="is-size-5">{{ obj.name }}</router-link>
            </template>
            <template v-slot:right="{ obj }" v-if="!editOwner">
              <a class="is-size-7" @click="editOwner = true"><FontAwesomeIcon :icon="[ 'far', 'edit' ]"></FontAwesomeIcon></a>
            </template>
          </Media>
        </div>
        <div class="column" v-if="editOwner">
          <Selector :users="notOwner.map(u => ({ value: u.email, label: u.name }))" @selected="user => transferOwnership(user)" @cancel="editOwner = false" />
        </div>
      </div>
      <div class="columns" v-for="role in roles" :key="role._id">
        <div class="column">
          <ListManager :title="role.name" :value="haveRole(role)" :ref="role.slug">
            <template v-slot="{ item }">
              <Avatar :obj="item">
                <template v-slot:pre-image>
                  <a class="is-pulled-right is-size-6" @click="withdraw(item.email, role.slug)">
                    <FontAwesomeIcon :icon="[ 'far', 'trash-alt' ]"></FontAwesomeIcon>
                  </a>
                </template>
                <template v-slot="{ obj }">{{ obj.name }}</template>
              </Avatar>
            </template>
            <template v-slot:extra-items>
              <div class="column is-narrow is-size-3">
                <template v-if="adding === role.slug">
                  <Selector :users="haventRole(role).map(u => ({ value: u.email, label: u.name }))" @selected="user => give(user, role.slug)" @cancel="adding = false" />
                </template>
                <a @click="adding = role.slug" v-if="!adding"><FontAwesomeIcon icon="plus"></FontAwesomeIcon></a>
              </div>
            </template>
            <template v-slot:noItems><span></span></template>
          </ListManager>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const Media = () => import('@/components/User/media')
const Selector = () => import('@/components/User/selector')
const ListManager = () => import('@/components/listmanager')
const Avatar = () => import('@/components/User/avatar')

export default {
  name: 'ProjectStakeholders',
  components: { Media, Selector, ListManager, Avatar },
  data: () => ({ opId: 'Project/get_stakeholders', editOwner: null, adding: null }),
  computed: {
    obj () { return this.$store.state.context.object },
    url () { return this.$url(this.obj) },
    stakeholders () { return this.$store.state.context.stakeholders },
    roles () { return Object.values(this.$store.state.roles).filter(r => !(r.slug === 'owner' || r.system_only)) },
    notOwner () { return Object.values(this.$store.state.users).filter(u => u.slug !== this.stakeholders.owner.slug) }
  },
  methods: {
    haveRole (role) { return Object.values(this.$store.state.users).filter(u => u.roles.includes(role.slug + '@' + this.url)) },
    haventRole (role) { return Object.values(this.$store.state.users).filter(u => !u.roles.includes(role.slug + '@' + this.url)) },
    async transferOwnership (email) {
      let owner = this.stakeholders.owner
      let newOwner = Object.values(this.$store.state.users).find(u => u.email === email)
      let result = await this.$store.dispatch('transfer_role', { opId: 'Project/transfer_role', role: 'owner', owner: owner.email, newOwner: email })
      if (result) {
        let users = this.$store.state.users
        users[owner.slug].roles = result.result.exOwner
        users[newOwner.slug].roles = result.result.newOwner
        this.$store.commit('setUsers', users)
        let ctx = this.$store.state.context
        ctx.stakeholders.owner = newOwner
        this.$store.commit('setContext', ctx)
        this.editOwner = false
      }
    },
    async give (user, role) {
      let result = await this.$store.dispatch('give_role', { opId: 'Project/give_role', role: role, email: user })
      if (result) {
        this.adding = false
      }
    },
    withdraw (user, role) {
      this.$store.dispatch('withdraw_role', { opId: 'Project/withdraw_role', role: role, email: user })
    }
  },
  created () { this.$store.dispatch('load', { opId: this.opId, name: 'stakeholders' }) }
}
</script>
