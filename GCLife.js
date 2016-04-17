require(process.env.UPPERCASE_PATH + '/BOOT.js');

BOOT({
	CONFIG : {
		isDevMode : true,
		defaultBoxName : 'GCLife',
		title : '겜창인생',
		description : '게임을 창작하는 아름다운 인생..',
		webServerPort : 8410
	},
	NODE_CONFIG : {
		isNotUsingCPUClustering : true,
		dbName : 'GCLife-test',
		GCLife : {
			email : 'gclife.net@gmail.com',
			emailPassword : 'test'
		}
	}
});
