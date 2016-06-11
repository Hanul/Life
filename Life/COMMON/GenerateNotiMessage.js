Life.GenerateNotiMessage = METHOD({

	run : function(notiData, callback) {
		//REQUIRED: notiData
		//REQUIRED: callback

		if (notiData.type === 'comment') {

			Life.UserModel.get(notiData.targetUserId, function(targetUserData) {
				Life.ArticleModel.get(notiData.targetId, function(articleData) {
					callback('/board/all/' + articleData.id, targetUserData.nickname + '님이 [' + articleData.title + ']에 댓글을 남겼습니다.');
				});
			});
		}
		
		else if (notiData.type === 'like-article') {

			Life.UserModel.get(notiData.targetUserId, function(targetUserData) {
				Life.ArticleModel.get(notiData.targetId, function(articleData) {
					callback('/board/all/' + articleData.id, targetUserData.nickname + '님이 [' + articleData.title + ']을 좋아합니다.');
				});
			});
		}
		
		else if (notiData.type === 'like-comment') {

			Life.UserModel.get(notiData.targetUserId, function(targetUserData) {
				Life.CommentModel.get(notiData.targetId, function(commentData) {
					callback('/board/all/' + commentData.articleId, targetUserData.nickname + '님이 댓글 [' + commentData.content + ']을 좋아합니다.');
				});
			});
		}
		
		else if (notiData.type === 'tag-article') {

			Life.UserModel.get(notiData.targetUserId, function(targetUserData) {
				Life.ArticleModel.get(notiData.targetId, function(articleData) {
					callback('/board/all/' + articleData.id, targetUserData.nickname + '님이 [' + articleData.title + ']에 나를 태그했습니다.');
				});
			});
		}
		
		else if (notiData.type === 'tag-comment') {

			Life.UserModel.get(notiData.targetUserId, function(targetUserData) {
				Life.CommentModel.get(notiData.targetId, function(commentData) {
					callback('/board/all/' + commentData.articleId, targetUserData.nickname + '님이 댓글 [' + commentData.content + ']에 나를 태그했습니다.');
				});
			});
		}
	}
}); 