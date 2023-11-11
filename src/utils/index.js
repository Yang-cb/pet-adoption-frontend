// base64转url
const base64ToUrl = (base64) => {
    return 'data:image/png;base64,' + base64
}

// 日期str转Date
const strToDate = (dateStr) => {
    return new Date(dateStr)
}

export {base64ToUrl, strToDate}