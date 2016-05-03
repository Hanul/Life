require(process.env.UPPERCASE_PATH + '/BOOT.js');

BOOT({
	BROWSER_CONFIG : {
		beforeUnloadMessage : '페이지를 이동하려 합니다. <확인>을 누르면 새로고침되오니, 작성중인 글이 있으신 경우엔 <취소>를 눌러주시기 바랍니다.\n\n* 실시간 서버가 재시작 되었거나 인터넷이 재연결 된 것일 수 있습니다.'
	},
	CONFIG : {
		isDevMode : true,
		defaultBoxName : 'Life',
		title : 'Life CMS',
		webServerPort : 8410
	},
	NODE_CONFIG : {
		maxUploadFileMB : 200,
		isNotUsingCPUClustering : true,
		dbName : 'Life-test',
		Life : {
			email : 'test@test.test',
			emailPassword : 'test'
		}
	}
});
