Life.ResetPasswordKeyModel = OBJECT({

	preset : function() {
		'use strict';

		return Life.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {

			usetId : {
				id : true,
				notEmpty : true
			}
		};

		return {
			name : 'ResetPasswordKey',
			methodConfig : {
				create : false,
				update : false,
				remove : false
			}
		};
	}
});
