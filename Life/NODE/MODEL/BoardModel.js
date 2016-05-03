OVERRIDE(Life.BoardModel, function(origin) {
	'use strict';

	Life.BoardModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			var
			// move up.
			moveUp,
			
			// move down.
			moveDown;
			
			inner.on('create', {
			
				before : function(data, next) {
					
					if (data.description === undefined) {
						data.html = undefined;
					} else {
						data.html = Markdown.MarkUp(data.description);
					}
					
					self.get({
						sort : {
							index : -1
						}
					}, {
						notExists : function() {
							data.index = 0;
							next();
						},
						success : function(lastData) {
							data.index = lastData.index + 1;
							next();
						}
					});
					
					return false;
				}
			});
			
			inner.on('update', {
			
				before : function(data, next, ret, clientInfo) {
					
					if (data.description === undefined) {
						data.html = undefined;
					} else {
						data.html = Markdown.MarkUp(data.description);
					}
					
					if (clientInfo !== undefined) {
						delete data.index;
					}
				}
			});
			
			self.moveUp = moveUp = function(id, callback) {
				//REQUIRED: id
				//REQUIRED: callback
			
				self.get(id, function(savedData) {
					
					self.get({
						filter : {
							index : {
								$lt : savedData.index
							}
						},
						sort : {
							index : -1
						}
					}, {
						notExists : callback,
						success : function(upData) {
							
							var
							// up index
							upIndex = upData.index;
							
							self.updateNoHistory({
								id : upData.id,
								index : savedData.index
							});
							
							self.updateNoHistory({
								id : savedData.id,
								index : upIndex
							});
							
							callback();
						}
					});
				});
			};
				
			self.moveDown = moveDown = function(id, callback) {
				//REQUIRED: id
				//REQUIRED: callback
				
				self.get(id, function(savedData) {
					
					self.get({
						filter : {
							index : {
								$gt : savedData.index
							}
						},
						sort : {
							index : 1
						}
					}, {
						notExists : callback,
						success : function(downData) {
							
							var
							// down index
							downIndex = downData.index;
							
							self.updateNoHistory({
								id : downData.id,
								index : savedData.index
							});
							
							self.updateNoHistory({
								id : savedData.id,
								index : downIndex
							});
							
							callback();
						}
					});
				});
			};
		}
	});
});
