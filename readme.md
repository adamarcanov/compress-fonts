# usage in file
run with babel-node

import compressFonts from '@offactory/compress-fonts'

compressFonts({ src: join(__dirname, 'assets', 'fonts-raw'), dist: join(__dirname, 'assets', 'fonts') })

// add to package.json
"shelljs": "^0.8.5"