import * as commentRepo from "../db/comment.repo";

export const commentLikes = async (userId: number, commentId: number, likesStatus: boolean): Promise<boolean> => {
  const data = {
    userId,
    commentId,
  };
  try {
    const alreadyLikes = await commentRepo.alreadyLikesComment(commentId);
    console.log("alreadyLikeszzz : ", alreadyLikes);
    // 좋아요 하지 않은 게시물이라면 좋아요
    if (!likesStatus && !alreadyLikes) {
      await commentRepo.likeCommentFromUser(data);

      // 아래 변수명에 포인트 적립여부가 담겨있음
      const alreadySavePoint = await commentRepo.findSavedPointByComment(userId, commentId);

      // 첫번째 좋아요라 포인트적립이 되지 않았을 경우 적립
      if (!alreadySavePoint && alreadySavePoint.userId !== userId) {
        await commentRepo.savePointByComment(data);
      }
      return true; // 좋아요
    } else {
      await commentRepo.unlikeCommentFromUser(userId, commentId);
      return false; // 취소
    }
  } catch (err) {
    throw Error(err);
  }
};