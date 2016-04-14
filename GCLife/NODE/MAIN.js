GCLife.MAIN = METHOD({

	run : function(addRequestListener) {
		'use strict';
		
		var
		// nsp core
		nspCore = NSP({
			rootPath : './GCLife/view',
			restURI : ['account/create']
		});
		
		addRequestListener(nspCore.requestListener);
		
		UMAIL.CONNECT_TO_MAIL_SERVER({
			host : 'smtp.gmail.com',
			port : 465,
			isSecure : true,
			username : NODE_CONFIG.GCLife.email,
			password : NODE_CONFIG.GCLife.emailPassword
		}, function(sendMail) {
			GCLife.sendMail = sendMail;
		});
	}
});
