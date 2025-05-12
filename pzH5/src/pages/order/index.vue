<template>
    <div class="container">
        <div class="header">我的订单</div>
        <!-- 标签 -->
        <van-tabs v-model:active="active" @click-tab="onClickTab">
            <van-tab title="全部" name="" />
            <van-tab title="待支付" name="1" />
            <van-tab title="待服务" name="2" />
            <van-tab title="已完成" name="3" />
            <van-tab title="已取消" name="4" />
        </van-tabs>
        <!-- 订单列表 -->
        <van-row v-for="item in order" :key="item.out_trade_no" @click="goDetail">
            <!-- 图片 -->
            <van-col span="5">
                <van-image radius="5" width="50" height="50" :src="item.serviceImg" />
            </van-col>
            <!-- 文本信息 -->
            <van-col span="14">
                <div class="text1">{{ item.service_name }}</div>
                <div class="text2">
                    {{ item.hospital_name }} <br>
                    预约时间：{{ item.starttime }}
                </div>
            </van-col>
            <!-- 状态 -->
            <van-col span="5" :style="{ color: colorMap[item.trade_state] }">
                {{ item.trade_state }} <br>
                <counter :second="item.timer" v-if="item.trade_state === '待支付'" />
            </van-col>
        </van-row>
        <div class="bottom-text">没有更多了</div>
    </div>
</template>

<script setup>
import counter from '../../components/counter.vue'
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'

//获取当前vue实例
const { proxy } = getCurrentInstance()

//标签状态
const active = ref('')

//订单数据
const order = ref([])

//支付状态
const colorMap = {
    '待支付': '#ffa200',
    '待服务': '#1da6fd',
    '已完成': '#21c521'
}

//挂载
onMounted(() => {
    getOrderList('')
})

//标签的点击事件
const onClickTab = (item) => {
    getOrderList(item.name)
}

//获取订单列表
const getOrderList = async (state) => {
    const { data } = await proxy.$api.orderList({ state })
    data.data.forEach(item => {
        item.timer = item.order_start_time + 7200000
    });
    order.value = data.data
    console.log('order', order);

}

//点击跳转到支付详情
const goDetail = () => {

}

</script>
<style lang='less' scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
}

.header {
    background-color: #fff;
    line-height: 40px;
    text-align: center;
}

.van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;

    .text1 {
        font-size: 16px;
        line-height: 25px;
        font-weight: bold;
    }

    .text2 {
        font-size: 14px;
        line-height: 20px;
        color: #999999;
    }
}

.bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
}
</style>