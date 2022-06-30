const Book = require('../model/Book');

Book.findOne({
  where: {
      bookName:'斗罗大陆V重生唐三 ',
      author: '唐家三少'
  }
}).then(res=>{
  console.log(res);
})