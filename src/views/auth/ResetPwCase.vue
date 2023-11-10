<script setup>
import {reactive, ref} from "vue";
import {ChatDotSquare, Lock, Message, RefreshRight} from "@element-plus/icons-vue";
import {get, post} from "@/api/request.js";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";

const form = reactive({
  email: '',
  code: '',
  password: '',
  password_repeat: '',
})


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
  email: [
    {required: true, message: '请输入邮件地址', trigger: 'blur'},
    {type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change']}
  ],
  code: [
    {required: true, message: '请输入获取的验证码', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 16, message: '密码的长度必须在6-16个字符之间', trigger: ['blur']}
  ],
  password_repeat: [
    {validator: validatePassword, trigger: ['blur', 'change']},
  ],
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
  get(`/api/auth/sendEmail?email=${form.email}&type=resetPw`, () => {
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

// 重置密码
const resetPw = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      post('/api/auth/resetPw', {
        email: form.email,
        code: form.code,
        password: form.password
      }, () => {
        ElMessage.success('重置成功')
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
      <div style="font-size: 25px;font-weight: bold">重置密码</div>
    </div>
    <div style="margin-top: 30px">
      <el-form :model="form" :rules="rules" @validate="onValidate" ref="formRef">
        <el-form-item prop="email">
          <el-input v-model="form.email" type="email" placeholder="电子邮件地址">
            <template #prefix>
              <el-icon>
                <Message/>
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
                    <ChatDotSquare/>
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
        <el-form-item prop="password">
          <el-input v-model="form.password" :maxlength="16" type="password" placeholder="新密码">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password_repeat">
          <el-input v-model="form.password_repeat" :maxlength="16" type="password" placeholder="再次输入密码">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top: 20px">
      <el-button style="width: 360px" type="primary" @click="resetPw" plain>
        <el-icon>
          <RefreshRight/>
        </el-icon>
        重置密码
      </el-button>
    </div>
    <el-row style="margin-top: 50px">
      <el-button type='' link @click="router.push('/')">返回登陆</el-button>
    </el-row>
  </div>
</template>