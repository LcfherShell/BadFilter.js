// Periksa lingkungan eksekusi
const isNode = typeof exports === 'object' && typeof module !== 'undefined';

/**
 * Fungsi untuk memeriksa apakah kata cocok dengan pola regex
 * @param {string} word - string kata yang akan diperiksa
 * @param {regex} regex - pola regex yang akan digunakan untuk memeriksa kata-kata
 * @return {boolean} - true jika kata cocok dengan pola regex, false jika tidak
 */
function RegexMatch(word, regex) {
  const words = word.trim();
  let barisdata = [];
  if (words){
      for (let index = 0; index < words.length; index++) {
          let datacocok = barisdata.join("").toLowerCase();
          if (datacocok.match(regex)){
              return true;
          }else{
              if (datacocok.replace(/1/gi, "i").match(regex)){
                  return true;
              }else if (datacocok.replace(/1/gi, "l").match(regex)){
                  return true;
              }else if (datacocok.replace(/6/gi, "b").match(regex)){
                  return true;
              }else if (datacocok.replace(/6/gi, "g").match(regex)){
                  return true;
              };

              if (words[index].indexOf("3")){
                  words[index] = "e";
              }else if(words[index].indexOf("0")){
                  words[index] = "o";
              }else if(words[index].indexOf("4")){
                  words[index] = "a";
              }else if(words[index].indexOf("5")){
                  words[index] = "s";
              }else if(words[index].indexOf("8")){
                  words[index] = "b";
              };
          };
          barisdata.push(words[index].trim());
      };
  };
  // Return array baris yang cocok
  return false;
};

function escapeRegExp(strings){
  let data = strings.trim().toLowerCase().split("|").filter(Boolean);
  for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (!((element.includes("(") && element.includes(")")) || 
          (element.includes("[") && element.includes("]")) ) ){
            data[index] = data[index].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').
            replace(/[a4]/g, "[a4]").replace(/[s5]/g, "[s5]").replace("i", "[i1]").
            replace("l", "[l1]").replace(/[o0]/g, "[o0]").replace(/[e3]/g, "[e3]").
            replace(/[b8]/g, "[b8]").replace(/[kx]/g, "[kx]");
      };
  }
  data = new RegExp(data.join("|"));
  return data.source;
};

function validateInput(type, value) {
  let regex;
  switch (type) {
      case 'email':
          // Regex kompleks untuk email
          regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|co|info|io|biz|id|us|uk|ca|au|de|fr|es|it|jp|cn|br|in|ru|mx|kr|za|nl|se|no|fi|dk|pl|pt|ar|ch|hk|sg|my|th|vn|ae|at|be|cz|hu|ro|bg|gr|lt|lv|sk|si|ee|cy)(\.[a-zA-Z]{2,})?$/;
          break;
      case 'phone':
          // Regex kompleks untuk nomor telepon (contoh: +1-234-567-8900, (123) 456-7890, 123-456-7890, 1234567890)
          regex = /^(?:\+?(\d{1,3}))?[-. ]?(\(?\d{1,4}?\)?)[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
          break;
      case 'url':
          // Regex kompleks untuk URL
          regex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
          break;
      default:
          return false; // Tipe tidak valid
  }
  return regex.test(value);
};

class FilterBadWord{

constructor(text = "", customFilter="", customSubFilter=""){
  
    this._text = text;
    
    this._filt = /b[a4][s5]hfu[l1][l1]|k[i1][l1][l1]|fuck[*]?|dr[uo]g[*]?|d[i1]ck[*]?|[a4][s5][s5]|[l1][i1]p|pu[s5][s5]y[*]?|fk/gi;
    
    this._subfilter = /[a4][s5][s5]|[l1][i1]p|pu[s5][s5]y[*]?|[s5]uck[*]?|m[o0]th[e3]r[*]?|m[o0]m[*]?|d[o0]g[*]?|l[o0]w[*]?|s[e3]x[*]?/gi;
    if (customFilter.length>3){
        this._filt = new RegExp(this._filt.source+"|"+escapeRegExp(customFilter), "gi");
    };
    if (customSubFilter.length>3){
        this._subfilter = new RegExp(this._subfilter.source+"|"+escapeRegExp(customSubFilter), "gi");
    };
    this.__subtxic = [];
    this._st = false;
}


static getboundPosition(word, _position){
  
    var paragap, end;
    
    paragap = word;
    
    while (paragap[_position] == " ") _position--;
    
    _position = paragap.lastIndexOf(" ", _position) + 1;
    
    end = paragap.indexOf(" ", _position);
    
    if (end == -1){
      
      end = paragap.length;
    
    }

    return paragap.substring(_position, end);
}


static ['position_static'](word, filters){
 
    var wordlist_, filt, result, json_, position_;

    
    position_ = 0;
    
    wordlist_ = word.toLowerCase().split(' ');
    
    json_ = wordlist_.map( (word, index) => {
    
      position_ = index&&wordlist_[index - 1].length+position_+1;
      
      return {word, position_}
    
    });

    position_ = [];
      
    for (var i = 0; i < json_.length; i++) {
          
        wordlist_ = json_[i].word.match(filters);
      
        if (wordlist_ != null || wordlist_ === 0 ) {
          
          position_.push(json_[i].position_);
      
        }else{

            wordlist_ = RegexMatch(json_[i].word, filters);
            if (wordlist_ != false) {
                position_.push(json_[i].position_);
            };

        }
      
    };
  
    return position_;

}

['position']() {
  
    var positionList = this.constructor.position_static(this._text.toString(), this._filt);

    return positionList;

}

get ['thisToxic'](){
  
    var check = this.position();

    var after ="", before ="", check_repr ="";
    
    var arry = [];
    
    if (check != null || check != 0) {
    
        var word = this._text.toLowerCase();
    
        function before_str(number , key){

          return word.substring(number, word.indexOf(key));//nomer dan keyword
        
        };

        function after_str(w, spec){
          let data =word.substring( word.indexOf(w), spec.length+word.length );
          return data.replace(w, "").trim(); //, word.indexOf(spec));
        };

        for (var i = 0; i < check.length; i++) {
              
              const word_s = this.constructor.getboundPosition(this._text.toLowerCase().toString() , check[i]);

              before = before_str(0 , word_s).toString().split(" ");

              after = after_str(word_s, this._text).toString().split(" ");

              //console.log(word.indexOf(word_s));
              if (after.length >= 1 ){

                after = after.filter(

                  function(entry){
                    
                    return entry.trim() != '';
                  
                  });

              };

              //console.log(word.substring(word.indexOf(word_s)) )
              if (before[before.length-1] === ""){
                
                before = before.filter(

                  function(entry){
                    
                    return entry.trim() != '';
                  
                  });              

              };
              //ambil kata sebelum dan sesudah;
              //console.log(before, after);
              if (before){
                before.forEach(d=>{

                    if (d.match(this._subfilter)){

                        this.__subtxic.push([d, '*'.repeat(d.length)]);
                      
                    };
                    
                });
              };
              if (after){
                after.forEach(d=>{

                    if (d.match(this._subfilter)){

                        this.__subtxic.push([d, '*'.repeat(d.length)]);

                    };

                });
              };

              try{
                  
                  if (before[before.length-1].match(this._subfilter) != null) {
                      
                      check_repr = before[before.length-1].match(this._subfilter);

                      if (check_repr != before[before.length-1]) {
                          //check ulang jika sensore tidak memenuhi persyaratan
                          arry.push("Toxic");
                          arry.push(1);
                          break
                      };

                      //console.log( "1"+check_repr +" before: "+before[before.length-1] );

                      arry.push("Toxic");
                      
                      arry.push(1);
                      
                      arry.push(before[before.length-1]);

                      break;

                  }

                  else if (after[0].match(this._subfilter) != null){

                      check_repr = after[0].match(this._subfilter);

                      if (check_repr != after[0]) {

                          arry.push("Toxic");
                          arry.push(1);
                          break
                      };

                      //console.log( "2"+ check_repr + " after: "+after[0]);

                      arry.push("Toxic");
                      
                      arry.push(1);
                      
                      arry.push(after[after.length-1]);

                      break;

                  }

                  else if (after[1].match(this._subfilter) != null){

                      check_repr = after[1].match(this._subfilter);

                      if (check_repr != after[1]) {

                          arry.push("Toxic");
                          arry.push(1);
                          break
                      };

                      //console.log( "3"+check_repr + " after: "+after[1]);

                      arry.push("Toxic");
                      
                      arry.push(1);
                      
                      arry.push(after[1]);

                      break;

                  }

                  

                }
              catch(err){
                
                if ( this._text.match(this._filt) != null) {
                      
                      arry.push("Toxic");
                      arry.push(1);
                      break;
                };
                  
              }

          };

        if (arry.length <= 1) {
          
          arry.push("Notoxic");
          arry.push(0);
        
        };

        return arry;
        

    };
    return false;

}

set ['thisToxic'](key){
  
    throw key;

}

['clean'](position){

    var word;

    word = this._text.split(" ");


    position.forEach( number => {

      const get_word = this.constructor.getboundPosition(this._text.toString() , number);

      word.forEach((w, i) => {
        if (!(validateInput("email", w) || validateInput("url", w))){

            word[i] = w.replace(get_word, '*'.repeat(get_word.length));       
        
        };    
      
      });

    });
  
    this.__subtxic.forEach(([oldWord, newWord]) => {
  
      word.forEach((w, i) => {
        if (!(validateInput("email", w) || validateInput("url", w)) && this._st){
          
            word[i] = w.replace(oldWord, newWord);
        
        };
      });
    
    });

    return word.join(" ");

}

};


class filters_badword extends FilterBadWord{

['text_o'](text){
  
  this._text = text.toString();

}

['config'](cl=true, smart=true, customFilter="", customSubFilter=""){
  this._cl = cl;
  this._st = smart;
  var isfiles = false;
  if (isNode){
    const {readFileSync, existsSync} = require("node:fs");
    if (existsSync(customSubFilter)) {
        var readata = readFileSync(customSubFilter).split("\n");
        function extractNames(text) {
            const namePattern = /\b[A-Z][a-zàâäéèêëïîôöùûüç'-]+\b/g;
            return text.match(namePattern);
        };
        readata = readata.map(value => (extractNames(value) || validateInput("email", value) || 
                                        validateInput("phone", value) || validateInput("url", value)) ? "" : value).
                                      filter(item => item && item.trim());
        if (readata.length>1){
            this._subfilter = new RegExp(this._subfilter.source + "|" + escapeRegExp(readata.join("|")), "gi");
        };
    }else{
      if (customSubFilter.includes("|")) this._subfilter = new RegExp(this._subfilter.source+"|"+escapeRegExp(customSubFilter), "gi");
    };
    isfiles = true;
  };

  if (customFilter.length>3){
      this._filt = new RegExp(this._filt.source+"|"+escapeRegExp(customFilter), "gi");
  };
  if (customSubFilter.length>3 && !isfiles){
      this._subfilter = new RegExp(this._subfilter.source+"|"+escapeRegExp(customSubFilter), "gi");
  };
}

get ['cleans'](){
  
  if (this._cl === true) {
  
    if (this.thisToxic[1] === 1 && this.thisToxic.length > 2 ) {

      if (this._st === true) {
          var sensore = "*";
    
          for (var i = 0; i < this.thisToxic[2].length; i++) {
    
              sensore += "*";
    
          };
          return this.clean(this.position()).replace(this.thisToxic[2], sensore);
      };
      
      return this.clean(this.position());

    };
    
    return this.clean(this.position());

  }
  else{
    
    return this._text.trim();
  
  };

}

set ['cleans'](value){
  
  throw value;

}

};


// Definisikan objek ekspor
const exportsObject = {
  /**
   * FilterBadWord class: class for filtering bad words 
   *@param {string} text - The text to filter 
   *@param {string} customFilter - List of bad words 
   *@param {string} customSubFilter - List of bad sub words
   */
  FilterBadWord,
  /**
   * filters_badword class: a simpler class to filter bad words 
   * which uses the FilterBadWord class. To use it you have to call the config function
   */
  filters_badword
};



// Ekspor ke lingkungan yang sesuai
//isNode ? module.exports = exportsObject : Object.assign(window, exportsObject);
// Ekspor ke lingkungan yang sesuai
if (isNode) {
  // Jika di Node.js, gunakan module.exports
  module.exports = exportsObject;
} else {
  // Jika di browser, periksa dukungan ES Modules
  if (typeof window.customElements !== "undefined") {
      // Dukungan untuk ES Modules, gunakan `export`
      window.exportsObject = exportsObject; // Menyimpan di objek window
      Object.assign(window, exportsObject);
  } else {
      // Jika tidak mendukung ES Modules, gunakan Object.assign
      Object.assign(window, exportsObject);
  }
}
