<template>
    <el-menu :collapse="isCollapse" :style="{ width: isCollapse ? '64px' : '230px' }" active-text-color="#ffd04b"
        background-color="#545c64" class="aside-container" default-active="2" text-color="#fff" @open="handleOpen"
        @close="handleClose">
        <p class="logo-lg">{{ isCollapse?'DIDI':'DIDI陪诊' }}</p>
        <TreeMenu :menuData :index="1" />
    </el-menu>
</template>

<script setup>
import TreeMenu from './TreeMenu.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
import { ref, reactive, computed } from 'vue'

//获取路由
const router = useRouter()
//获取vuex仓库
const store = useStore()

const menuData = reactive(router.options.routes[0].children)
const isCollapse = computed(() => store.state.menu.isCollapse)

</script>
<style lang='less' scoped>
.aside-container {
    height: 100%;

    .logo-lg {
        font-size: 20px;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #fff;
    }
}
</style>