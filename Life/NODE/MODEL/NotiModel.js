OVERRIDE(Life.NotiModel, function(origin) {
	'use strict';

	Life.NotiModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			// 인덱싱
			self.getDB().createIndex({
				userId : 1
			});
		}
	});
});
