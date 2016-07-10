OVERRIDE(Life.ArticleModel, function(origin) {
	'use strict';

	Life.ArticleModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			// 인덱싱
			self.getDB().createIndex({
				boardId : 1
			});
			
			inner.on('create', {
			
				before : function(data, next, ret, clientInfo) {
					
					var
					// cookies
					cookies;
					
					NEXT([
					function(next) {
						
						if (data.content === undefined) {
							data.html = undefined;
							next();
						} else {
							Life.ReplaceUserTagToLink(Markdown.MarkUp(data.content), function(html) {
								data.html = html;
								next();
							});
						}
					},
					
					function() {
						return function() {
							
							if (clientInfo === undefined) {
								next();
							}
							
							else if (clientInfo.headers !== undefined && clientInfo.headers.cookie !== undefined) {
								cookies = PARSE_COOKIE_STR(clientInfo.headers.cookie);
								
								next();
							}
						};
					}]);
					
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
						lastArticleTime : new Date(),
						$inc : {
							articleCount : 1
						}
					});
					
					Life.BoardModel.updateNoHistory({
						id : savedData.boardId,
						lastArticleTime : new Date(),
						$inc : {
							articleCount : 1
						}
					});
					
					if (savedData.categoryId !== undefined) {
						Life.CategoryModel.updateNoHistory({
							id : savedData.categoryId,
							lastArticleTime : new Date(),
							$inc : {
								articleCount : 1
							}
						});
					}
					
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
											type : 'tag-article',
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
					
					NEXT([
					function(next) {
						
						if (data.content === TO_DELETE) {
							data.html = TO_DELETE;
							next();
						} else if (data.content !== undefined) {
							Life.ReplaceUserTagToLink(Markdown.MarkUp(data.content), function(html) {
								data.html = html;
								next();
							});
						} else {
							next();
						}
					},
					
					function() {
						return function() {
							
							if (clientInfo === undefined) {
								next();
							}
							
							else if (clientInfo.headers !== undefined && clientInfo.headers.cookie !== undefined) {
								cookies = PARSE_COOKIE_STR(clientInfo.headers.cookie);
								
								if (cookies['session-key'] !== undefined) {
									
									Life.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
										
										self.get(data.id, function(savedData) {
											
											if (data.writerId === sessionKeyData.userId) {
												next();
											} else {
												Life.UserModel.get(sessionKeyData.userId, function(userData) {
													if (CHECK_IS_IN({
														array : userData.roles,
														value : Life.ROLE.MANAGER
													}) === true) {
														next();
													}
												});
											}
										});
									});
								}
							}
						};
					}]);
						
					return false;
				},
				
				after : function(savedData, originData) {
					
					Life.BoardModel.updateNoHistory({
						id : savedData.boardId,
						$inc : {
							articleCount : 1
						}
					});
					
					Life.BoardModel.updateNoHistory({
						id : originData.boardId,
						$inc : {
							articleCount : -1
						}
					});
					
					if (savedData.categoryId !== undefined) {
						Life.CategoryModel.updateNoHistory({
							id : savedData.categoryId,
							$inc : {
								articleCount : 1
							}
						});
					}
					
					if (originData.categoryId !== undefined) {
						Life.CategoryModel.updateNoHistory({
							id : originData.categoryId,
							$inc : {
								articleCount : -1
							}
						});
					}
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
				
				after : function(originData) {
					
					Life.BoardModel.updateNoHistory({
						id : originData.boardId,
						$inc : {
							articleCount : -1
						}
					});
					
					if (originData.categoryId !== undefined) {
						Life.CategoryModel.updateNoHistory({
							id : originData.categoryId,
							$inc : {
								articleCount : -1
							}
						});
					}
				}
			});
		}
	});
});
