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
    
    this._filt = /[b8][[a4][s5]hfu[l1][l1]*|k[i1][l1][l1]*|fuck*|dr[uo]g*|d[i1]ck*|fk/gi;
    
    this._subfilter = /ass|lip|pussy*|suck*|mother*|mom*|dog*|low*|sex*/gi;
    if (customFilter.length>3){
        this._filt = new RegExp(this._filt.source+"|"+escapeRegExp(customFilter), "gi");
    };
    if (customSubFilter.length>3){
        this._subfilter = new RegExp(this._subfilter.source+"|"+escapeRegExp(customSubFilter), "gi");
    };
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
      
        }
      
    };
    
    return position_;

  }

  ['position']() {
      //if ( typeof position != "number" ) {
        //position = parseInt(position);
      //} 
      this.positionList = this.constructor.position_static(this._text.toString(), this._filt);
  
      return this.positionList;
  
  }

  get ['thisToxic'](){
    
    var check = this.position();

    var after = "";
    
    var before = "";
    
    var arry = [];

    var check_repr = "";
    
    if (check != null || check != 0) {
    
        var word = this._text.toLowerCase();
    
        function before_str(number , key){

          return word.substring(number, word.indexOf(key));//nomer dan keyword
        
        }

        function after_Str(w, spec){

          return word.substring( word.indexOf(w), spec.length+word.length ).replace(w, "").trim(); //, word.indexOf(spec));
        }

        for (var i = 0; i < check.length; i++) {
              
              const word_s = this.constructor.getboundPosition(this._text.toLowerCase().toString() , check[i]);

              before = before_str(0 , word_s).toString().split(" ");

              after = after_Str(word_s, this._text).toString().split(" ");

              //console.log(word.indexOf(word_s));
              if (after.length >= 1 ){

                after = after.filter(

                  function(entry){
                    
                    return entry.trim() != '';
                  
                  });

              }

              //console.log(word.substring(word.indexOf(word_s)) )
              if (before[before.length-1] === ""){
                
                before = before.filter(

                  function(entry){
                    
                    return entry.trim() != '';
                  
                  });              

              }
              
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

    var word, process, output, sensore;

    word = this._text.split(" ");

    sensore = "*";

    process = position.forEach( number => {

      const get_word = this.constructor.getboundPosition(this._text.toString() , number);

      for (var i = 0; i < word.length; i++) {

        for (var x = 0; x < get_word.length-1; x++) {
        
            sensore += "*";
        
        };

        if (!(validateInput("email", word[i]) || validateInput("url", word[i]))) word[i] = word[i].replace(get_word, sensore);
        
        sensore = "*";
      
      };

    });

    output = word;

    return output.join(" ");

    //position.forEach( async(number) => {
      
      //const get_word = await this.constructor.getboundPosition(this._text.toString() , number);
      
      //for (var i = 0; i < word.length; i++) {
      
        //word[i] = word[i].replace(get_word, "**");
      
      //};

      //console.log(word);

    //});

    
  }

}


class filters_badword extends FilterBadWord{
  
  ['text_o'](text){
    
    this._text = text.toString();
  
  }

  ['config'](cl=true, smart=true, customFilter="", customSubFilter=""){
   
    this.cl = cl;
    this.st = smart;
    if (customFilter.length>3){
        this._filt = new RegExp(this._filt.source+"|"+escapeRegExp(customFilter), "gi");
    };
    if (customSubFilter.length>3){
        this._subfilter = new RegExp(this._subfilter.source+"|"+escapeRegExp(customSubFilter), "gi");
    };
  }
  
  get ['cleans'](){
    
    if (this.cl === true) {
    
      if (this.thisToxic[1] === 1 && this.thisToxic.length > 2 ) {

        if (this.st === true) {
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
    
    }

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

// Periksa lingkungan eksekusi
const isNode = typeof exports === 'object' && typeof module !== 'undefined';

// Ekspor ke lingkungan yang sesuai
isNode ? module.exports = exportsObject : Object.assign(window, exportsObject);
