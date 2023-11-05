<script setup>
import { ref } from "vue";
import { User, Lock, Position } from '@element-plus/icons-vue'
import { login } from '@/utils/request.js'
import router from "@/router/auth-router.js";

const form = ref({
    username: '',
    password: '',
    remember: false
})

const rule = {
    username: [
        { required: true, message: '请输入用户名' }
    ],
    password: [
        { required: true, message: '请输入密码' }
    ]
}

const formRef = ref()

function userLogin() {
    formRef.value.validate((isValid) => {
        if (isValid) {
            login(form.value.username, form.value.password, form.value.remember, () => router.push('/index'))
        }
    });
}
</script>

<template>
    <div style="text-align: center;margin: 0 20px">
        <div style="margin-top: 150px">
            <div style="font-size: 25px;font-weight: bold">登录</div>
            <div style="font-size: 14px;color: grey">在进入系统之前请先输入用户名和密码进行登录</div>
        </div>
        <div style="margin-top: 50px">
            <el-form :model="form" :rules="rule" ref="formRef">
                <el-form-item prop="username">
                    <el-input v-model="form.username" maxlength="10" type="text" placeholder="用户名">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" maxlength="20" style="margin-top: 10px"
                        placeholder="密码">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-row style="margin-top: 5px">
                    <el-col :span="12" style="text-align: left">
                        <el-form-item>
                            <el-checkbox v-model="form.remember" name="remember-me" label="记住我" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-link @click="router.push('/resetPw')">忘记密码？</el-link>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div style="margin-top: 40px">
            <el-button @click="userLogin()" style="width: 270px" type="success" plain><el-icon>
                    <Position />
                </el-icon>立即登录</el-button>
        </div>
        <el-divider>
            <span style="color: grey;font-size: 13px">没有账号</span>
        </el-divider>
        <div>
            <el-button @click="router.push('/register')" style="width: 270px" type="warning" plain>注册账号</el-button>
        </div>
    </div>
</template>
