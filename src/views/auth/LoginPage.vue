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
        <div>
            <div style="font-size: 25px;font-weight: bold">登录</div>
        </div>
        <div style="margin-top: 30px">
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
                    <el-input v-model="form.password" type="password" maxlength="20" placeholder="密码">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <div style="margin: 20px 0">
                    <el-button @click="userLogin()" style="width: 360px" type="primary" plain><el-icon>
                            <Position />
                        </el-icon>立即登录</el-button>
                </div>
                <el-row style="margin-top: 50px;">
                    <el-col :span="12" style="text-align: left;margin-top: 5px">
                        <el-button type='' link @click="router.push('/register')">注册</el-button><span>|</span>
                        <el-button type='' link @click="router.push('/resetPw')">忘记密码</el-button>
                    </el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-checkbox v-model="form.remember" name="remember-me" label="记住我" />
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
