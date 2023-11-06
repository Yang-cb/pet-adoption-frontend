<script setup>
import { ChatDotSquare, Lock, Message, User, Connection } from "@element-plus/icons-vue";
import router from "@/router/auth-router.js";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { get, post } from "@/utils/request.js";

const form = reactive({
    username: '',
    password: '',
    password_repeat: '',
    email: '',
    code: ''
})

const validateUsername = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入用户名'))
    } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('用户名不能包含特殊字符，只能是中文/英文'))
    } else {
        callback()
    }
}

const validatePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== form.password) {
        callback(new Error("两次输入的密码不一致"))
    } else {
        callback()
    }
}

const rules = {
    username: [
        { validator: validateUsername, trigger: ['blur', 'change'] },
        { min: 2, max: 8, message: '用户名的长度必须在2-8个字符之间', trigger: ['blur', 'change'] },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '密码的长度必须在6-16个字符之间', trigger: ['blur', 'change'] }
    ],
    password_repeat: [
        { validator: validatePassword, trigger: ['blur', 'change'] },
    ],
    email: [
        { required: true, message: '请输入邮件地址', trigger: 'blur' },
        { type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change'] }
    ],
    code: [
        { required: true, message: '请输入获取的验证码', trigger: 'blur' },
    ]
}

const formRef = ref()
const isEmailValid = ref(false)
const coldTime = ref(0)

const onValidate = (prop, isValid) => {
    if (prop === 'email')
        isEmailValid.value = isValid
}

// 发送验证码
const validateEmail = () => {
    coldTime.value = 60
    get(`/api/auth/sendEmail?email=${form.email}&type=register`, () => {
        ElMessage.success(`验证码已发送`)
        const handle = setInterval(() => {
            coldTime.value--
            if (coldTime.value === 0) {
                clearInterval(handle)
            }
        }, 1000)
    }, undefined, (message) => {
        ElMessage.warning(message)
        coldTime.value = 0
    })
}

// 注册
const register = () => {
    formRef.value.validate((isValid) => {
        if (isValid) {
            post('/api/auth/register', {
                username: form.username,
                password: form.password,
                email: form.email,
                code: form.code
            }, () => {
                ElMessage.success('注册成功，请登录')
                router.push("/")
            })
        } else {
            ElMessage.warning('请完整填写注册内容')
        }
    })
}
</script>


<template>
    <div style="text-align: center;margin: 0 20px">
        <div>
            <div style="font-size: 25px;font-weight: bold">注册新用户</div>
        </div>
        <div style="margin-top: 30px">
            <el-form :model="form" :rules="rules" @validate="onValidate" ref="formRef">
                <el-form-item prop="username">
                    <el-input v-model="form.username" :maxlength="8" type="text" placeholder="用户名">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" :maxlength="16" type="password" placeholder="密码">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password_repeat">
                    <el-input v-model="form.password_repeat" :maxlength="16" type="password" placeholder="重复密码">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="form.email" type="email" placeholder="电子邮件地址">
                        <template #prefix>
                            <el-icon>
                                <Message />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-row :gutter="10" style="width: 100%">
                        <el-col :span="17">
                            <el-input v-model="form.code" :maxlength="6" type="text" placeholder="请输入验证码">
                                <template #prefix>
                                    <el-icon>
                                        <ChatDotSquare />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-col>
                        <el-col :span="5" style="margin-left: 3px;">
                            <!--邮箱正确，验证码操作不在冷却，可以获取验证码  -->
                            <el-button type="success" @click="validateEmail" :disabled="!isEmailValid || coldTime > 0">
                                {{ coldTime > 0 ? coldTime + ' 秒后获取' : '获取验证码' }}
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin-top: 20px">
            <el-button style="width: 360px" type="primary" @click="register" plain><el-icon>
                    <Connection />
                </el-icon>立即注册</el-button>
        </div>
        <el-row style="margin-top: 50px">
            <el-button type='' link @click="router.push('/')">返回登陆</el-button>
        </el-row>
    </div>
</template>

<style scoped></style>