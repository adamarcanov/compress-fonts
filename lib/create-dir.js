const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

const addIndexToEachDirBranch = (dir, cb) => {
	if ( !fs.existsSync( path.join(dir, 'index.html') ) ) 
		fs.writeFileSync( path.join(dir, 'index.html'), '', (err, data) => console.log(err, data) )
}

module.exports = (_dir, _options) => {
	const _defaults = {
		'generate_indexhtml': false
	}
	const options = Object.assign(_defaults, _options);

	let generateDir = (_dir) => {
		if (!fs.existsSync(_dir)) {
			shell.mkdir('-p', _dir);

			if (options.generate_indexhtml) {
				addIndexToEachDirBranch(_dir)
			}

		} else if (options.generate_indexhtml) {
			addIndexToEachDirBranch(_dir)
		}
	}

	if ( _dir instanceof Array ) {
		for (let i = 0, dirLen = _dir.length; i < dirLen; i++) {
			generateDir(_dir[i])
		}
	} else {
		generateDir(_dir)
	}
}