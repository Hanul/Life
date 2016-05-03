Life.CommentLikeModel = OBJECT({

	preset : function() {
		'use strict';

		return Life.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {

			commentId : {
				notEmpty : true,
				id : true
			},

			userId : {
				notEmpty : true,
				id : true
			}
		};

		return {
			name : 'CommentLike',
			methodConfig : {
				create : {
					valid : VALID(validDataSet)
				},
				update : false,
				remove : false
			}
		};
	}
});
