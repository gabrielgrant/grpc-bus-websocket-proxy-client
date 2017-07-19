.PHONY: release

release:
	npm version patch
	npm publish

demo : demo/bundle.js

demo/bundle.js : demo/demo.js index.js
	browserify demo/demo.js -o demo/bundle.js

clean:
	rm demo/bundle.js
