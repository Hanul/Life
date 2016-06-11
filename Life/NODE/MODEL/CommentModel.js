OVERRIDE(Life.CommentModel, function(origin) {
	'use strict';

	Life.CommentModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			// 인덱싱
			self.getDB().createIndex({
				articleId : 1
			});
			
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
							
							Life.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
								
								data.writerId = sessionKeyData.userId;
								
								next();
							});
						}
					}
					
					return false;
				},
				
				after : function(savedData) {
					
					var
					// start index
					startIndex,
					
					// content
					content = savedData.content;
					
					Life.UserModel.updateNoHistory({
						id : savedData.writerId,
						lastCommentTime : new Date(),
						$inc : {
							commentCount : 1
						}
					});
					
					Life.ArticleModel.updateNoHistory({
						id : savedData.articleId,
						lastCommentTime : new Date(),
						$inc : {
							commentCount : 1
						}
					}, function(articleData) {
						
						if (articleData.writerId !== savedData.writerId) {
							
							Life.NotiModel.create({
								userId : articleData.writerId,
								targetUserId : savedData.writerId,
								type : 'comment',
								targetId : savedData.articleId
							});
						}
					});
					
					REPEAT(content.length + 1, function(i) {
						
						if (startIndex !== undefined && (i === content.length || content[i] === '@' || content[i] === ' ' || content[i] === '\t' || content[i] === '\n' || content[i] === '\r' || content[i] === '<')) {
							
							Life.UserModel.get({
								filter : {
									nickname : content.substring(startIndex, i)
								}
							}, {
								notExists : function() {
									// ignore.
								},
								success : function(userData) {
									
									if (userData.id !== savedData.writerId) {
										
										Life.NotiModel.create({
											userId : userData.id,
											targetUserId : savedData.writerId,
											type : 'tag-comment',
											targetId : savedData.id
										});
									}
								}
							});
						}
						
						if (content[i] === '@') {
							startIndex = i + 1;
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
							
							Life.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
								
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
							
							Life.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
								
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
					
					Life.ArticleModel.updateNoHistory({
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
