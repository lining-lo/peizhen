<template>
    <template v-for="(item, index) in props.menuData">
        <el-menu-item v-if="!item.children || item.children.length === 0"
            @click="handleClick(item, `${props.index}-${item.meta.id}`)" :index="`${props.index}-${item.meta.id}`">
            <el-icon size="20">
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.name }}</span>
        </el-menu-item>

        <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
            <template #title>
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.name }}</span>
            </template>
            <TreeMenu :menuData="item.children" :index="`${props.index}-${item.meta.id}`" />
        </el-sub-menu>
    </template>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

//父传子的数据
const props = defineProps(['menuData', 'index'])

//创建router实例
const router = useRouter()

//创建store实例
const store = useStore()

//菜单点击事件
const handleClick = (item, index) => {
    //添加tag
    store.commit('addMenu', item.meta)
    //更新选中的菜单高亮
    store.commit('updateMenuActive', index)
    //跳转
    router.push(item.meta.path)
}

</script>
<style lang='less' scoped></style>