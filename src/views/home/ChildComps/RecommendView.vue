<template>
  <div class="recommend">
    <div class="recommend-item" v-for="item in recommends.slice(4,8)" :key="item.id">
      <a href="" @click.prevent="goId(item.id)">
        <img v-lazy="item.cover_url" alt="">
        <div>{{ item.title }}</div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent} from 'vue';
import {useRouter} from "vue-router";
import {recommendItemData} from '@/types/type'

export default defineComponent({
  name: "RecommendView",
  
  props: {
    recommends: {
      type: Array as PropType<recommendItemData[]>,
      default(){
        return [];
      }
    }
  },

  setup(){
    const router = useRouter();

    const goId = (id: number) => {
      router.push({path:'/detail',query:{id}})
    }
    return {
      goId
    }
  },
 
})
</script>

<style scoped lang="scss">
  .recommend {
    display: flex;
    width: 100%;
    text-align: center;
    padding: 5px 0 10px;
    border-bottom: 8px solid #EEEEEE;
    font-size: 10px;
  }
  .recommend-item {
    flex: 1;
  }
  .recommend-item img {
    width: 70px;
    height: 70px;
    margin-bottom: 5px;
  }
</style>
