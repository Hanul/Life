OVERRIDE(Life.CommentLikeModel, function(origin) {
	'use strict';

	Life.CommentLikeModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			self.getDB().createIndex({
				commentId : 1,
				userId : 1
			});
			
			inner.on('create', {
			
				before : function(data, next, ret, clientInfo) {
					
					NEXT([
					function(next) {
						
						var
						// cookies
						cookies;
						
						if (clientInfo === undefined) {
							next();
						}
						
						else if (clientInfo.headers !== undefined && clientInfo.headers.cookie !== undefined) {
							cookies = PARSE_COOKIE_STR(clientInfo.headers.cookie);
							
							if (cookies['session-key'] !== undefined) {
								
								Life.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
									
									data.userId = sessionKeyData.userId;
									
									next();
								});
							}
						}
					},
					
					function() {
						return function() {
							
							self.checkIsExists({
								filter : {
									commentId : data.commentId,
									userId : data.userId
								}
							}, function(isExists) {
								
								if (isExists === true) {
									ret({
										validErrors : {
											commentId : {
												type : 'existed'
											}
										}
									});
								} else {
									next();
								}
							});
						};
					}]);
					
					return false;
				},
				
				after : function(savedData) {
					
					Life.CommentModel.updateNoHistory({
						id : savedData.commentId,
						$inc : {
							likeCount : 1
						}
					}, function(commentData) {
						
						if (commentData.writerId !== savedData.userId) {
							
							Life.NotiModel.create({
								userId : commentData.writerId,
								targetUserId : savedData.userId,
								type : 'like-comment',
								targetId : commentData.id
							});
						}
					});
				}
			});
			
			inner.on('remove', {
			
				after : function(originData) {
					
					Life.CommentModel.updateNoHistory({
						id : originData.commentId,
						$inc : {
							likeCount : -1
						}
					});
				}
			});
		}
	});
});
