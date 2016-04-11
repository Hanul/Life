GCLife.MAIN = METHOD({

	run : function(addRequestListener) {
		'use strict';
		
		var
		// nsp core
		nspCore = NSP({
			rootPath : './GCLife/view'
		});
		
		addRequestListener(nspCore.requestListener);
	}
});
