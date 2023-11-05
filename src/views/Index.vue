<script setup>
import { logout } from '@/utils/request.js'
import router from "@/router/auth-router.js";

function userLogout() {
    logout(() => router.push("/"))
}
</script>

<template>
    <div>
        <el-button @click="userLogout">退出登录</el-button>
    </div>
</template>
  
<style scoped></style>