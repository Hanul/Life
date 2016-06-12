Life.ChatModel = OBJECT({

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
			
			writerNickname : {
				size : {
					min : 2,
					max : 20
				}
			},
			
			writerIconFileId : {
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
			name : 'Chat',
			isNotUsingHistory : true,
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
