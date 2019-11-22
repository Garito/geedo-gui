<template>
  <div class="role card">
    <div class="card-content">
      <div class="content">
        <h3>
          {{ obj.name }}
          <a class="is-pulled-right" @click="$emit('remove')" v-if="!obj.system">
            <small>
              <FontAwesomeIcon :icon="[ 'far', 'trash-alt' ]" size="xs"></FontAwesomeIcon>
            </small>
          </a>
        </h3>
        <p>{{ obj.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoleCard',
  props: { obj: Object }
}
</script>
