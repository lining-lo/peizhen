<template>
    <panel-head :route="route" />
    <el-row class="baseInfo">
        <el-col :span="12" style="padding-right: 5px;">
            <el-card>
                <div class="img">
                    <el-image style="width: 100px; height: 100px" :src="reportData.user.user_img" />
                    <div class="text"> {{ reportData.user.user_name }}</div>
                </div>
                <div class="userInfo">
                    当前权限：{{ reportData.user.permission }} <br>
                    登录的ip：{{ reportData.user.ip }}
                </div>
            </el-card>
        </el-col>
        <el-col :span="12" style="padding-left: 5px;">
            <el-card>
                <div class="status-container">
                    <div class="status-item" v-for="(item, index) in reportData.types" :key="index">
                        <el-image class="status-img" :style="{ backgroundColor: statusMap(item.state).color }"
                            :src="statusMap(item.state).img" />
                        <div class="status-number">{{ item.num }}</div>
                        <div class="status-label">{{ item.state }}</div>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
    <el-card style="height: 280px;">
        <!-- 折线图 -->
        <div ref="chartRef" style="height: 280px;"></div>
    </el-card>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, reactive, onMounted } from 'vue'
import { report } from '../../api';
import { useRoute } from "vue-router";

//获取route实例
const route = useRoute()

//获取echarts的dom
const chartRef = ref()

//首页数据
const reportData = reactive({
    typeList: [],
    types: [],
    user: {}
})

//挂载
onMounted(() => {
    report().then(({ data }) => {
        if (data.code === 10000) {
            Object.assign(reportData, data.data)
            console.log('reportData', reportData);
            //初始化echarts实例
            var myChart = echarts.init(chartRef.value);
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: ''
                },
                tooltip: {},
                legend: {
                    data: ['订单数']
                },
                xAxis: {
                    data: []
                },
                yAxis: {},
                series: [{
                    name: '订单数',
                    type: 'line',
                    data: []
                }]
            };
            //准备数据
            reportData.typeList.forEach(item => {
                //x轴数据
                option.xAxis.data.push(item.date)
                //y轴数据
                option.series[0].data.push(item.order_sum)
            })
            // 使用刚指定的配置项和数据显示图表
            myChart.setOption(option);
        }
    })
})

//整理数据
const statusMap = (key) => {
    const obj = {
        '待支付': { color: '#ea5a51', img: '/public/dzf.png' },
        '待服务': { color: '#7166bc', img: '/public/dfw.png' },
        '已完成': { color: '#59bef1', img: '/public/ywc.png' },
        '已取消': { color: '#5bca5a', img: '/public/yqx.png' },
    }
    return obj[key]
}
</script>

<style lang='less' scoped>
.baseInfo {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;

    .img {
        display: flex;
        align-items: center;

        .text {
            font-size: 20px;
            font-weight: 500;
        }
    }

    .userInfo {
        margin: 19px 5px;
        font-size: 15px;
        color: slategray;
    }

    .status-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 20px;
        padding: 20px;

        .status-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;

            .status-img {
                width: 60px;
                height: 60px;
                padding: 5px;
            }

            .status-number {
                font-size: 24px;
                font-weight: bold;
            }

            .status-label {
                font-size: 14px;
                color: #666;
            }
        }
    }
}
</style>