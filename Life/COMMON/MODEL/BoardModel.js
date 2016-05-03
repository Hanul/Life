Life.BoardModel = OBJECT({

	preset : function() {
		'use strict';

		return Life.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {

			name : {
				notEmpty : true,
				size : {
					max : 255
				}
			},
			
			description : {
				size : {
					max : 3000
				}
			},
			
			html : true,
			
			index : {
				real : true
			},
			
			lastArticleTime : {
				date : true
			},
			
			articleCount : {
				notEmpty : true,
				integer : true
			}
		};

		return {
			name : 'Board',
			initData : {
				articleCount : 0
			},
			methodConfig : {
				create : {
					valid : VALID(validDataSet),
					role : Life.ROLE.MANAGER
				},
				update : {
					valid : VALID(validDataSet),
					role : Life.ROLE.MANAGER
				},
				remove : {
					role : Life.ROLE.MANAGER
				}
			}
		};
	}
});
