GCLife.BoardModel = OBJECT({

	preset : function() {
		'use strict';

		return GCLife.MODEL;
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
					role : GCLife.ROLE.MANAGER
				},
				update : {
					valid : VALID(validDataSet),
					role : GCLife.ROLE.MANAGER
				},
				remove : {
					role : GCLife.ROLE.MANAGER
				}
			}
		};
	}
});
