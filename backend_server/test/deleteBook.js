const Book = require("../model/Book");
const Chapter = require("../model/Chapter");

try{
  Chapter.destroy({
    where:{
        _id: 1
    }
});
}catch(err){
  console.log(err);
}