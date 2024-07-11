const fs = require('fs')
const { readdirSync, statSync } = fs
const path = require('path')
const { join } = path

module.exports = dir => {
    const filesList = []

    const readDir = dir => {
        const files = readdirSync( dir )
        files.map( file => { 
            const filePath = join(dir, file)
            const stats = statSync(filePath)
            if ( stats.isDirectory() ) {
                readDir(filePath)
            } else {
                filesList.push(filePath)
            }
        })
    }
    readDir(dir)

    return filesList
}