<template>
    <div>
        <nav-bar>
            <template v-slot:default>账号设置</template>
        </nav-bar>   

        <div class="userName">
            <strong>用户昵称：{{ userName }}</strong>
        </div>  

        <div class="update-box">
            <van-button class="update-btn" v-show="updateFlag" @click="goToUpdate">修改昵称</van-button>
            <div class="input-box">
                <van-field class="input" v-show="!updateFlag" v-model="newName" label="新昵称：" placeholder="请输入新昵称" />
                <van-button class="update-btn" v-show="!updateFlag" @click="update">确认修改</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import NavBar from '@/components/common/navbar/NavBar.vue';
import {getUserDetail,updateUserDetail} from '@/network/user'

export default defineComponent({
name:'updateUser',
components:{
    NavBar,
},
setup(){
    const state=reactive({
        userName:'',
        newName:'',
        updateFlag:true
    })
    // 显示修改按钮和输入框
    const goToUpdate=()=>{
        state.updateFlag=false;
    }

    // 调用接口更新用户昵称
    const update=()=>{
        updateUserDetail('name='+state.newName).then(res=>{
            getUserDetail().then(res=>{
                state.userName=res.name;
            })
            state.updateFlag=true;
        })        
    }
    onMounted(()=>{
        getUserDetail().then(res=>{
            state.userName=res.name
        })
    })

    
    return{
        // userName,
        ...toRefs(state),
        // updateFlag,
        goToUpdate,
        update
    }

}
})
</script>

<style lang='scss'>
.userName{
    text-align: center;
    margin-top: 100px;
    font-size: large;
}
.update-box{
    display: flex;
    justify-content: center;
    margin-top: 10%;
    .update-btn{
        width: 100px;
        background-color:#42b983 ;
        color: white;
        border-radius: 10px;
    }
}
.input-box{
    display: flex;
    flex-direction: column;
    align-items: center;
    

    .input{
        margin-bottom: 10px;
        background-color: #F6F6F6;
    }
    
}
</style>
  
  