// const https = require('https');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const axios = require('axios');
const tunnel = require('tunnel');
const redisHelpter = require('../redis')

//使用本地ip发送请求(UTF-8)
const request = async function(url){
    let result = await axios(url,{
        encoding : null,
        timeout: 10000,
        responseType: "arraybuffer" 
    })
    .then(res=> {
        //获取当前网页的charset
        let reg = /[text\/html; charset=]/g;
        let charset = res.headers['content-type'].replace(reg,'');
        //避免乱码(因为暂时只爬取“开心代理”一个网页，所以就写死为UTF-8)
        var html = iconv.decode(res.data, 'UTF-8');
        var $ = cheerio.load(html, {
            decodeEntities: false
        });
        return {
            $,
            html,
            charset
        }
    }).catch(err=> {
        console.log('报错了');
        return '网页访问失败：' + err;
    });
    return result;
};

//使用本地ip发送请求(GBK)
const request2 = async function(url){
    let result = await axios(url,{
        encoding : null,
        timeout: 10000,
        responseType: "arraybuffer" 
    })
    .then(res=> {
        //获取当前网页的charset
        let reg = /[text\/html; charset=]/g;
        let charset = res.headers['content-type'].replace(reg,'');
        //避免乱码(因为暂时只爬取“开心代理”一个网页，所以就写死为UTF-8)
        var html = iconv.decode(res.data, 'GBK');
        var $ = cheerio.load(html, {
            decodeEntities: false
        });
        return {
            $,
            html,
            charset
        }
    }).catch(err=> {
        console.log('报错了');
        return '网页访问失败：' + err;
    });
    return result;
}

// let arr = [
//     {host:'47.103.18.139',port: '7890'},
//     {host:'182.34.206.193',port: '25624'},
//     {host:'114.99.108.233',port: '31985'},
//     {host:'180.108.253.89',port: '39070'},
//     {host:'114.99.108.229',port: '31985'},
// ]

//使用代理ip发送请求
const proxyRequest = async function(url, host, port){
    let result = await axios(url,{
        // proxy: false,
        timeout: 10000,
        httpAgent: tunnel.httpOverHttp({proxy: {host, port}}),   //https
        httpsAgent: tunnel.httpsOverHttp({proxy: {host, port}}), //http
        responseType: "arraybuffer" 
    })
    .then(res=> {
        //获取当前网页的charset
        let reg = /[text/html; charset=]/g;
        let charset = res.headers['content-type'].replace(reg,'');
        //避免乱码
        var html = iconv.decode(res.data, charset.toLowerCase() == "utf-8"|| charset.toLowerCase() == '' ? 'UTF-8' : 'GBK'); 
        var $ = cheerio.load(html, {
            decodeEntities: false
        });
        return {
            $,
            html
        }
    }).catch(err=> {
        return '代理ip挂了'
    });
    return result;
};

//整合请求方法(后面都是调用该方法)
const request3 = async function(url, isProxy){
    let redisArr = [];
    if(isProxy){
        //使用代理
        let redis = await redisHelpter.get('KXproxy'); //暂时先写死，只爬取开心代理
        if(!redis){
            throw '代理池还没数据';
        }
        redisArr = JSON.parse(redis);
    }
    let result = isProxy? axios(url,{
        proxy: false,
        timeout: 10000,
        httpAgent: tunnel.httpOverHttp({proxy: {host:redisArr[0].host, port:redisArr[0].port}}),   //https
        httpsAgent: tunnel.httpsOverHttp({proxy: {host:redisArr[0].host, port:redisArr[0].port}}), //http
        responseType: "arraybuffer" 
    }) : axios(url,{
        encoding : null,
        timeout: 10000,
        responseType: "arraybuffer" 
    });
    return result.then(res=> {
        //获取当前网页的charset
        let reg = /[text/html; charset=]/g;
        let charset = res.headers['content-type'].replace(reg,'');
        //避免乱码
        var html = iconv.decode(res.data, charset.toLowerCase() == "utf-8"|| charset.toLowerCase() == '' ? 'UTF-8' : 'GBK'); 
        var $ = cheerio.load(html, {
            decodeEntities: false
        });
        return {
            $,
            html
        }
    }).catch(err=> {
        throw '查不到数据'
    });
}

module.exports = {
    proxyRequest,
    request,
    request2,
    request3
}

