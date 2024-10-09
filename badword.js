function escapeRegExp(strings){
  let data = strings.trim().toLowerCase().split("|").filter(Boolean);
  for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (!((element.includes("(") && element.includes(")")) || 
          (element.includes("[") && element.includes("]")) ) ){
            data[index] = data[index].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').
            replace(/[a4]/g, "[a4]").replace(/[s5]/g, "[s5]").replace("i", "[i1]").
            replace("[l1]", "l").replace(/[o0]/g, "[o0]").replace(/[e3]/g, "[e3]");
      };
  }
  data = new RegExp(data.join("|"));
  return data.source;
};

class FilterBadWord{

  constructor(word = "", customFilter="", customSubFilter=""){
  
    this.word = word;
    
    this.filt = /b[a4][s5]hfu[l1][l1]|k[i1][l1][l1]|fuck[*]?|dr[uo]g[*]?|d[i1]ck[*]?|fk/gi;
    
    this.subfilter = /[a4][s5][s5]|[l1][i1]p|pu[s5][s5]y[*]?|[s5]uck[*]?|m[o0]th[e3]r[*]?|m[o0]m[*]?|d[o0]g[*]?|l[o0]w[*]?|s[e3]x[*]?/gi;
    if (customFilter){
        this.filt = new RegExp(this.filt.source+"|"+escapeRegExp(customFilter), "gi");
    };
    if (customSubFilter){
        this.subfilter = new RegExp(this.subfilter.source+"|"+escapeRegExp(customSubFilter), "gi");
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
      this.positionList = this.constructor.position_static(this.word.toString(), this.filt);
  
      return this.positionList;
  
  }

  get ['thisToxic'](){
    
    var check = this.position();

    var after = "";
    
    var before = "";
    
    var arry = [];

    var check_repr = "";
    
    if (check != null || check != 0) {
    
        var word = this.word.toLowerCase();
    
        function before_str(number , key){

          return word.substring(number, word.indexOf(key));//nomer dan keyword
        
        }

        function after_Str(w, spec){

          return word.substring( word.indexOf(w), spec.length+word.length ).replace(w, "").trim(); //, word.indexOf(spec));
        }

        for (var i = 0; i < check.length; i++) {
              
              const word_s = this.constructor.getboundPosition(this.word.toLowerCase().toString() , check[i]);

              before = before_str(0 , word_s).toString().split(" ");

              after = after_Str(word_s, this.word).toString().split(" ");

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
                  
                  if (before[before.length-1].match(this.subfilter) != null) {
                      
                      check_repr = before[before.length-1].match(this.subfilter);

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

                  else if (after[0].match(this.subfilter) != null){

                      check_repr = after[0].match(this.subfilter);

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

                  else if (after[1].match(this.subfilter) != null){

                      check_repr = after[1].match(this.subfilter);

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
                
                if ( this.word.match(this.filt) != null) {
                      
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

    word = this.word.split(" ");

    sensore = "*";

    process = position.forEach( number => {

      const get_word = this.constructor.getboundPosition(this.word.toString() , number);

      for (var i = 0; i < word.length; i++) {

        for (var x = 0; x < get_word.length; x++) {
        
            sensore += "*";
        
        };

        word[i] = word[i].replace(get_word, sensore);
        
        sensore = "*";
      
      };

    });

    output = word;

    return output.join(" ");

    //position.forEach( async(number) => {
      
      //const get_word = await this.constructor.getboundPosition(this.word.toString() , number);
      
      //for (var i = 0; i < word.length; i++) {
      
        //word[i] = word[i].replace(get_word, "**");
      
      //};

      //console.log(word);

    //});

    
  }

}


class filters_badword extends FilterBadWord{
  
  ['words_o'](word){
    
    this.word = word.toString();
  
  }

  ['config'](cl=true, smart=true, customFilter="", customSubFilter=""){
    this.cl = cl;
    this.st = smart;
    if (customFilter){
        this.filt = new RegExp(this.filt.source+"|"+escapeRegExp(customFilter), "gi");
    };
    if (customSubFilter){
        this.subfilter = new RegExp(this.subfilter.source+"|"+escapeRegExp(customSubFilter), "gi");
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

      return this.word.trim();
    
    }

  }

  set ['cleans'](value){
    
    throw value;
  
  }

}
