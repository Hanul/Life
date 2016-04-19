OVERRIDE(GCLife.ArticleModel, function(origin) {
	'use strict';

	GCLife.ArticleModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			inner.on('create', {
			
				before : function(data, next, ret, clientInfo) {
					
					var
					// cookies
					cookies;
					
					if (data.content === undefined) {
						data.html = undefined;
					} else {
						data.html = Markdown.MarkUp(data.content);
					}
					
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
					
					GCLife.BoardModel.updateNoHistory({
						id : savedData.boardId,
						lastArticleTime : new Date(),
						$inc : {
							articleCount : 1
						}
					});
				}
			});
			
			inner.on('update', {
			
				before : function(data, next, ret, clientInfo) {
					
					var
					// cookies
					cookies;
					
					if (data.content === TO_DELETE) {
						data.html = TO_DELETE;
					} else if (data.content !== undefined) {
						data.html = Markdown.MarkUp(data.content);
					}
					
					if (clientInfo === undefined) {
						next();
					}
					
					else if (clientInfo.headers !== undefined && clientInfo.headers.cookie !== undefined) {
						cookies = PARSE_COOKIE_STR(clientInfo.headers.cookie);
						
						if (cookies['session-key'] !== undefined) {
							
							GCLife.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
								
								self.get(data.id, function(savedData) {
									
									if (data.writerId === sessionKeyData.userId) {
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
					
					GCLife.BoardModel.updateNoHistory({
						id : savedData.boardId,
						$inc : {
							articleCount : -1
						}
					});
				}
			});
		}
	});
});
