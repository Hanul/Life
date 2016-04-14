GCLife.JoinKeyModel = OBJECT({

	preset : function() {
		'use strict';

		return GCLife.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {

			email : {
				notEmpty : true,
				email : true
			}
		};

		return {
			name : 'JoinKey',
			methodConfig : {
				create : false,
				update : false,
				remove : false
			}
		};
	}
});
