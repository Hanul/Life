OVERRIDE(GCLife.CommentModel, function(origin) {
	'use strict';

	GCLife.CommentModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			inner.on('create', {
			
				before : function(data, next, ret, clientInfo) {
					
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
								
								data.writerId = sessionKeyData.userId;
								
								next();
							});
						}
					}
					
					return false;
				},
				
				after : function(savedData) {
					
					GCLife.ArticleModel.updateNoHistory({
						id : savedData.articleId,
						lastCommentTime : new Date(),
						$inc : {
							commentCount : 1
						}
					});
				}
			});
			
			inner.on('update', {
			
				before : function(data, next, ret, clientInfo) {
					
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
								
								self.get(data.id, function(savedData) {
									
									if (savedData.writerId === sessionKeyData.userId) {
										next();
									}
								});
							});
						}
					}
					
					return false;
				}
			});
			
			inner.on('remove', {
			
				before : function(id, next, ret, clientInfo) {
					
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
								
								self.get(id, function(savedData) {
									
									if (savedData.writerId === sessionKeyData.userId) {
										next();
									}
								});
							});
						}
					}
					
					return false;
				},
				
				after : function(savedData) {
					
					GCLife.ArticleModel.updateNoHistory({
						id : savedData.articleId,
						$inc : {
							commentCount : -1
						}
					});
				}
			});
		}
	});
});
