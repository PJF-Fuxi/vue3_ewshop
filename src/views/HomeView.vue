<template>
  <div class="home">
    {{ banner }}
  </div>
</template>

<script lang="ts">
import { defineComponent,onMounted,ref } from 'vue';
import { getHomeAllData } from '@/network/home';

export default defineComponent({
  name: 'HomeView',
  components: {

  },
  setup(){
    const banner=ref([])

    onMounted(()=>{
      // console.log("Dom挂载完毕"),
      getHomeAllData().then((value: any) => {
        // console.log(value)
        banner.value=value.goods


      }).catch((err: any) => {
        
      })
    })

    return{
      banner
    }
  }
});
</script>

<style>

</style>
