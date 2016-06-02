OVERRIDE(Life.ArticleLikeModel, function(origin) {
	'use strict';

	Life.ArticleLikeModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			self.getDB().createIndex({
				articleId : 1,
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
									articleId : data.articleId,
									userId : data.userId
								}
							}, function(isExists) {
								
								if (isExists === true) {
									ret({
										validErrors : {
											articleId : {
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
					
					Life.ArticleModel.updateNoHistory({
						id : savedData.articleId,
						$inc : {
							likeCount : 1
						}
					});
				}
			});
			
			inner.on('remove', {
			
				after : function(originData) {
					
					Life.ArticleModel.updateNoHistory({
						id : originData.articleId,
						$inc : {
							likeCount : -1
						}
					});
				}
			});
		}
	});
});
