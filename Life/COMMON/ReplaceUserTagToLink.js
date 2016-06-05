Life.ReplaceUserTagToLink = METHOD({
	
	run : function(content, callback) {
		//REQUIRED: content
		//REQUIRED: callback
		
		var
		// index
		i = 0, startIndex,
		
		// run.
		run;
		
		run = function() {
			
			startIndex = undefined;
			
			for (; i < content.length + 1; i += 1) {
				
				if (startIndex !== undefined && (i === content.length || content[i] === '@' || content[i] === ' ' || content[i] === '\t' || content[i] === '\n' || content[i] === '\r' || content[i] === '<')) {
					
					Life.UserModel.get({
						filter : {
							nickname : content.substring(startIndex, i)
						}
					}, {
						notExists : function() {
							run();
						},
						success : function(userData) {
							
							var
							// replace content
							replaceContent = '<a href="/user/' + userData.id + '">' + userData.nickname + '</a>';
							
							content = content.substring(0, startIndex - 1) + replaceContent + (i < content.length ? content.substring(i) : '');
							
							i += replaceContent.length - (i - startIndex) - 1;
							
							run();
						}
					});
					
					return;
				}
				
				if (i < content.length && content[i] === '@') {
					startIndex = i + 1;
				}
			}
			
			callback(content);
		};
		
		run();
	}
});