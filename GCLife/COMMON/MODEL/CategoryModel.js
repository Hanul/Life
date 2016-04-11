GCLife.CategoryModel = OBJECT({

	preset : function() {
		'use strict';

		return GCLife.MODEL;
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
