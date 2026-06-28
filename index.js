const { existsSync, copyFileSync } = require('fs')
const { basename, join, parse, extname } = require('path')
const { execFileSync } = require('child_process')
const colors = require('colors')
const timeNow = require('./lib/time-now.js')
const listFiles = require('./lib/list-files.js')
const textToUnicode = require('./lib/text-to-unicode.js')
const createDir = require('./lib/create-dir.js')

const createWebDir = dist => createDir(dist, { 'generate_indexhtml': true })

module.exports = ({ src, dist, signs, unifyShapes = true }) => {
    if ( !src || !dist ) throw new Error('Compress Fonts: src and dist are required')

    if ( !existsSync(dist) ) createWebDir( dist )

    const truetypeFiles = listFiles(src)
    const fontsExecOptions = { stdio: 'pipe' } // { stdio : 'inherit' }
    const baseSigns = signs && signs.length > 0 ? signs : "!—-–\"”“„#€$%&§'’()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬-®¯°±²³´µ¶·¸¹º»¼½¾¿÷ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľſŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž"
    const subset = textToUnicode(baseSigns).split(', ').map( code => `SelectMore(${code}); ` ).join('')

    // FontForge skrypt do ujednolicania kształtów - uproszczona wersja
    const unifyShapesScript = unifyShapes ? `
        RemoveOverlap();
        Simplify();
        RoundToInt();
    ` : '';

    truetypeFiles.map( file => {
        const extension = extname(file).toLowerCase();
        const filename = parse(file).name;
        const isWebFont = extension === '.woff' || extension === '.woff2' || extension === '.eot';
        
        if (isWebFont) {
            try {
                const destPath = join(dist, basename(file));
                copyFileSync(file, destPath);
                console.log('['+ `${timeNow()}`.gray + '] ' + `${basename(file)} ` + '\x1b[32m%s\x1b[0m', `copied successfully`);
            } catch (error) {
                console.error('webfont: an error occurred while copying:', error);
                process.exit(1);
            }
        } else {
            try {
                // Rozszerzony skrypt FontForge z ujednolicaniem kształtów
                const fontforgeScript = `Open($1);${baseSigns && baseSigns.length > 0 ? ` SelectNone(); ${subset}` : ''}${unifyShapes ? ` ${unifyShapesScript}` : ''} SelectInvert(); Clear(); Generate($2:r + ".woff", "", 0x200000); Generate($3:r + ".woff2", "", 0x200000);`;

                execFileSync('fontforge', ['-lang=ff', '-c', fontforgeScript, file, join(dist, filename + '.woff'), join(dist, filename + '.woff2')], fontsExecOptions);

                const statusMessage = unifyShapes ? 'successfully generated (with unified shapes)' : 'successfully generated';
                console.log('['+ `${timeNow()}`.gray + '] ' + `${basename(file)} ` + '\x1b[32m%s\x1b[0m', statusMessage);

            } catch (error) {
                console.error('webfont: an error occurred:', error);
                process.exit(1)
            }
        }
    })
}