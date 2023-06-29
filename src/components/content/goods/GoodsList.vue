<template>
    <div class="goods">
        <GoodsListItem v-for="item in goods" :product="item" :key="item"></GoodsListItem>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import GoodsListItem from './GoodsListItem';
export default defineComponent({
    name:'GoodsList',
    components:{
        GoodsListItem
    },

    props:{
        goods:{
            type:Array,
            default(){
                return []
            }
        }
    },

    setup(){

        return{

        }

    }
})
</script>

<style lang='scss'>
.goods{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 5px;
}
</style>