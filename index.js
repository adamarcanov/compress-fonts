import { existsSync } from 'fs';
import { basename, join, parse } from 'path'
import { execSync } from 'child_process'

import colors from 'colors'

import timeNow from './lib/time-now.js'
import createDir from './lib/create-dir.js'
const createWebDir = dist => createDir(dist, { 'generate_indexhtml': true })

import listFiles from './lib/list-files.js'
import textToUnicode from './lib/text-to-unicode.js'

const compressFonts = ({ src, dist, signs }) => {
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

export default compressFonts