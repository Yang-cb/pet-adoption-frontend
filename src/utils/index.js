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

export {base64ToUrl, strToDate, options, handleChange}