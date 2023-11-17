import {regionData, codeToText} from 'element-china-area-data'

// base64转url
const base64ToUrl = (base64) => {
    return 'data:image/png;base64,' + base64
}

// 日期str转Date
const strToDate = (dateStr) => {
    return new Date(dateStr)
}

// 选择地区
const options = regionData

const handleChange = (selectedOptions) => {
    let location = "";
    for (let i = 0; i < selectedOptions.length; i++) {
        location += codeToText[selectedOptions[i]];
    }
    console.log(location)//打印区域码所对应的属性值即中文地址
    return location;
}

// 获取宠物图片路径
function getPetImageUrl(name) {
    return new URL(`../assets/images/pet/${name}`, import.meta.url).href;
}


// 获取用户图片路径
function getAccImageUrl(name) {
    return new URL(`../assets/images/acc/${name}`, import.meta.url).href;
}

export {base64ToUrl, strToDate, options, handleChange, getPetImageUrl, getAccImageUrl}