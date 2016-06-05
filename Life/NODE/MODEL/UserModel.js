OVERRIDE(Life.UserModel, function(origin) {
	'use strict';

	Life.UserModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			var
			// login.
			login;
			
			// 인덱싱
			self.getDB().createIndex({
				nickname : 1
			});
			
			inner.on('create', {

				before : function(data, next, ret) {
					
					if (data.intoduce === undefined) {
						data.html = undefined;
					} else {
						data.html = Markdown.MarkUp(data.intoduce);
					}

					self.checkIsExists({
						filter : {
							username : data.username
						}
					}, function(isExists) {

						if (isExists === true) {

							ret({
								validErrors : {
									username : {
										type : 'existed'
									}
								}
							});

						} else {

							self.checkIsExists({
								filter : {
									nickname : data.nickname
								}
							}, function(isExists) {
		
								if (isExists === true) {
		
									ret({
										validErrors : {
											nickname : {
												type : 'existed'
											}
										}
									});
		
								} else {
									
									data.password = SHA256({
										key : data.username,
										password : data.password
									});
									
									// 보안상 삭제
									delete data.isBanned;
									delete data.isLeft;
									
									data.roles = [Life.ROLE.USER];
									
									next();
								}
							});
						}
					});

					return false;
				},

				after : function(savedData) {

					// 보안상 삭제
					delete savedData.password;
					
					Life.JoinKeyModel.find({
						filter : {
							email : savedData.email
						},
						isFindAll : true
					}, EACH(function(joinKeyData) {
						Life.JoinKeyModel.remove(joinKeyData.id);
					}));
				}
			});
			
			inner.on('update', {
			
				before : function(data, next, ret, clientInfo) {
					
					var
					// cookies
					cookies;
					
					if (data.intoduce === undefined) {
						data.html = undefined;
					} else {
						data.html = Markdown.MarkUp(data.intoduce);
					}
					
					// 보안상 삭제
					delete data.email;
					delete data.isBanned;
					delete data.isLeft;
					
					NEXT([
					function(next) {
						
						if (clientInfo === undefined) {
							next();
						}
						
						else if (clientInfo.headers !== undefined && clientInfo.headers.cookie !== undefined) {
							cookies = PARSE_COOKIE_STR(clientInfo.headers.cookie);
							
							if (cookies['session-key'] !== undefined) {
								
								Life.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
									
									if (data.id === sessionKeyData.userId) {
										next();
									}
								});
							}
						}
					},
					
					function() {
						return function() {
							
							self.get(data.id, function(userData) {
								
								NEXT([
								function(next) {
									
									// 아이디가 기존과 같고 비밀번호만 바꾸는 경우
									if (data.username === userData.username) {
										
										if (data.password !== undefined) {
										
											data.password = SHA256({
												key : userData.username,
												password : data.password
											});
										}
			
										next();
									}
									
									// 아이디를 변경하는 경우
									else if (data.username !== undefined) {
			
										self.checkIsExists({
											filter : {
												username : data.username
											}
										}, function(isExists) {
			
											if (isExists === true) {
			
												ret({
													validErrors : {
														username : {
															type : 'existed'
														}
													}
												});
			
											} else if (isExists === false) {
												
												// 비밀번호도 바꾸는 경우
												if (data.password !== undefined) {
													data.password = SHA256({
														key : data.username,
														password : data.password
													});
												}
			
												next();
											}
										});
									}
									
									// 아이디 변경 없이 비밀번호만 바꾸는 경우
									else if (data.password !== undefined) {
										
										data.password = SHA256({
											key : userData.username,
											password : data.password
										});
										
										next();
									}
									
									// 아이디 비밀번호 변경이 아닌 경우
									else {
										next();
									}
								},
								
								function(next) {
									return function() {
										
										if (data.nickname !== undefined && data.nickname !== userData.nickname) {
											
											self.checkIsExists({
												filter : {
													nickname : data.nickname
												}
											}, function(isExists) {
						
												if (isExists === true) {
						
													ret({
														validErrors : {
															nickname : {
																type : 'existed'
															}
														}
													});
						
												} else {
													next();
												}
											});
										}
										
										else {
											next();
										}
									};
								},
								
								function() {
									return function() {
										
										if (data.iconFileId !== undefined) {
											
											IMAGEMAGICK_RESIZE({
												srcPath : '__RF/Life/' + data.iconFileId,
												distPath : '__RF/Life/ICON/' + data.iconFileId,
												width : 40,
												height : 40
											}, next);
										}
										
										else {
											next();
										}
									};
								}]);
							});
						};
					}]);
					
					return false;
				},

				after : function(savedData) {

					// 보안상 삭제
					delete savedData.password;
				}
			});
			
			inner.on('get', function(savedData) {
				
				// 보안상 삭제
				delete savedData.password;
			});
			
			inner.on('find', EACH(function(savedData) {
				
				// 보안상 삭제
				delete savedData.password;
			}));
			
			self.login = login = function(params, callbacks) {
				//REQUIRED: params
				//REQUIRED: params.username
				//REQUIRED: params.password
				//REQUIRED: callbacks
				//REQUIRED: callbacks.notValid
				//REQUIRED: callbacks.success
				
				self.get({
					filter : {
						username : params.username,
						password : SHA256({
							key : params.username,
							password : params.password
						})
					}
				}, {
					notExists : function() {
						callbacks.notValid();
					},
					success : function(userData) {

						var
						// key
						key;
						
						// 탈퇴 유저는 로그인 불가
						if (userData.isLeft === true) {
							
							callbacks.notValid();
							
						} else {

							Life.SessionKeyModel.create({
								userId : userData.id
							}, function(sessionKeyData) {

								self.updateNoHistory({
									id : userData.id,
									lastLoginTime : new Date(),
									$inc : {
										loginCount : 1
									}
								}, function(savedData) {
									callbacks.success(savedData, sessionKeyData.id);
								});
							});
						}
					}
				});
			};
		}
	});
});
