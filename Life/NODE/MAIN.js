Life.MAIN = METHOD({

	run : function(addRequestListener) {
		'use strict';
		
		var
		//IMPORT: Less
		Less = require('less'),
		
		// nsp core
		nspCore = NSP({
			rootPath : './Life/view',
			restURI : ['account/create', 'board', 'article', 'user']
		});
		
		addRequestListener(nspCore.requestListener);
		
		RESOURCE_SERVER.addPreprocessor({
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
		
		// 나중에 지울것
		Life.CategoryModel.find(EACH(function(categoryData) {
			Life.ArticleModel.count({
				filter : {
					categoryId : categoryData.id
				}
			}, function(count) {
				Life.CategoryModel.updateNoHistory({
					id : categoryData.id,
					articleCount : count
				});
			});
		}));
		
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
