const { existsSync } = require('fs')
const { basename, join, parse } = require('path')
const { execSync } = require('child_process')
const colors = require('colors')
const timeNow = require('./lib/time-now.js')
const listFiles = require('./lib/list-files.js')
const textToUnicode = require('./lib/text-to-unicode.js')
const createDir = require('./lib/create-dir.js')

const createWebDir = dist => createDir(dist, { 'generate_indexhtml': true })

module.exports = ({ src, dist, signs }) => {
    if ( !src || !dist ) throw new Error('Compress Fonts: src and dist are required')

    if ( !existsSync(dist) ) createWebDir( dist )

    const truetypeFiles = listFiles(src)
    const fontsExecOptions = { stdio: 'pipe' } // { stdio : 'inherit' }
    const baseSigns = signs && signs.length > 0 ? signs : "!—-–”“„#€$%&§'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬-®¯°±²³´µ¶·¸¹º»¼½¾¿÷ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľſŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž"
    const subset = textToUnicode(baseSigns).split(', ').map( code => `SelectMore(${code}); ` ).join('')

    truetypeFiles.map( file => {
        const filename = parse(file).name

        try {
            execSync(`fontforge -lang=ff -c 'Open($1);${ baseSigns && baseSigns.length > 0 ? ` SelectNone(); ${subset}` : '' } SelectInvert(); Clear(); Generate($2:r + ".woff"); Generate($3:r + ".woff2");' ${file} ${join(dist, filename + '.woff')} ${join(dist, filename + '.woff2')}`, fontsExecOptions);
        } catch (error) {
            console.error('webfont: an error occurred:', error);
            process.exit(1)
        }

        console.log('['+ `${timeNow()}`.gray + '] ' + `${basename(file)} ` + '\x1b[32m%s\x1b[0m', `successfully generated`);
    })
}