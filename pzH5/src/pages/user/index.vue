<template>
    <div class="container">
        <!-- 用户信息 -->
        <div class="user">
            <van-image class="img" width="50" height="50" :src="userInfo.avatar" />
            <div class="text">{{ userInfo.name }}</div>
        </div>
        <!-- 我的订单 -->
        <div class="order">
            <div class="top">
                <div class="text1">我的订单</div>
                <div class="text2">全部</div>
            </div>
            <div class="buttom">
                <div class="item" @click="goOrder(1)">
                    <van-image width="40" height="40" src="/images/od_10.png" />
                    <div>待支付</div>
                </div>
                <div class="item" @click="goOrder(2)">
                    <van-image width="40" height="40" src="/images/od_20.png" />
                    <div>待服务</div>
                </div>
                <div class="item" @click="goOrder(3)">
                    <van-image width="40" height="40" src="/images/od_30.png" />
                    <div>已完成</div>
                </div>
                <div class="item" @click="goOrder(4)">
                    <van-image width="40" height="40" src="/images/od_40.png" />
                    <div>已取消</div>
                </div>
            </div>
        </div>
        <!-- 服务对象管理和分享转发 -->
        <div class="foot">
            <div class="foot1">
                <div class="text1">
                    <van-image width="20" height="20" src="/images/ic_clients.png" />
                    服务对象管理
                </div>
                <div class="text2"><van-icon name="arrow" /></div>
            </div>
            <div class="foot2">
                <div class="text1">
                    <van-image width="20" height="20" src="/images/ic_share.png" />
                    分享转发
                </div>
                <div class="text2"><van-icon name="arrow" /></div>
            </div>
        </div>
        <!-- 退出登录按钮 -->
        <van-button @click="show = true" class="quit" type="danger" size="large">退出登录</van-button>
        <!-- 退出登录提示 -->
        <van-dialog v-model:show="show" title="提示" @cancel="show = false" @confirm="logout" show-cancel-button>
            <div class="quit_text">是否确认退出登录</div>
        </van-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

//获取router实例
const router = useRouter()

//用户信息
const userInfo = computed(() => {
    return JSON.parse(localStorage.getItem('h5_userInfo')) || {}
})

//退出登录弹窗开关
const show = ref(false)

//点击跳转到订单页
const goOrder = (active) => {
    router.push('/order?active=' + active)
}

//退出登录
const logout = () => {
    //清除token和用户信息
    localStorage.removeItem("h5_token")
    localStorage.removeItem("h5_userInfo")
    //跳转到登录页面
    router.push('/login')
}

</script>
<style lang='less' scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
    overflow: hidden;

    .user {
        width: 95%;
        height: 200px;
        background-color: #fff;
        text-align: center;
        border-radius: 10px;
        margin: 10px;

        .img {
            margin-top: 30px;
        }

        .text {
            line-height: 30px;
            font-weight: bold;
        }
    }

    .order {
        width: 90%;
        margin: 10px;
        border-radius: 5px;
        background-color: #fff;
        padding: 10px;

        .top {
            margin: 10px;
            line-height: 50px;
            display: flex;
            justify-content: space-between;

            .text1 {
                color: #333;
            }

            .text2 {
                color: #999;
            }

            border-bottom: 0.5px solid #f5f5f5;
        }

        .buttom {
            padding: 10px;
            display: flex;
            justify-content: space-around;

            .item {
                font-size: 14px;
                color: #999;
            }
        }
    }

    .foot {
        margin: 0 10px;
        padding: 10px;
        line-height: 50px;
        background-color: #fff;

        .foot1,
        .foot2 {
            display: flex;
            justify-content: space-between;
            color: #555;
        }

        .foot1 {
            border-bottom: 0.5px solid #f5f5f5;
        }
    }

    .quit {
        width: 90%;
        margin: 20px;
    }

    .quit_text {
        margin: 20px 0;
        text-align: center;
    }
}
</style>