GCLife.SessionKeyModel = OBJECT({

	preset : function() {
		'use strict';

		return GCLife.MODEL;
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
			
			sessionKey : {
				notEmpty : true,
				array : true
			}
		};

		return {
			name : 'SessionKey',
			methodConfig : {
				create : false,
				update : {
					valid : VALID(validDataSet),
					authKey : 'userId',
					role : GCLife.ROLE.USER
				},
				remove : false
			}
		};
	}
});
