const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
// const cluster = require('cluster');
// const cpuNums = require('os').cpus().length;  //系统的CPU个数
const {website,category} = require('../../config/spider/quanbenConfig');
const {proxyRequest} = require('../../util/request.js');
const {sleep} = require('../../util/util.js')


/**
 * 获取所有分类的所有页面信息
 */
const getAllCategory = async function(){
    for(let i = 0; i < category.length; i++){
        parseSigleCategory(website + category[i], host, port,1);   //返回一个表示单个分类的所有页面信息的数据结构
    }
}

/**
 * 获取单个分类的所有页面信息
 * @param {*} url   分类url
 * @param {*} limit 表示限制页数
 * @param {*} isMax 表示是否使用最大页数，开启的话忽略limit，默认为false
 */
const getSigleCategory = async function(url, host, port,limit = 20,isMax = false){
    try{
        const { $ } = await proxyRequest(url, host, port);
        let count = Number($(".pagelink").find('a').last().text());  //单个分类的总页数
        if(limit > count || isMax){
            //如果入参limit大于总页数，按总页数来爬取
            limit = count;
        }
        for(let i = 1;i <= limit; i++){
            //单个分类中循环每个页面
            let targetUrl = url.substring(0, url.length - 2) + i + '/';
            //获取每页所有的小说目录链接
            let arr = await getSiglePageAllDirs(targetUrl);
            //歇一会再爬...
            sleep(3000);
              
        }
    }catch(err){
        console.log('访问单个分类服务失败:'+ err);
    }
    
}


//获取单个分类页面的所有小说目录链接
const getSiglePageAllDirs = async function(targetUrl, host, port){
    try{
        const { $ } = await proxyRequest(targetUrl, host, port);
        const text = $('.uplist').html();
        //正则匹配目录链接
        let reg = /https:\/\/www.qb5.tw\/book_\d+\//g;
        //去重
        let filterArr = Array.from(new Set(text.match(reg)))
        return filterArr;
    }catch(err){
        console.log("获取小说目录异常");
    }
};

// getSigleCategory('https://www.qb5.tw/fenlei/1_2/')

module.exports = {
    getAllCategory,
    getSigleCategory,
}