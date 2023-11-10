<script lang="ts" setup>
import {logout} from '@/api/request.js'
import router from "@/router/index.js";
import {ref} from 'vue'
import {Location, Setting, Menu} from '@element-plus/icons-vue'

// 菜单是否收起
const isCollapse = ref(false)

// 退出登录
function userLogout() {
  logout(() => router.push("/"))
}
</script>

<template>
  <div style="height: 100vh; ">
    <!-- 外层容器。当子元素中包含<el-header>时，全部子元素会垂直上下排列，否则会水平左右排列。 -->
    <el-container class="layout-container-demo" style="height: 100vh">
      <!-- 顶栏容器 -->
      <el-header>
        <!-- 收起菜单-->
        <el-radio-group v-model="isCollapse" style="height: 100%;">
          <el-radio-button :label="!isCollapse">
            <el-icon>
              <Menu/>
            </el-icon>
          </el-radio-button>
        </el-radio-group>
        <div class="toolbar">

          <!-- 头像 -->
          <div>
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
          </div>
          <!-- 昵称 -->
          <span>Tom</span>
          <!-- 下拉菜单 -->
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting/>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button type='' link @click="router.push('/personalData')">编辑个人资料</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type='' link @click="userLogout">退出登录</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container>
        <!-- 侧边栏容器 -->
        <el-aside :width="isCollapse?'64px':'200px'">
          <!-- 滚动条 -->
          <el-scrollbar>
            <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
                :collapse-transition="false"
                router
            >
              <el-sub-menu index="1">
                <template #title>
                  <el-icon>
                    <location/>
                  </el-icon>
                  <span>Navigator One</span>
                </template>
                <el-menu-item-group>
                  <template #title><span>Group One</span></template>
                  <el-menu-item index="/index/allPB">全部宠物</el-menu-item>
                  <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                  <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
              <el-sub-menu index="2">
                <template #title>
                  <el-icon>
                    <location/>
                  </el-icon>
                  <span>发布领养信息</span>
                </template>
                <el-menu-item index="/index/publishAway">求抱走</el-menu-item>
                <el-menu-item index="/index/publishAdopt">想领养</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>

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
  float: right;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}

.el-aside {
  transition: width 0.25s;
  -webkit-transition: width 0.25s;
  -moz-transition: width 0.25s;
  -o-transition: width 0.25s;
}
</style>