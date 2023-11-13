import axios from "axios";
import {ElMessage} from "element-plus";

// 指定默认请求路径
const baseURL = "/baseURL";
axios.defaults.baseURL = baseURL

// 默认错误处理
const defaultError = (error) => {
    console.error(error)
    ElMessage.error('请求失败')
}

// 默认失败处理
const defaultFailure = (message, status, url) => {
    console.warn(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`)
    ElMessage.warning(message)
}

// 用户登录数据存储的key
const authItemName = "authorize"

// 储存用户登录数据
function storeAccessToken(remember, token, expire, username) {
    const authObj = {
        token: token,
        expire: expire,
        username: username
    }
    const str = JSON.stringify(authObj)
    // 是否勾选记住我
    if (remember) {
        // 存入localStorage，以后访问也可以用
        localStorage.setItem(authItemName, str)
    } else {
        // 存入sessionStorage，只能在本次会话使用
        sessionStorage.setItem(authItemName, str)
    }
}

// 删除用户登录数据
function deleteAccessToken() {
    localStorage.removeItem(authItemName)
    sessionStorage.removeItem(authItemName)
}

// 获取用户登录数据的token
function takeAccessToken() {
    const str = localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName);
    if (!str) return null
    const authObj = JSON.parse(str)
    if (new Date(authObj.expire) <= new Date()) {
        deleteAccessToken()
        ElMessage.warning("登录状态已过期，请重新登录")
        return null
    }
    return authObj.token
}

// 获取用户登录数据的username
function takeUsername() {
    const str = localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName);
    if (!str) return null
    const authObj = JSON.parse(str)
    if (new Date(authObj.expire) <= new Date()) {
        deleteAccessToken()
        ElMessage.warning("登录状态已过期，请重新登录")
        return null
    }
    return authObj.username
}

function initPost(url, data, headers, success, failure, error = defaultError) {
    axios.post(url, data, {headers: headers}).then(({data}) => {
        if (data.code === 200)
            success(data.data)
        else
            failure(data.message, data.code, url)
    }).catch(err => error(err))
}

function initGet(url, headers, success, failure, error = defaultError) {
    axios.get(url, {headers: headers}).then(({data}) => {
        if (data.code === 200)
            success(data.data)
        else
            failure(data.message, data.code, url)
    }).catch(err => error(err))
}

// 添加请求头
const accessHeader = () => {
    return {
        'Authorization': `Bearer ${takeAccessToken()}`
    }
}

function get(url, success, failure = defaultFailure) {
    initGet(url, accessHeader(), success, failure)
}

function post(url, data, success, failure = defaultFailure) {
    initPost(url, data, accessHeader(), success, failure)
}

// 登录
function login(username, password, remember, success, failure = defaultFailure) {
    initPost('/api/auth/login', {
        username: username,
        password: password
    }, {
        // axios只支持json数据，而security只能表单登录
        'Content-Type': 'application/x-www-form-urlencoded'
    }, (data) => {
        storeAccessToken(remember, data.token, data.expireTime, data.username, data.id)
        ElMessage.success('登录成功')
        success(data)
    }, failure)
}

// 退出登录
function logout(success, failure = defaultFailure) {
    get('/api/auth/logout', () => {
        deleteAccessToken()
        ElMessage.success(`退出登录成功`)
        success()
    }, failure)
}

// 是否已经登录
function unauthorized() {
    return !takeAccessToken()
}

export {post, get, login, logout, unauthorized, takeAccessToken, takeUsername}