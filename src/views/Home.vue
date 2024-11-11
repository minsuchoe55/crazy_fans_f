<template>
  <MainHeader/>
  <MainSlider />
  <MainList />
  <MainFooter />
</template>

<script>
import MainHeader from '../components/MainHeader.vue'
import MainSlider from '../components/MainSlider.vue'
import MainList from '../components/MainList.vue'
import MainFooter from '../components/MainFooter.vue'
export default {
  components: {
    MainHeader,
    MainSlider,
    MainList,
    MainFooter,
  },
}
</script>

<style>

</style>