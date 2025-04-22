<template>
  <el-row class="login-container" justify="center" align="middle">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="">
        </div>
      </template>
      <div class="jump-link" @click="handleChange"><el-link type="primary">{{ fromType ? '返回登录' : '注册用户' }}</el-link>
      </div>
      <el-form ref="loginFormRef" :rules="rules" :model="loginForm">
        <el-form-item prop="userName">
          <el-input :prefix-icon="Avatar" v-model="loginForm.userName" placeholder="手机号" />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input type="password" v-model="loginForm.passWord" placeholder="密码" :prefix-icon="Lock" />
        </el-form-item>
        <el-form-item prop="validCode">
          <el-input v-if="fromType" v-model="loginForm.validCode" placeholder="验证码" :prefix-icon="Lock">
            <template #append>
              <span @click="countdownChange"> {{ countDown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%;" type="primary" @click="submitForm(loginFormRef)">
            {{ fromType ? '注册' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { getCode, login, userAuthentication } from '../../api'
import { Avatar, Lock } from "@element-plus/icons-vue";
import { useRouter } from 'vue-router';
import { ref, reactive } from 'vue'

//图片的路径
const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href

//路由实例
const router = useRouter()

//表单的类型 0登录 1注册
const fromType = ref(0)

//登录表单
const loginForm = reactive({
  userName: '',
  passWord: '',
  validCode: '',
})

//验证码信息
const countDown = reactive({
  validText: '获取验证码',
  time: 60
})

//只能开启一个定时器
let flag = false

//切换表单类型
const handleChange = () => {
  fromType.value = fromType.value ? 0 : 1
}

//获取验证码
const countdownChange = () => {
  if (flag) return
  //手机正则
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  //手机号校验
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    ElMessage({
      message: '请检查手机号是否正确',
      type: 'warning',
    })
    return
  }
  //定时器
  const timer = setInterval(() => {
    if (countDown.time <= 0) {
      countDown.time = 60
      countDown.validText = '获取验证码'
      clearInterval(timer)
    } else {
      flag = true
      countDown.time--
      countDown.validText = `剩余${countDown.time}s`
    }
  }, 1000);
  flag = false
  //发送验证码
  getCode({tel:loginForm.userName}).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage({
        message: '发送成功',
        type: 'success',
      })
    }
  })
}

//账号校验规则
const validateUser = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('账号不能为空'))
  } else {
    //手机正则
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    phoneReg.test(value) ? callback() : callback(new Error('账号格式不正确'))
  }
}
//账号校验规则
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('密码不能为空'))
  } else {
    // 密码正则
    const passWordReg = /^[a-zA-Z0-9_-]{4,16}$/
    passWordReg.test(value) ? callback() : callback(new Error('密码应为4-16位'))
  }
}
//需要校验的表单项
const rules = reactive({
  userName: [{ validator: validateUser, required: true, trigger: 'blur' }],
  passWord: [{ validator: validatePass, required: true, trigger: 'blur' }],
})

//表单dom
const loginFormRef = ref()
//提交表单
const submitForm = (formEl) => {

  if (!formEl) return
  //表单校验
  formEl.validate((valid) => {
    if (valid) {
      //用户注册
      if (fromType.value) {
        userAuthentication(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            //跳转到登录表单
            fromType.value = 0
            //提示用户
            ElMessage({
              message: '注册成功',
              type: 'success',
            })
          }
        })
      } else {
        //用户登录
        login(loginForm).then(({ data }) => {
          if (data.code === 10000) {
            //存入token、用户信息
            localStorage.setItem('pz_token',data.data.token)
            localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
            //跳转到首页
            router.push('/')
            //提示用户
            ElMessage({
              message: '登录成功',
              type: 'success',
            })
          }
        })
      }
    }
  })
}
</script>

<style lang='less' scoped>
:deep(.el-card__header) {
  padding: 0
}

.login-container {
  height: 100%;

  .card-header {
    background-color: #899fe1;

    img {
      width: 430px;
    }
  }

  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>