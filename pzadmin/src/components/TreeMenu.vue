<template>
    <template v-for="(item, index) in props.menuData">
        <el-menu-item v-if="!item.children || item.children.length === 0" :index="`${props.index}-${index}`">
            <el-icon size="20">
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{item.meta.name}}</span>
        </el-menu-item>

        <el-sub-menu v-else :index="`${props.index}-${index}`">
            <template #title>
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{item.meta.name}}</span>
            </template>
            <TreeMenu :menuData="item.children" :index="`${props.index}-${index}`"/>
        </el-sub-menu>
    </template>
</template>

<script setup>
import { ref, reactive } from 'vue'
const props = defineProps(['menuData', 'index'])

</script>
<style lang='less' scoped></style>