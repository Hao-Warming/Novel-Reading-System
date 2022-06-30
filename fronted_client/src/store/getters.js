const getters = {
  user: state => state.user.user,
  typeListObj: state => state.book.typeListObj,
  bookObj: state => state.book.bookObj,
  otherBookData: state => state.book.otherBookData,
  chapterObj: state => state.book.chapterObj,
  chapterDetail: state => state.book.chapterDetail,
  bookSelves: state => state.book.bookSelves,
  commentList: state => state.book.commentList,
  replyList: state => state.book.replyList,
}
export default getters