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
					
					if (clientInfo !== undefined && clientInfo.headers !== undefined && clientInfo.headers.cookie !== undefined) {
						cookies = PARSE_COOKIE_STR(clientInfo.headers.cookie);
						
						if (cookies['session-key'] !== undefined) {
							
							GCLife.SessionKeyModel.get(cookies['session-key'], function(sessionKeyData) {
								GCLife.UserModel.get(sessionKeyData.userId, function(userData) {
									
									if (userData.id === data.writerId) {
										next();
									}
								});
							});
						}
					}
					
					return false;
				}
			});
		}
	});
});
