<script setup>

</script>

<template>
    <div style="width: 100vw;height: 100vh;overflow: hidden;display: flex;justify-content:center;
            		align-items:center;background-color:darkgray;">
        <div class="auth-card">
            <router-view v-slot="{ Component }">
                <transition name="el-fade-in-linear" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<style scoped>
.auth-card {
    width: 400px;
    height: fit-content;
    z-index: 1;
    background-color: var(--el-bg-color);
    padding: 20px 0;
    border-radius: 20px;
}

.welcome-title {
    position: absolute;
    bottom: 30px;
    left: 30px;
    color: white;
    text-shadow: 0 0 10px black;
}
</style>