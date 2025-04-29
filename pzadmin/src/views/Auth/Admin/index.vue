<template>
    <panel-head :route="route"/>
    <!-- 用户列表 -->
    <el-table :data="listData.list" style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scope">
                {{ permissName(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button size="small" type="primary" @click="handleEdit(scope.row)">
                    编辑
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :current-page="paginationData.pageNum" :page-size="paginationData.pageSize" :size="size"
        :disabled="disabled" background layout="total, prev, pager, next" :total="listData.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="编辑用户" width="500">
        <el-form :rules="rules" ref="formRef" :model="form" label-width="80px">
            <el-form-item label="手机号">
                <el-input v-model="form.mobile" disabled />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select placeholder="请选择菜单权限" v-model="form.permissions_id">
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submit(formRef)">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import dayjs from 'dayjs';
import { authAdmin, menuSelectList, updateUser } from '../../../api';
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from "vue-router";

//获取route实例
const route = useRoute()

//form表的dom
const formRef = ref()

//分页参数
const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})

//列表数据
const listData = reactive({
    list: [],
    total: 0
})

//菜单权限下拉数据
const options = ref([])

//控制弹窗的关闭
const dialogFormVisible = ref(false)

//弹窗表单数据
const form = reactive({
    mobile: '',
    name: '',
    permissions_id: 0,
})

//表单校验规则
const rules = reactive({
    name: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
    permissions_id: [{ required: true, message: '菜单权限不能为空', trigger: 'blur' }],
})

//挂载
onMounted(() => {
    //获取列表数据
    getListData()
    //获取菜单权限下拉
    menuSelectList().then(({ data }) => {
        options.value = data.data
    })
})

//根据id匹配权限名称
const permissName = (permissions_id) => {
    const data = options.value.find(item => item.id === permissions_id)
    return data ? data.name : '超级管理员'
}

//获取数据列表
const getListData = () => {
    authAdmin(paginationData).then(({ data }) => {
        const { list, total } = data.data
        list.forEach((item) => {
            item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        })
        listData.list = list
        listData.total = total
    })
}

//列表编辑
const handleEdit = (row) => {
    //打开弹窗
    dialogFormVisible.value = true
    //回显数据
    Object.assign(form, { mobile: row.mobile, name: row.name, permissions_id: row.permissions_id })
}

//提交表单
const submit = (formEl) => {
    //表单校验
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            //更新数据
            const { name, permissions_id } = form
            updateUser({ name, permissions_id }).then(({ data }) => {
                if (data.code === 10000) {
                    //关闭表单
                    dialogFormVisible.value = false
                    //重新获取列表
                    getListData()
                    //提示用户
                    ElMessage.success('操作成功')
                }
            })
        } else {
            ElMessage.error('操作失败')
        }
    })
}

//控制当前页
const handleCurrentChange = (pageNum) => {
    paginationData.pageNum = pageNum
    //重新渲染列表
    getListData()
}

//控制展示条数
const handleSizeChange = (pageSize) => {
    paginationData.pageSize = pageSize
    //重新渲染列表
    getListData()
}
</script>

<style lang='less' scoped></style>