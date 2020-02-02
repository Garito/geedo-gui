<template>
  <div class="requester">
    <div class="columns">
      <div class="column">
        <article class="message">
          <div class="message-header">
            <p>{{ $t('Requester') }}:</p>
          </div>
          <div class="message-body">
            <table class="table">
              <tr><td>{{ $t('Name') }}</td><td>{{ obj.name }}</td></tr>
              <tr><td>{{ $t('Email') }}</td><td>{{ obj.email }}</td></tr>
              <tr><td>{{ $t('Phone') }}</td><td>{{ obj.phone }}</td></tr>
              <tr><td>{{ $t('NIF') }}</td><td>{{ obj.nif }}</td></tr>
              <tr><td>{{ obj.reqType }}</td><td>{{ obj.subtype }}</td></tr>
            </table>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Requester',
  props: { obj: Object }
}
</script>

<style scoped>
.requester {
  margin-bottom: 0;
}
</style>
