GCLife.CommentModel = OBJECT({

	preset : function() {
		'use strict';

		return GCLife.MODEL;
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
			}
		};

		return {
			name : 'Comment',
			methodConfig : {
				create : {
					valid : VALID(validDataSet),
					authKey : 'writerId',
					role : GCLife.ROLE.USER
				},
				update : {
					valid : VALID(validDataSet),
					authKey : 'writerId',
					role : GCLife.ROLE.USER
				},
				remove : {
					authKey : 'writerId',
					role : GCLife.ROLE.USER
				}
			}
		};
	}
});
