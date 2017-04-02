OVERRIDE(Life.ChatModel, function(origin) {
	'use strict';

	Life.ChatModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			var
			// connection store
			connectionStore = Life.SHARED_STORE('connectionStore');
			
			// 초기화
			connectionStore.save({
				id : 'connectionCount',
				data : {
					count : 0
				}
			});
			
			inner.on('create', {
			
				before : function(data, next, ret, clientInfo) {
					
					if (data.writerId !== undefined) {
						
						Life.UserModel.get(data.writerId, function(userData) {
							
							data.writerNickname = userData.nickname;
							data.writerIconFileId = userData.iconFileId;
							
							next();
						});
					}
					
					return false;
				}
			});
			
			Life.ROOM(self.getName(), function(clientInfo, on) {
				
				// 새로운 클라이언트 접속 시 count를 1 올림
				connectionStore.update({
					id : 'connectionCount',
					data : {
						$inc : {
							count : 1
						}
					}
				});
				
				connectionStore.get('connectionCount', (connectionCountInfo) => {
					
					// 새 클라이언트가 접속했음을 모든 클라이언트에 알림
					Life.BROADCAST({
						roomName : self.getName(),
						methodName : 'clientConnected',
						data : connectionCountInfo.count
					});
				});

				// 클라이언트와의 접속이 끊어질 경우
				on('__DISCONNECTED', function() {
					
					// count를 1 내림
					connectionStore.update({
						id : 'connectionCount',
						data : {
							$inc : {
								count : -1
							}
						}
					});
					
					connectionStore.get('connectionCount', (connectionCountInfo) => {
						
						// 클라이언트가 접속을 끊었음을 모든 클라이언트에 알림
						Life.BROADCAST({
							roomName : self.getName(),
							methodName : 'clientDisconnected',
							data : connectionCountInfo.count
						});
					});
				});
				
				// 접속중인 클라이언트 수 전송
				on('getConnectionCount', function(notUsing, ret) {
					connectionStore.get('connectionCount', (connectionCountInfo) => {
						ret(connectionCountInfo.count);
					});
				});
			});
		}
	});
});
