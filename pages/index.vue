<template>
  <h1>Hello World</h1>
</template>
<script>
export default {
  props: {
    source: {
      type: String,
      default: 'Hello'
    }
  },
  data: () => ({
    drawer: null
  })
};
</script>
