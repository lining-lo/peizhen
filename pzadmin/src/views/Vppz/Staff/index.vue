<template>
    <panel-head :route="route" />
    <!-- 按钮 -->
    <div class="btns">
        <el-button @click="open(null)" type="primary" size="small" :icon="Plus">新增</el-button>
        <el-popconfirm confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" icon-color="#626AEF"
            title="你确认要删除吗?" @confirm="confirmEvent">
            <template #reference>
                <el-button type="danger" size="small" :icon="Delete">删除</el-button>
            </template>
        </el-popconfirm>
    </div>
    <!-- 陪护师列表 -->
    <el-table :data="listData.list" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="avatar" label="头像">
            <template #default="scope">
                <el-image style="width: 50px;height: 50px;" :src="scope.row.avatar" />
            </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别">
            <template #default="scope">
                {{ scope.row.sex === '1' ? '男' : '女' }}
            </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button size="small" type="primary" @click="open(scope.row)">
                    编辑
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :current-page="paginationData.pageNum" :page-size="paginationData.pageSize" :size="size"
        :disabled="disabled" background layout="total, prev, pager, next" :total="listData.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <!-- 添加|修改陪护师的弹窗 -->
    <el-dialog :before-close="beforeClose" v-model="dialogVisible" title="陪护师添加" width="500">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item v-show="false" label="id" prop="id">
                <el-input v-model="form.id" />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-button v-if="!form.avatar" @click="dialogImgVisible = true" type="primary">点击上传</el-button>
                <el-image v-else :src="form.avatar" style="width: 100px;height: 100px;" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option label="男" value="1" />
                    <el-option label="女" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input-number v-model="form.age" :min="18" :max="60" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="是否生效" prop="active">
                <el-radio-group v-model="form.active">
                    <el-radio-button label="失效" :value="0" />
                    <el-radio-button label="生效" :value="1" />
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submit(formRef)">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 选择图片的弹窗 -->
    <el-dialog v-model="dialogImgVisible" title="选择图片" width="680" :before-close="beforeClose">
        <div class="image-list">
            <div v-for="(item, index) in photos" :key="item.name" class="img-box" @click="selectIndex = index">
                <div v-if="selectIndex === index" class="select">
                    <el-icon color="#fff">
                        <Check />
                    </el-icon>
                </div>
                <el-image style="width: 148px; height: 148px" :src="item.url" />
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogImgVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmImage">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import dayjs from 'dayjs';
import { photoList, companion, companionList, deleteCompanion } from "../../../api";
import { Plus, Delete, InfoFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute } from "vue-router";

//获取route实例
const route = useRoute()

//添加陪护师弹窗的显示与隐藏
const dialogVisible = ref(false)

//表单数据
const form = reactive({
    id: 0,
    mobile: '',
    active: 1,
    age: '',
    avatar: '',
    name: '',
    sex: ''
})

//图片列表
const photos = ref([])

//选择图片弹窗的显示与隐藏
const dialogImgVisible = ref(false)

//选中的图片
const selectIndex = ref(0)

//表单校验规则
const rules = reactive({
    name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    avatar: [{ required: true, message: '请选择头像' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }],
})

//表单dom
const formRef = ref()

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

//选中要删除的陪护师
const selectedDel = ref([])

//挂载
onMounted(() => {
    //获取图片列表
    photoList().then(({ data }) => {
        if (data.code === 10000) {
            photos.value = data.data
        }
    })
    //获取陪护师列表
    getListData()
})

//添加|修改陪护师
const open = (rowData = {}) => {
    //打开弹窗
    dialogVisible.value = true
    nextTick(() => {
        //修改陪护师信息
        if (rowData) {
            Object.assign(form, rowData)
        }
    })

}

//选择图片的方法
const confirmImage = () => {
    //获取选中图片
    form.avatar = photos.value[selectIndex.value].url
    //关闭弹窗
    dialogImgVisible.value = false
}

//提交表单
const submit = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            companion(form).then(({ data }) => {
                if (data.code === 10000) {
                    //关闭并清空表单
                    beforeClose()
                    //提示用户
                    ElMessage.success('操作成功')
                    //重新获取陪护师列表
                    getListData()
                } else {
                    ElMessage.error(data.message)
                }
            })
        } else {
            console.log('error submit!')
        }
    })
}

//关闭添加陪护师弹窗
const beforeClose = () => {
    //清空表单
    formRef.value.resetFields()
    //关闭弹窗
    dialogVisible.value = false
}

//获取陪护师列表的方法
const getListData = () => {
    companionList(paginationData).then(({ data }) => {
        const { list, total } = data.data
        list.forEach((item) => {
            item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        })
        listData.list = list
        listData.total = total
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

//获取选中要删除的陪护师
const handleSelectionChange = (val) => {
    selectedDel.value = val.map(item => ({ id: item.id }))
}

//批量删除陪护师列表
const confirmEvent = () => {
    //没有选要删除的
    if (!selectedDel.value.length) {
        return ElMessage.warning('不允许删除空项')
    }
    deleteCompanion({ id: selectedDel.value }).then(({ data }) => {
        if (data.code === 10000) {
            //提示用户
            ElMessage.success('删除成功')
            //重新渲染列表
            getListData()
        }
    })
}
</script>

<style lang='less' scoped>
.btns {
    margin: 10px 0 10px 10px;
}

.image-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .img-box {
        position: relative;

        .select {
            position: absolute;
            left: 0px;
            top: 0px;
            width: 24px;
            height: 24px;
            background-color: #67c23a;
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .el-image {
        margin-right: 10px;
        margin-bottom: 10px;
    }
}
</style>