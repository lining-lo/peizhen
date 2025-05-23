<template>
    <div class="container">
        <!-- 头部内容 -->
        <div class="header">
            <van-icon @click="goBack" name="arrow-left" class="header-left" size="30" />
            订单详情
        </div>
        <!-- 进度条 -->
        <status-bar :item="stateMap[detailData.trade_state]" />
        <!-- 不同状态提示信息 -->
        <div class="tips">
            <!-- 待支付 -->
            <div class="dzf" v-if="detailData.trade_state === '待支付'">
                <div class="text1">订单待支付</div>
                <div class="text2">
                    请在
                    <counter :second="second" />
                    内完成支付，超时订单自动取消
                </div>
                <div class="text3">
                    <van-button type="success" @click="showCode = true">立即支付（0.1元）</van-button>
                </div>
            </div>
            <!-- 待服务 -->
            <div class="dzf" v-if="detailData.trade_state === '待服务'">
                <div class="text1">正在为您安排服务专员...</div>
                <div class="text2">请保持手机畅通，稍后将有服务专员与你联系</div>
            </div>
            <!-- 待服务 -->
            <div class="dzf" v-if="detailData.trade_state === '已完成'">
                <div class="text1">服务已完成...</div>
                <div class="text2">感谢您的使用，如有售后问题请联系客服</div>
            </div>
            <!-- 待服务 -->
            <div class="dzf" v-if="detailData.trade_state === '已取消'">
                <div class="text1">订单已取消</div>
                <div class="text2">期待下次为您服务，如需帮忙可联系客服</div>
            </div>
        </div>
        <!-- 订单信息 -->
        <van-cell-group class="card">
            <!-- 预约信息 -->
            <div class="header-text">预约信息</div>
            <van-cell v-for="(item, key) in makeInnfo" :key="key" :title="item" :value="formatData(key)" />
            <!-- 订单信息 -->
            <div class="header-text">订单信息</div>
            <van-cell v-for="(item, key) in orderInfo" :key="key" :title="item" :value="formatData(key)" />
        </van-cell-group>
        <!-- 支付二维码弹窗-->
        <van-dialog v-model:show="showCode" :show-confirm-button="false">
            <van-icon name="cross" class="close" @click="showCode = false" />
            <div>微信支付</div>
            <van-image width="150" height="150" :src="codeImg" />
            <div>请使用本人微信扫码二维码</div>
        </van-dialog>
    </div>
</template>

<script setup>
import Qrcode from 'qrcode'
import counter from '../../components/counter.vue'
import { ref, reactive, onMounted, getCurrentInstance, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';

//route实例
const route = useRoute()

//router实例
const router = useRouter()

//获取当前vue实例
const { proxy } = getCurrentInstance()

//订单详情数据
const detailData = reactive({})

//支付状态
const stateMap = {
    '待支付': 10,
    '待服务': 20,
    '已完成': 30,
    '已取消': 40
}

//倒计时
const second = computed(() => {
    return detailData.order_start_time + 7200000 - Date.now()
})

//控制二维码弹出框的显示与隐藏
const showCode = ref(false)

//二维码图片
const codeImg = ref()

//预约信息
const makeInnfo = {
    service_name: '预约服务',
    hospital_name: '就诊医院',
    starttime: '期望就诊时间',
    'client.name': '就诊人',
    'client.mobile': '就诊人电话',
    receiveAddress: '接送地址',
    demand: '其他需求'
}

//订单信息
const orderInfo = {
    tel: "就诊人电话",
    order_start_time: '下单时间',
    price: '应付金额',
    out_trade_no: '订单编号'
}

//挂载
onMounted(async () => {
    //获取订单详情数据
    const { data } = await proxy.$api.orderDetail({ oid: route.query.oid })
    Object.assign(detailData, data.data)
    console.log('detailData', detailData);
    //生成二维码
    Qrcode.toDataURL(data.data.code_url).then((url) => {
        codeImg.value = url
    })

})

//点击左侧图标回退
const goBack = () => {
    router.go(-1)
}

//数据处理
const formatData = (key) => {
    if (key.indexOf(".") === -1) {
        if (key === "order_start_time") {
            return formatTimestamp(detailData[key]);
        }
        return detailData[key];
    }
    let arr = key.split(".").reduce((o, p) => {
        return (o || {})[p];
    }, detailData);
    return arr;
}

//日期格式
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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

    .header-left {
        float: left;
    }
}

.card {
    margin: 15px 0;
    padding: 10px;

    .header-text {
        padding-left: 5px;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        border-left: 4px solid red;
    }
}

.dzf {
    padding: 20px;

    .text1 {
        font-size: 20px;
        font-weight: bold;
        line-height: 30px;
        color: #666;
    }

    .text2 {
        font-size: 14px;
        color: #666;
    }

    .text3 {
        text-align: center;

        .van-button {
            margin-top: 10px;
            margin-left: 10px;
            width: 80%;
            font-weight: bold;
        }
    }
}

::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;

    .close {
        position: absolute;
        left: 20px;
    }
}
</style>