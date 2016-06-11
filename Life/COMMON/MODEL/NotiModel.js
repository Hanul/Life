Life.NotiModel = OBJECT({

	preset : function() {
		'use strict';

		return Life.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {

			userId : {
				notEmpty : true,
				id : true
			},
			
			targetUserId : {
				notEmpty : true,
				id : true
			},
			
			type : {
				notEmpty : true,
				one : [
				'comment',
				'like-article',
				'liek-comment',
				'tag-article',
				'tag-comment']
			},
			
			targetId : {
				id : true
			}
		};

		return {
			name : 'Noti',
			isNotUsingHistory : true,
			methodConfig : {
				create : {
					valid : VALID(validDataSet),
					role : Life.ROLE.ADMIN
				},
				update : false,
				remove : false
			}
		};
	}
});