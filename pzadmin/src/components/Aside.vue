<template>
    <el-menu :collapse="isCollapse" :style="{ width: isCollapse ? '64px' : '230px' }" active-text-color="#ffd04b"
        background-color="#545c64" class="aside-container" :default-active="active" text-color="#fff" >
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

//动态菜单数据
const menuData = computed(() => store.state.menu.routerList)

//菜单展开与折叠
const isCollapse = computed(() => store.state.menu.isCollapse)

//选中菜单高亮
const active = computed(()=> store.state.menu.menuActive)

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