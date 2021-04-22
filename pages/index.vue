<template>
  <div></div>
</template>

<script>
export default {
  async asyncData({ error }) {
    error({ statusCode: 404, message: 404 })
  },
}
</script>
