Life.SessionKeyModel = OBJECT({

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
			}
		};

		return {
			name : 'SessionKey',
			methodConfig : {
				create : false,
				update : false,
				remove : false
			}
		};
	}
});
