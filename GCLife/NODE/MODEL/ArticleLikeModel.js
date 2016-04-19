OVERRIDE(GCLife.ArticleLikeModel, function(origin) {
	'use strict';

	GCLife.ArticleLikeModel = OBJECT({

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
					
					GCLife.ArticleModel.updateNoHistory({
						id : savedData.articleId,
						$inc : {
							likeCount : 1
						}
					});
				}
			});
			
			inner.on('remove', {
			
				after : function(originData) {
					
					GCLife.ArticleModel.updateNoHistory({
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
