<template>
    <h1>用户登录</h1>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field v-model="form.userName" name="username" label="用户名" placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]" />
            <van-field v-model="form.passWord" type="password" name="password" label="密码" placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]" />
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">提交</van-button>
        </div>
    </van-form>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

//获取router实例
const router = useRouter()

//获取当前vue实例
const { proxy } = getCurrentInstance()

//表单数据
const form = reactive({
    userName: '',
    passWord: ''
})

//用户登录
const onSubmit = async () => {
    const { data } = await proxy.$api.login(form)
    if (data.code === 10000) {
        //浏览器存入token和用户信息
        localStorage.setItem('h5_token',data.data.token)
        localStorage.setItem('h5_userInfo',JSON.stringify(data.data.userInfo))
        //跳转到首页
        router.push('/home')
    }
    
}
</script>

<style lang='less' scoped>
h1 {
    text-align: center;
}
</style>