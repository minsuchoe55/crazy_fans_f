<template>
  <router-view></router-view>
</template>

<script>
import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',

  setup() {
    const store = useStore()

    onBeforeMount(async () => {
      await store.dispatch('fetchProfileData')
      await store.dispatch('fetchVideoData')

    })

    return {
      store
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: black;
  color: white;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: black;
  color: white;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  margin: 0;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  padding: 0;
  margin: 0;
}

nav a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

nav a:hover {
  color: gray;
}
</style>