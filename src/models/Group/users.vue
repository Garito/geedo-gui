<template>
  <div class="section people">
    <div v-if="loading">Loading...</div>
    <template v-else-if="invitations">

      <div class="columns">
        <div class="column">

          <ListManager :title="$t('Invitations')" opId="Root/create_invitation" :value="invitations" :addBtnTitle="$t('Add a new invitation')" :submitBtnTitle="$t('Add this invitation')" :cancelBtn="$t('Cancel')" @input="add" ref="list">
            <template v-slot:form-layout>
              <div id="root_create_invitation_layout" class="columns">
                <div class="column"><span id="root_create_invitation_name"></span></div>
                <div class="column"><span id="root_create_invitation_email"></span></div>
              </div>
            </template>

            <template v-slot:default="{ item }">
              <div class="column">
                <Invitation :obj="item" @send="send" @remove="remove"></Invitation>
                <!-- <Media :obj="item">
                  <template v-slot:default="{ obj }">
                    <h2 class="subtitle">{{ obj.name }}</h2>
                  </template>
                  <template v-slot:right="{ obj }">
                    <a class="icon" @click="remove(obj)">
                      <FontAwesomeIcon :icon="[ 'far' , 'trash-alt' ]"></FontAwesomeIcon>
                    </a>
                  </template>
                </Media> -->
              </div>
            </template>
          </ListManager>

        </div>
      </div>

      <div class="columns">
        <div class="column">
          <h1 class="title">{{ $t('usersTitle', { name: obj.name }) }}</h1>
        </div>
      </div>

    </template>
    <div v-else>Loading invitations...</div>
  </div>
</template>

<script>
const ListManager = () => import('@/components/listmanager')
const Invitation = () => import('@/components/Invitation/card')
// const Media = () => import('@/components/User/media')

export default {
  name: 'Users',
  components: { ListManager, Invitation },
  data: () => ({ operationId: 'Group/users' }),
  computed: {
    obj () { return this.$store.state.context.object },
    loading () { return !this.obj || this.obj.type !== 'Group' },
    invitations () { return this.$store.state.context.invitations }
  },
  methods: {
    async add (data) {
      let result = await this.$store.dispatch('add', { opId: 'Root/create_invitation', data: data, children: 'invitations' })
      if (result.ok) {
        this.$refs.list.close()
      }
    },
    async send (invitation) {
      console.log(arguments)
    },
    remove (invitation) {
      this.$store.dispatch('remove', { opId: 'Invitation/remove', path: this.$url(invitation), children: 'invitations' })
    }
  },
  mounted () {
    this.$store.dispatch('load', { opId: 'Root/get_invitations', name: 'invitations' })
  }
}
</script>
