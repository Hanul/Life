Life.MAIN = METHOD({

	run : function(addRequestListener) {
		'use strict';
		
		var
		// nsp core
		nspCore = NSP({
			rootPath : './Life/view',
			restURI : ['account/create', 'board', 'article', 'user']
		});
		
		addRequestListener(nspCore.requestListener);
		
		UMAIL.CONNECT_TO_MAIL_SERVER({
			host : 'smtp.gmail.com',
			port : 465,
			isSecure : true,
			username : NODE_CONFIG.Life.email,
			password : NODE_CONFIG.Life.emailPassword
		}, function(sendMail) {
			Life.sendMail = sendMail;
		});
	}
});
