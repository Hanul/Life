Life.CategoryModel = OBJECT({

	preset : function() {
		'use strict';

		return Life.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {

			boardId : {
				notEmpty : true,
				id : true
			},
			
			category : {
				notEmpty : true,
				size : {
					max : 255
				}
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
			name : 'Category',
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
