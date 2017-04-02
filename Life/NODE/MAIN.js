Life.MAIN = METHOD({

	run : function(addRequestListener, addPreprocessor) {
		'use strict';
		
		var
		//IMPORT: Less
		Less = require('less');
		
		addRequestListener(NSP.Bridge({
			rootPath : './Life/view',
			restURI : ['account/create', 'board', 'article', 'user', 'account/reset-password', 'account/verify-email']
		}).requestListener);
		
		addPreprocessor({
			extension : 'less',
			preprocessor : function(content, response) {
				
				Less.render(content, function(error, output) {
					response({
						content : output.css,
						contentType : 'text/css',
						version : CONFIG.version
					});
				});
			}
		});
		
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
