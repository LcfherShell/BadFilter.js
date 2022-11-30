<BadFilter.js>

```Javascript hl_lines="4  9-12  25-27"
const badfilt = new filters_badword();
badfilt.config(true, false); //accpet filter and error print
badfilt.words_o("FUck master");
console.log( badfilt.cleans );
console.log( badfilt.position() );
//result ***** master

badfilt.words_o("motherfucker");
console.log( badfilt.cleans );
console.log( badfilt.position() );
//result *************
```
