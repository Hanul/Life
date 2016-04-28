OVERRIDE(GCLife.CommentLikeModel, function(origin) {
	'use strict';

	GCLife.CommentLikeModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
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
								
								GCLife.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
									
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
					
					GCLife.CommentModel.updateNoHistory({
						id : savedData.commentId,
						$inc : {
							likeCount : 1
						}
					});
				}
			});
			
			inner.on('remove', {
			
				after : function(originData) {
					
					GCLife.CommentModel.updateNoHistory({
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
