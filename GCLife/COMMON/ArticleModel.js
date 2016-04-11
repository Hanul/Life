GCLife.ArticleModel = OBJECT({

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
			
			title : {
				notEmpty : true,
				size : {
					max : 255
				}
			},
			
			content : {
				notEmpty : true,
				size : {
					max : 3000
				}
			},
			
			viewCount : {
				notEmpty : true,
				integer : true
			},
			
			lastViewTime : {
				date : true
			},
			
			commentCount : {
				notEmpty : true,
				integer : true
			},
			
			lastCommentTime : {
				date : true
			}
		};

		return {
			name : 'Article',
			initData : {
				viewCount : 0,
				commentCount : 0
			},
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
