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

			boardId : {
				notEmpty : true,
				id : true
			},

			categoryId : {
				id : true
			},

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
				size : {
					max : 3000
				}
			},
			
			html : true,
			
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
			},
			
			likeCount : {
				notEmpty : true,
				integer : true
			}
		};

		return {
			name : 'Article',
			initData : {
				viewCount : 0,
				commentCount : 0,
				likeCount : 0
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
