Life.ResetEmailKeyModel = OBJECT({

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
			},
			
			email : {
				notEmpty : true,
				email : true
			}
		};

		return {
			name : 'ResetEmailKey',
			methodConfig : {
				create : false,
				update : false,
				remove : false
			}
		};
	}
});
