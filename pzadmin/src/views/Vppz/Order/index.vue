<template>
    <panel-head :route="route" />
    <!-- 搜索部分 -->
    <el-form class="form" :model="form">
        <el-form-item>
            <el-input :prefix-icon="Search" v-model="form.out_trade_no" placeholder="订单号" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchOrder">查询</el-button>
        </el-form-item>
    </el-form>
    <!-- 订单列表 -->
    <el-table :data="listData.list" style="width: 100%">
        <el-table-column prop="out_trade_no" label="订单号" width="135" fixed="left" />
        <el-table-column prop="hospital_name" label="就诊医院" width="110" />
        <el-table-column prop="service_name" label="就诊服务" />
        <el-table-column label="陪护师头像" width="100">
            <template #default="scope">
                <el-image style="width: 40px;height: 40px;" :src="scope.row.companion.avatar" />
            </template>
        </el-table-column>
        <el-table-column label="陪护师手机号" width="110" fixed="left">
            <template #default="scope">
                {{ scope.row.companion.mobile }}
            </template>
        </el-table-column>
        <el-table-column prop="price" label="总价" />
        <el-table-column prop="paidPrice" label="已付" />
        <el-table-column prop="order_start_time" label="下单时间" width="110" fixed="left" />
        <el-table-column label="订单状态">
            <template #default="scope">
                <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="service_state" label="接单状态" />
        <el-table-column prop="tel" label="联系人手机号" width="110" fixed="left" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-popconfirm confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" icon-color="#626AEF"
                    title="你确认要完成吗?" @confirm="confirmEvent(scope.row.out_trade_no)">
                    <template #reference>
                        <el-button v-if="scope.row.trade_state === '待服务'" link type="primary">服务完成</el-button>
                        <el-button v-else disabled link type="primary">暂无服务</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :current-page="paginationData.pageNum" :page-size="paginationData.pageSize" :size="size"
        :disabled="disabled" background layout="total, prev, pager, next" :total="listData.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
import dayjs from 'dayjs';
import { adminOrder, updateOrder } from '../../../api';
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";

//获取route实例
const route = useRoute()

//列表数据
const listData = reactive({
    list: [],
    total: 0
})

//分页参数
const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})

//搜索
const form = reactive({
    out_trade_no: ''
})


//挂载
onMounted(() => {
    getListData()
})

//获取订单列表的方法
const getListData = (params={}) => {
    adminOrder({...paginationData,...params}).then(({ data }) => {
        const { list, total } = data.data
        list.forEach((item) => {
            item.order_start_time = dayjs(item.order_start_time).format('YYYY-MM-DD')
        })
        listData.list = list
        listData.total = total
        console.log(listData);

    })
}

//控制分页的当前页
const handleCurrentChange = (pageNum) => {
    paginationData.pageNum = pageNum
    //重新渲染列表
    getListData()
}

//控制分页的展示条数
const handleSizeChange = (pageSize) => {
    paginationData.pageSize = pageSize
    //重新渲染列表
    getListData()
}

//查找订单
const searchOrder = () => {
    getListData(form)
}

//订单状态显示处理
const statusMap = (key) => {
    const obj = {
        '已取消': 'info',
        '待支付': 'warning',
        '已完成': 'success'
    }
    return obj[key]
}

//修改订单服务状态
const confirmEvent = (id) => {
    updateOrder({ id }).then(({ data }) => {
        if (data.code === 10000) {
            ElMessage.success('修改成功')
            getListData()
        }
    })
}

</script>

<style lang='less' scoped>
.form {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
</style>