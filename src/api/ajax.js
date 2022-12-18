// ajax请求函数模块，向外暴露一个ajax请求函数

// 引入axios发送ajax请求
import axios from 'axios'

// 请求三要素：url、请求参数、请求类型
export default function ajax(url,data={},type='GET'){
    // 返回值：promise对象（异步返回的数据是response.data）
    return new Promise(function (resolve, reject) {
        // 异步执行ajax请求
        let promise
        if (type === 'GET') {
          // 准备url query参数数据
          let dataStr = '' //数据拼接字符串
          Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&'
          })
          if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
            url = url + '?' + dataStr
          }
          // 发送get请求
          promise = axios.get(url)
        } else {
          // 发送post请求
          promise = axios.post(url, data)
        }

        promise.then(response => {
            // 成功了调用resolve
          resolve(response.data)
        })
          .catch(error => {
            // 失败了调用resolve
            reject(error)
          })
      })
}