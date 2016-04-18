OVERRIDE(GCLife.UserModel, function(origin) {
	'use strict';

	GCLife.UserModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			var
			// login.
			login;
			
			inner.on('create', {

				before : function(data, next, ret) {

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
									
									data.roles = [GCLife.ROLE.USER];
									
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
					
					GCLife.JoinKeyModel.find({
						filter : {
							email : savedData.email
						},
						isFindAll : true
					}, EACH(function(joinKeyData) {
						GCLife.JoinKeyModel.remove(joinKeyData.id);
					}));
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

							GCLife.SessionKeyModel.create({
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
