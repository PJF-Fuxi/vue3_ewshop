<template>
    <div class="goods-item" @click="itemClick">
        <img v-lazy="product.cover_url" alt="">
        <div class="goods-info">
            <p>{{product.title}}</p>
            <span class="price"><small>￥</small>{{product.price}}</span>
            <span class="collect">{{ product.collects_count }}</span>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import {useRouter} from 'vue-router';
export default defineComponent({
    name:'GoodsListItem',
    components:{

    },
    props:{
        product:{
            type:Object,
            default(){
                return {}
            }
        }
    },

    setup(props){
      const router=useRouter();

      const itemClick=()=>{
          router.push({path:'/detail',query:{id:props.product.id}})
       }
        return{
          itemClick,
        }

    }
})
</script>

<style lang='scss'>
.goods-item {
    width: 46%;
    padding-bottom: 45px;
    position: relative;
    img {
      width: 100%;
      border-radius: 5px;
    }
    .goods-info {
      position: relative;
      position: absolute;
      bottom: 5px;
      left: 0;
      right: 0;
      font-size: 12px;
      overflow: hidden;
      text-align: center;
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 3px;
      }
      .price {
        color: red;
        margin-right: 20px;
      }
      img {
        position: absolute;
        display: inline-block;
        top: 15px;
        left: 90px;
        width: 12px;
        height: 14px;
      }
      .collect {
        position: relative;
      }
      .collect::before{
        content: '';
        position: absolute;
        left: -15px;
        width: 14px;
        height: 14px;
        top: -1px;
        background: url('@/assets/images/collect.png') 0 0/14px 14px;
      }

    }
  }
</style>