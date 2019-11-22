<template>
  <div class="field has-addons">
    <div class="control">
      <button class="button is-fullheight" @click="$emit('cancel')">
        <FontAwesomeIcon icon="times"></FontAwesomeIcon>
      </button>
    </div>
    <div class="control">

      <FormSelect name="users" label="Users" v-model="selected" :sr_only="true" :options="users" :allowEmpty="false" :required="true" @input="value => $emit('input', selected)">
        <template v-slot:singleLabel="{ option }">
          <Avatar :obj="option"><template v-slot="{ obj }">{{ obj.label }}</template></Avatar>
        </template>
        <template v-slot:option="{ option }">
          <Avatar :obj="option"><template v-slot="{ obj }">{{ obj.label }}</template></Avatar>
        </template>
      </FormSelect>

    </div>
    <div class="control">
      <button class="button is-success is-outlined is-fullheight" :disabled="!selected" @click="$emit('selected', selected)">
        <FontAwesomeIcon icon="check"></FontAwesomeIcon>
      </button>
      </div>
  </div>
</template>

<script>
const Avatar = () => import('@/components/User/avatar')

export default {
  name: 'UserSelector',
  components: { Avatar },
  props: { value: String, users: Array },
  data: () => ({ selected: null }),
  created () { this.selected = this.value }
}
</script>

<style scoped>
.is-fullheight {
  height: 100%;
}
</style>
