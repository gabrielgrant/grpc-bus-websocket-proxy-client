demo : demo/bundle.js

demo/bundle.js : demo/demo.js
	browserify demo/demo.js -o demo/bundle.js

clean:
	rm demo/bundle.js
