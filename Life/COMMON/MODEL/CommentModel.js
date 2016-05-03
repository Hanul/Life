Life.CommentModel = OBJECT({

	preset : function() {
		'use strict';

		return Life.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {

			writerId : {
				notEmpty : true,
				id : true
			},
			
			articleId : {
				notEmpty : true,
				id : true
			},
			
			content : {
				notEmpty : true,
				size : {
					max : 1000
				}
			},
			
			likeCount : {
				notEmpty : true,
				integer : true
			}
		};

		return {
			name : 'Comment',
			initData : {
				likeCount : 0
			},
			methodConfig : {
				create : {
					valid : VALID(validDataSet)
				},
				update : {
					valid : VALID(validDataSet)
				}
			}
		};
	}
});
