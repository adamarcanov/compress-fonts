# Install
```
npm install @offactory/compress-fonts --save-dev 
```
fontforge is required for this lib:
```
sudo apt install fontforge
```

# Usage
## Import in file and run (babel-node example)
```
import { join } from 'path'
import compressFonts from '@offactory/compress-fonts'

compressFonts({ 
    src: join(__dirname, 'assets', 'fonts-raw'), 
    dist: join(__dirname, 'assets', 'fonts')
    signs: "!—-–”“„#€$%&§'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¤¥¦§¨©ª«¬-®¯°±²³´µ¶·¸¹º»¼½¾¿÷ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľſŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž"
})
```

options (object): 
- src (string) - dir source with your fonts
- dist (string) - dir destination for compressed fonts
- signs (string) - you can define signs you want to stay in compressed fonts