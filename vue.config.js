module.exports = {
    //  配置反向代理
    devServer:{
        proxy:{
            //方式二:可以将开头部分去除掉
            "/back":{
                target:"http://localhost:9090/",
                changeOrigin:true,
                pathRewrite:{
                    //要替换数据(支持正则表达式) : 替换为数据
                    "^/back":""
                    //  ^ 为以什么开头,替换成空字符串
                }
            }
        }
    }
}
