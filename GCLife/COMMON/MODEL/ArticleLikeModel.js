GCLife.ArticleLikeModel = OBJECT({

	preset : function() {
		'use strict';

		return GCLife.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {

			articleId : {
				notEmpty : true,
				id : true
			},

			userId : {
				notEmpty : true,
				id : true
			}
		};

		return {
			name : 'ArticleLike',
			methodConfig : {
				create : false,
				update : false,
				remove : false
			}
		};
	}
});
