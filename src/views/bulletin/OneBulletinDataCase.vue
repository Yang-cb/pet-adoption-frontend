<template>
  <div>
    <!--  主体  -->
    <div class="b_main">
      <div>
        <h1>{{ pBData.title }}</h1>
      </div>
      <el-row>
        <el-col :span="12">
          <!-- 图片 -->
          <div style="width: 315px; height: 315px">
            <el-image style="width: 100%" v-bind:src="pBData.picName"
                      :preview-src-list="srcList"
                      @click="preview(pBData.picName)"
            >
              <template #error>
                <div style="width: 100%;height: 100%">
                  <el-icon>
                    <icon-picture/>
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </el-col>
        <el-col :span="12">
          <!-- 资料 -->
          <div>
            <div>
              <el-tag v-if="pBData.isFree===1" style="font-size: 14px">免费</el-tag>
              <el-tag v-else type="danger" style="font-size: 14px">付费</el-tag>
              <span v-if="pBData.isFree===1" style="color: brown">【免费领养不要相信任何费用先付的骗术】</span>
            </div>
            <p class="text"><span class="icon"><el-icon><Sugar/></el-icon></span>
              <span class="text_title">宠物姓名</span>：
              {{ getName(pBData.petName) }}
            </p>
            <p class="text"><span class="icon"><el-icon><Calendar/></el-icon></span>
              <span class="text_title">发布时间</span>：
              {{ pBData.gmtModified }}
            </p>
            <p class="text"><span class="icon"><el-icon><Postcard/></el-icon></span>
              <span class="text_title">宠物种类</span>：
              {{ getType(pBData.petType) }} ({{ pBData.petSex === 1 ? '公' : '母' }})
            </p>
            <p class="text"><span class="icon"><el-icon><Location/></el-icon></span>
              <span class="text_title">领养地点</span>：
              {{ pBData.location }}
            </p>
            <p class="text"><span class="icon"><el-icon><User/></el-icon></span>
              <span class="text_title">联系人</span>：
              {{ pBData.contactsName }}
            </p>
            <p class="text"><span class="icon"><el-icon><Phone/></el-icon></span>
              <span class="text_title">联系电话</span>：
              {{ pBData.contactsPhone }}
            </p>
            <p class="text"><span class="icon"><el-icon><ChatDotRound/></el-icon></span>
              <span class="text_title">微信号</span>：
              {{ getWechat(pBData.contactsWechat) }}
            </p>
            <p class="text"><span class="icon"><el-icon><Message/></el-icon></span>
              <span class="text_title">电子邮件</span>：
              {{ getEmail(pBData.contactsEmail) }}
            </p>
          </div>
          <!-- 按钮 -->
          <el-row>
            <!-- 收藏 -->
            <!-- 根据用户是否已经收藏该宠物，决定展示哪个图标 -->
            <div>
              <!-- 收藏 -->
              <el-button v-show="!isCollect" round @click="collectPB" class="bu_text">
                <el-icon>
                  <Star/>
                </el-icon>
                {{ !collect ? '点击收藏' : '取消收藏' }}
              </el-button>
              <!-- 取消收藏 -->
              <el-button v-show="isCollect" round style="margin-left: 3px;" @click="collectPB" class="bu_text">
                <el-icon>
                  <Star/>
                </el-icon>
                {{ collect ? '点击收藏' : '取消收藏' }}
              </el-button>
            </div>
            <div>
              <el-button round class="bu_text" @click="wantAdoptFormVisible = true">
                <el-icon>
                  <Plus/>
                </el-icon>
                我想领养它
              </el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
      <!-- 详细介绍 -->
      <div class="b_text">
        {{ pBData.text }}
        <p style="color: red">安全提示：请不要相信任何需要金钱交易的无偿领养！例如宠物免费，骗取运费等常见骗术！</p>
      </div>
    </div>
  </div>
  <!-- 填写领养信息弹窗 -->
  <el-dialog v-model="wantAdoptFormVisible" title="领养信息">
    <el-form style="width: 90%;" ref="formRef" :model="wantAdoptForm" :rules="rules" label-width="150px"
             class="demo-ruleForm"
             status-icon>
      <div style="position: relative">
        <el-form-item label="我的详细地址" prop="lastLocation">
          <el-input v-model="wantAdoptForm.lastLocation" placeholder="请输入详细地址，右侧可快速选择"/>
        </el-form-item>
        <el-cascader placeholder="请选择"
                     style="width: 0; position: absolute; top: 0; right: 44px;"
                     :options="options"
                     v-model="wantAdoptForm.firstLocation"
                     @change="locHandleChange(wantAdoptForm.firstLocation)">
        </el-cascader>
      </div>
      <el-form-item label="联系人" prop="contactsName">
        <el-input minlength="1" maxlength="5" v-model="wantAdoptForm.contactsName"/>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactsPhone">
        <el-input minlength="11" maxlength="11" v-model="wantAdoptForm.contactsPhone"/>
      </el-form-item>
      <el-form-item label="微信号" prop="contactsWechat">
        <el-input maxlength="11" v-model="wantAdoptForm.contactsWechat" placeholder="可不填"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="contactsEmail">
        <el-input minlength="6" v-model="wantAdoptForm.contactsEmail" placeholder="可不填"/>
      </el-form-item>
      <el-form-item label="领养条件" prop="text">
        <el-input maxlength="300" v-model="wantAdoptForm.text" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                  placeholder="请详细描述领养条件及家中宠物信息, 内容不得超过300字"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="wantAdoptFormVisible = false">取消</el-button>
        <el-button @click="resetForm()">重置</el-button>
        <el-button type="primary" @click="submitForm()">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {get, post, takeAccId} from '@/api/request.js'
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {
  Calendar,
  ChatDotRound,
  Location, Message, Phone,
  Picture as IconPicture, Plus,
  Postcard,
  Star, Sugar,
  User
} from '@element-plus/icons-vue'
import {reactive, ref} from "vue";
import {getPetImageUrl, options, handleChange} from "@/utils";

// 图片预览
const srcList = ref([]);
const preview = (photo) => {
  // 清除原本的预览
  srcList.value = [];
  srcList.value.push(photo);
}

// 表单选择地址并赋值给表单
const locHandleChange = (locArr) => {
  wantAdoptForm.lastLocation = handleChange(locArr);
}

const wantAdoptFormVisible = ref(false)

const wantAdoptForm = reactive({
  firstLocation: '', // 地址选择片段
  lastLocation: '', // 地址输入片段
  contactsName: '', // 联系人
  contactsPhone: '',  // 电话
  contactsWechat: '', // 微信
  contactsEmail: '', // 邮箱
  text: '' // 领养条件
})

const formRef = ref()

// 提交我想领养表单
const submitForm = async () => {
  await formRef.value.validate((valid) => {
    if (valid) {
      post('/api/wantAdopt/addWantAdopt', {
        accountId: takeAccId(),
        petId: route.query.petId,
        wantContactsLocation: wantAdoptForm.lastLocation,
        wantContactsName: wantAdoptForm.contactsName,
        wantContactsPhone: wantAdoptForm.contactsPhone,
        wantContactsWechat: wantAdoptForm.contactsWechat,
        wantContactsEmail: wantAdoptForm.contactsEmail,
        wantText: wantAdoptForm.text
      }, () => {
        ElMessage.success('发布成功')
        resetForm()
        wantAdoptFormVisible.value = false
      })
    } else {
      ElMessage.warning('请完整填写表单内容')
    }
  })
}

// 重置表单数据
const resetForm = () => {
  formRef.value.resetFields();
}


const pBData = ref([])

const collect = ref(false)

// 收藏/取消收藏
const collectPB = () => {
  post('/api/collectBul/collectPB', {
    accId: takeAccId(),
    petId: route.query.petId
  }, () => {
    ElMessage.success('操作成功')
    collect.value = !collect.value
  }, (err) => {
    ElMessage.error(err)
  })
}

// 获取跳转页面传来的数据
const route = useRoute();
get('/api/pet/getPBByPetId?petId=' + route.query.petId, (data) => {
  data.picName = getPetImageUrl(data.picName)
  console.log(data)
  pBData.value = data
}, (err) => {
  ElMessage.error(err)
})

// 该用户是否已收藏该宠物
const isCollect = ref(false)
const getIsCollect = () => {
  get('/api/collectBul/isCollect?accId=' + takeAccId() + '&petId=' + route.query.petId, (data) => {
    isCollect.value = data
  }, (err) => {
    console.log(err)
  })
}
getIsCollect()

// 种类
const getType = (petType) => {
  if (petType === 'other' || petType === '' || petType === null) {
    return '其他'
  }
  return petType === 'dog' ? '狗狗' : '猫猫'
}

// 微信
const getWechat = (wechat) => {
  if (wechat === null || wechat === '')
    return '未知'
  return wechat
}

// 邮箱
const getEmail = (email) => {
  if (email === null || email === '')
    return '未知'
  return email
}

// 宠物姓名
const getName = (name) => {
  if (name === null || name === '')
    return '未知'
  return name
}

const rules = {
  lastLocation: [
    {required: true, message: '请输入详细地址', trigger: 'change'},
    {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'blur'}
  ],
  contactsName: [
    {required: true, message: '请输入联系人', trigger: 'change'},
    {pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'blur'}
  ],
  contactsPhone: [
    {required: true, message: '请输入手机号', trigger: 'change',},
    {pattern: '^1[3456789]\\d{9}$', message: '请输入合法的手机号', trigger: 'blur'}
  ],
  contactsWechat: [
    {pattern: "^[a-zA-Z][a-zA-Z0-9_-]{5,19}$", message: '请输入合法的微信号', trigger: 'blur'}
  ],
  contactsEmail: [
    {type: 'email', message: '请输入合法的电子邮件地址', trigger: 'blur'}
  ],
  text: [
    {required: true, message: '请详细描述领养条件及家中宠物信息', trigger: 'blur'}
  ],
}
</script>

<style>
.b_main {
  height: 100vh;
  margin: 0 76px;
  padding: 0 72px;
}

.b_text {
  height: 300px;
  padding: 28px;
  font-size: 15px;
  text-indent: 2em;
  margin-top: 50px;
  box-shadow: var(--el-box-shadow-light);
}

.icon {
  margin-right: 10px;
  vertical-align: middle;
}

.text {
  margin: 10px 0;
  font-size: 15px;
}

.bu_text {
  margin-bottom: 3px;
}

.text_title {
  display: inline-block;
  width: 80px;
  text-align: center;
  font-weight: bold;
}
</style>