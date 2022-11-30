<BadFilter.js>

```Javascript hl_lines="4  9-12  25-27"
const badfilt = new filter_badword();
badfilt.config(true, false);
badfilt.words_o("FUck master");
console.log( badfilt.cleans );
console.log( badfilt.position());
```
