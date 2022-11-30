class FilterBadWord{

  constructor(word = ""){
    this.word = word;
    
    this.filt = /bashfull*|kill*|fuck*|drug*|fk/gi;
    this.subfilter = /as*|lip|pussy*|suck*|mother*|mom*|dog*|low*|sex*/gi;

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
    if (check != null || check != 0) {
        var word = this.word.toLowerCase();
        function before_str(number , key){

          return word.substring(number, word.indexOf(key));
        
        }

        function after_Str(w, spec){

          return word.substring( word.indexOf(w), spec.length+word.length ).replace(w, "").trim(); //, word.indexOf(spec));
        }

        for (var i = 0; i < check.length; i++) {
              
              const word_s = this.constructor.getboundPosition(this.word.toLowerCase().toString() , check[i]);
              before = before_str(0 , word_s).toString().split(" ");
              after = after_Str(word_s, this.word);

              //console.log(word.indexOf(word_s));
              console.log(after);

              //console.log(word.substring(word.indexOf(word_s)) )
              if (before[before.length-1] === ""){
                
                before = before.filter(
                  function(entry){
                    
                    return entry.trim() != '';
                  
                  });              
              }
              
              try{
                  if (before[before.length-1].match(this.subfilter) != null) {
                      arry.push("Toxic");
                      arry.push(1);
                      arry.push(before[before.length-1]);
                      break;

                  }
                }
              catch(err){
                
                if ( this.word.match(this.filt) != null) {};
                
                arry.push("Toxic");
                arry.push(1);
                break

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

  ['config'](cl, er){
    this.cl = cl;
    this.er = er;
  }
  get ['cleans'](){
    if (this.cl === true) {
      if (this.thisToxic[1] === 1 && this.thisToxic.length > 2) {

          var sensore = "*";
          for (var i = 0; i < this.thisToxic[2].length; i++) {
              sensore += "*";
          };

          return this.clean(this.position()).replace(this.thisToxic[2], sensore);

      };

      return this.clean(this.position());

    }else{

      return this.word.trim();
    
    }

  }

  set ['cleans'](value){
    throw value;
  }

}
