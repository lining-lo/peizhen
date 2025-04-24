<template>
    <panel-head />
    <!-- 添加按钮 -->
    <el-button :icon="Plus" type="primary" @click="open(null)">添加</el-button>
    <!-- dialog对话框 -->
    <el-dialog :before-close="beforeClose" v-model="dialogVisible" title="添加权限" width="500">
        <el-form :rules="rules" ref="formRef" :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item prop="id">
                <el-input v-show="false" v-model="form.id" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请填写权限名称" />
            </el-form-item>
            <el-form-item label="权限" prop="permissions">
                <el-tree ref="treeRef" show-checkbox node-key="id" :default-checked-keys="[4, 5]"
                    :default-expanded-keys="[2]" style="max-width: 600px" :data="treeMenuData" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button circle @click="submit(formRef)">提交</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 数据列表 -->
    <el-table :data="tableData.list" style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissionName" label="菜单权限" width="600" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" :icon="Edit" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :current-page="paginationData.pageNum" :page-size="paginationData.pageSize" :size="size"
        :disabled="disabled" background layout="total, prev, pager, next" :total="tableData.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
</template>

<script setup>
import { Edit, Plus } from "@element-plus/icons-vue";
import { userGetmenu, userSetMenu, menuList } from '../../../api'
import { ref, reactive, onMounted, nextTick } from 'vue'

//控制对话框显示与隐藏
const dialogVisible = ref(false)

//表单数据
const form = reactive({
    name: '',
    permissisons: '',
    id: 0
})

//表单dom
const formRef = ref()

//树形控件数据
let treeMenuData = reactive([])

//树形控dom
const treeRef = ref()

//列表数据
const tableData = reactive({
    list: [],
    total: 0
})

//挂载
onMounted(() => {
    //获取树形控件数据
    userGetmenu().then(({ data }) => {
        treeMenuData = data.data
    })
    //获取权限列表
    getListData()
})

//需要校验的表单项
const rules = reactive({
    name: [{ required: true, trigger: 'blur', message: '请输入权限名称' }],
})

//提交表单
const submit = (formEl) => {
    if (!formEl) return
    //表单校验
    formEl.validate((valid) => {
        if (valid) {
            //选中的权限id
            const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
            //新增|修改权限
            userSetMenu({ name: form.name, permissions, id: form.id }).then(({ data }) => {
                //提示用户
                ElMessage.success(data.data)
                //重新渲染列表
                getListData()
            })
            //关闭弹窗
            beforeClose()
        }
    })
}

//分页参数
let paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})

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

//获取权限列表
const getListData = () => {
    menuList(paginationData).then(({ data }) => {
        const { total, list } = data.data
        tableData.total = total
        tableData.list = list
    })
}

//新增和编辑权限
const open = (rowData = {}) => {
    dialogVisible.value = true
    //弹窗打开form生成是异步的
    nextTick(() => {
        if (rowData) {
            Object.assign(form, { id: rowData.id, name: rowData.name })
            treeRef.value.setCheckedKeys(rowData.permission)
        }
    })
}

//关闭弹窗
const beforeClose = () => {
    //重置表单
    formRef.value.resetFields()
    //重置选择的权限
    treeRef.value.setCheckedKeys([4, 5])
    //关闭弹窗
    dialogVisible.value = false
}
</script>

<style lang='less' scoped></style>