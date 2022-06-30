const ChapterContent = require('../model/ChapterContent');
const Chapter = require("../model/Chapter");

try{
  // Chapter.create({
  //   ChapterContents:[{content:"斗罗大陆"}]
  // },{
  //   include: [ ChapterContent ]  //关系表
  // })
  ChapterContent.create({
    content:"描述描述",
    chapter_id: 1
  })
}catch(err){
  console.log(err);
}