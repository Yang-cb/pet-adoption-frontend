<script setup>
import { logout } from '@/utils/request.js'
import router from "@/router/auth-router.js";
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'

//index 就是要跳转的路由
function menuClick(index) {
    router.push(index)
}

function userLogout() {
    logout(() => router.push("/"))
}
</script>

<template>
    <div style="height: 100vh; ">
        <!-- 外层容器。当子元素中包含<el-header>时，全部子元素会垂直上下排列，否则会水平左右排列。 -->
        <el-container class="layout-container-demo" style="height: 100vh">
            <!-- 侧边栏容器 -->
            <el-aside width="200px">
                <!-- 滚动条 -->
                <el-scrollbar>
                    <!-- 根据index默认打开哪个menu -->
                    <el-menu :default-openeds="['1']" @select="menuClick">
                        <el-sub-menu index="1">
                            <template #title>免费领养</template>
                            <el-menu-item index="/index/allPet">全部宠物</el-menu-item>
                            <el-menu-item>aaa</el-menu-item>
                            <el-menu-item index="1-3">狗</el-menu-item>
                            <el-sub-menu index="1-4">
                                <template #title>Option4</template>
                                <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
                            </el-sub-menu>
                        </el-sub-menu>
                        <el-sub-menu index="2">
                            <template #title>
                                <el-icon><icon-menu /></el-icon>发布领养信息
                            </template>
                            <el-menu-item index="/index/publishAdopt">求抱走</el-menu-item>
                            <el-menu-item index="2-2">想领养</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="3">
                            <template #title>
                                <el-icon>
                                    <setting />
                                </el-icon>Navigator Three
                            </template>
                            <el-menu-item-group>
                                <template #title>Group 1</template>
                                <el-menu-item index="3-1">Option 1</el-menu-item>
                                <el-menu-item index="3-2">Option 2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="Group 2">
                                <el-menu-item index="3-3">Option 3</el-menu-item>
                            </el-menu-item-group>
                            <el-sub-menu index="3-4">
                                <template #title>Option 4</template>
                                <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
                            </el-sub-menu>
                        </el-sub-menu>
                    </el-menu>
                </el-scrollbar>
            </el-aside>

            <el-container>
                <!-- 顶栏容器 -->
                <el-header style="text-align: right; font-size: 12px">
                    <div class="toolbar">
                        <!-- 头像 -->
                        <div>
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                        </div>
                        <!-- 昵称 -->
                        <span>Tom</span>
                        <!-- 下拉菜单 -->
                        <el-dropdown>
                            <el-icon style="margin-right: 8px; margin-top: 1px">
                                <setting />
                            </el-icon>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>
                                        <el-button type='' link>编辑个人资料</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button type='' link @click="userLogout">退出登录</el-button>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </el-header>

                <!-- 主要区域容器 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  
<style scoped>
.layout-container-demo .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
    border-right: none;
}

.layout-container-demo .el-main {
    padding: 0;
}

.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
}
</style>