/*!
 * BadFilter.js - A JavaScript utility for filtering offensive or unwanted words
 * Copyright (c) 2024 LcfherShell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Periksa lingkungan eksekusi
const isNode = typeof exports === 'object' && typeof module !== 'undefined';
/**
 * Fungsi untuk memeriksa apakah kata cocok dengan pola regex
 * @param {string} word - string kata yang akan diperiksa
 * @param {regex} regex - pola regex yang akan digunakan untuk memeriksa kata-kata
 * @return {boolean} - true jika kata cocok dengan pola regex, false jika tidak
 */
function RegexMatch(word, regex) {
  var modWord = word.trim();
  let escapeDta = [];
  if (modWord){
      for (let index = 0; index < modWord.length; index++) {
          let currChar = escapeDta.join("").toLowerCase();
          if (currChar.match(regex)){
              return true;
          }else{
              if (modWord[index].indexOf("3")){
                modWord  = modWord.replace("3","e");
              }else if(modWord[index].indexOf("0")){
                modWord  = modWord.replace("0","o");
              }else if(modWord[index].indexOf("4")){
                modWord  = modWord.replace("4","a");
              }else if(modWord[index].indexOf("5")){
                modWord  = modWord.replace("5","s");
              }else if(modWord[index].indexOf("$")){
                modWord  = modWord.replace("$","s");
              }else if(modWord[index].indexOf("8")){
                modWord  = modWord.replace("8","b");
              }else if(modWord[index].indexOf("&")){
                modWord  = modWord.replace("&","b");
              };

              if (currChar.replace(/[1!]/gi, "i").match(regex)){
                  return true;
              }else if (currChar.replace(/[1!]/gi, "l").match(regex)){
                  return true;
              }else if (currChar.replace(/6/gi, "b").match(regex)){
                  return true;
              }else if (currChar.replace(/6/gi, "g").match(regex)){
                  return true;
              };

              
          };
          escapeDta.push(modWord[index].trim());
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
            replace(/[b8]/g, "[b8]").replace(/[kx]/g, "[kx]")+"[^a-z]?";
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




///versi terbaru
function findMissingParts(text1, regexPattern) {
  try {
    const regex = regexPattern;  // Buat regex dari regexPattern, case insensitive
    const match = text1.match(regex);             // Cocokkan text1 dengan regex

    if (match) {
      return {
        matched: match[0],    // Bagian yang sesuai dengan regex
        remaining: text1.replace(match[0], '') // Bagian yang tidak sesuai (hilang)
      };
    } else {
      return { matched: null, remaining: text1 }; // Jika tidak ada yang cocok, kembalikan teks asli
    }
  } catch (e) {
    return false;
  }
};





function findSimilarMatches(data1, regex) {
  const regexMatches = [];
  const possiblePatterns = regex.source.split('|'); // Ambil pola regex

  // Fungsi untuk menghitung jarak Levenshtein dengan mempertimbangkan karakter dalam tanda kurung
  function getLevenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const dp = Array.from(Array(len1 + 1), () => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) {
      for (let j = 0; j <= len2; j++) {
        if (i === 0) {
          dp[i][j] = j; // Jika str1 kosong
        } else if (j === 0) {
          dp[i][j] = i; // Jika str2 kosong
        } else if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]; // Jika karakter sama
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]); // Operasi edit
        }
      }
    }
    return dp[len1][len2];
  }

  // Fungsi untuk menghitung jarak Levenshtein dengan mengonversi pola regex
  function convertPattern(pattern) {
    let converted = '';
    let matchedCount = 0; // Variabel untuk menghitung jumlah karakter yang cocok
    let i = 0;

    while (i < pattern.length) {
      if (pattern[i] === '[') {
        // Temukan posisi penutup ']'
        let closingBracket = pattern.indexOf(']', i);
        if (closingBracket !== -1) {
          // Menghitung jumlah karakter dalam tanda kurung
          matchedCount += closingBracket - i - 1; // Hitung jumlah karakter dalam []
          converted += 'X'; // Gantikan karakter dalam tanda kurung dengan 'X'
          i = closingBracket + 1; // Lewati konten dalam kurung
        } else {
          converted += pattern[i]; // Jika tidak ada penutup, tetap tambahkan karakter
          i++;
        }
      } else if (pattern[i] === '?') {
        // Abaikan '?'
        i++;
      } else {
        converted += pattern[i]; // Tambahkan karakter lain
        i++;
      }
    }

    return { converted, matchedCount }; // Mengembalikan pola yang sudah diubah dan jumlah karakter yang cocok
  }

  // Mencocokkan regex ke setiap pola
  possiblePatterns.forEach(pattern => {
    const testRegex = new RegExp(pattern); // Regex untuk mencocokkan
    const matchResult = testRegex.exec(data1); // Mencari kecocokan

    if (matchResult) {
      regexMatches.push({
        matched: pattern,
        missingChars: 0,
        similarity: 100, // Jika cocok penuh, tidak ada karakter yang hilang
        countChars: (pattern.match(/\[[^\]]+\]/g) || []).length // Hitung jumlah karakter dalam []
      });
    } else {
      // Ubah pola untuk menghitung jarak Levenshtein
      const { converted: convertedPattern, matchedCount } = convertPattern(pattern);
      const levDistance = getLevenshteinDistance(data1, convertedPattern);
      const maxLength = Math.max(data1.length, convertedPattern.length);
      const similarity = ((maxLength - levDistance) / maxLength) * 100;

      // Hitung karakter yang hilang dari pola
      const missingChars = Math.abs(data1.length - convertedPattern.length);

      // Menyimpan hasil untuk pola yang hampir cocok
      regexMatches.push({
        matched: pattern,
        missingChars: missingChars + levDistance, // Menambahkan jarak Levenshtein
        similarity: Math.floor(similarity.toFixed(2)),
        countChars: matchedCount // Menyimpan jumlah karakter yang cocok
      });
    }
  });

  return regexMatches.length > 0 ? regexMatches : null;
};
function findHighestSimilarityIndex(matches) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return -1; // Jika tidak ada hasil, kembalikan -1
  }

  let highestIndex = 0; // Indeks awal
  let highestSimilarity = matches[0].similarity; // Nilai similarity tertinggi awal

  matches.forEach((match, index) => {
    if (match.similarity > highestSimilarity) {
      highestSimilarity = match.similarity; // Memperbarui similarity tertinggi
      highestIndex = index; // Memperbarui indeks tertinggi
    }
  });

  return highestIndex; // Kembalikan indeks dengan similarity tertinggi
}

function replaceLettersAndRemoveCertainSpecialChars(word, charsToRemove) {
  // Membuat regex berdasarkan karakter khusus yang ingin dihapus
  const specialCharsRegex = new RegExp(`[${charsToRemove}]`, 'g');
  
  // Menghapus karakter khusus tertentu
  var cleanedWord = word.replace(specialCharsRegex, '');
  return cleanedWord;
}

class FilterBadWord{

constructor(text = "", customFilter="", customSubFilter=""){
  
    this.__text__ = text;
    // Default filter untuk mendeteksi kata kasar umum
    this.__filt__ = /^b[a4][s5]hfu[l1][l1][^a-z]?|[8b]r[e3][a4][s5]t[^a-z]?|[b8][o0][o0][b8][^a-z]?|k[i1][l1][l1][^a-z]?|fuck[^a-z]?|dr[uo]g[^a-z]?|d[i1]ck[^a-z]?|[a4][s5][s5][^a-z]?|[l1][i1]p|pu[s5][s5]y[^a-z]?|fk[^a-z]?/gi;
    this.__subfilter__ = /^[a4][s5][s5][^a-z]?|[l1][i1]p[^a-z]?|pu[s5][s5]y[^a-z]?|[s5]uck[^a-z]?|m[o0]th[e3]r[^a-z]?|m[o0]m[^a-z]?|d[o0]g[^a-z]?|l[o0]w[^a-z]?|s[e3]x[^a-z]?|[8b]r[e3][a4][s5]t/gi;
    // Menambahkan filter kustom jika ada
    if (customFilter.length>3){
        this.__filt__ = new RegExp(this.__filt__.source+"|"+escapeRegExp(customFilter), "gi");
    };
    if (customSubFilter.length>3){
        this.__subfilter__ = new RegExp(this.__subfilter__.source+"|"+escapeRegExp(customSubFilter), "gi");
    };
    
    //mapping emoji
    this.__emoji__ = new RegExp([
      '😈', // Sering digunakan untuk menunjukkan niat nakal atau licik.
      '👿', // Menunjukkan sifat jahat, sering digunakan dalam konteks humor atau kejahatan.
      '🍆', // Sering digunakan secara seksual, merujuk pada bentuknya yang mirip dengan organ genital pria.
      '🍑', // Sering digunakan secara seksual, merujuk pada bentuknya yang mirip dengan bokong.
      '🐄', // Sering diplesetkan dengan wanita,
      '🐐', // Sering diplesetkan dengan wanita atau pria.
      '🍋', // Sering digunakan secara seksual, merujuk pada hubungan sesama jenis.
      '🌈', // Sering digunakan secara seksual, merujuk pada hubungan sesama jenis.
      '🏳️‍🌈', // Sering digunakan secara seksual, merujuk pada hubungan sesama jenis.
      '🍉', // Sering diplesetkan dengan ukuran dada wanita.
      '💦', // Bisa merujuk pada aktivitas seksual, sering digunakan untuk menunjukkan keringat atau air.
      '😍', // Menunjukkan cinta atau ketertarikan yang mendalam.
      '🥵', // Bisa merujuk pada ketertarikan fisik atau merasa terlalu panas.
      '🤤', // Bisa merujuk pada keinginan seksual atau ketertarikan yang kuat.
      '🥥', // Menunjukkan pakaian dalam atau ukuran dada wanita.
      '👙', //  Menunjukkan pakaian dalam wanita, sering digunakan dalam konteks mode atau kolam renang.
      '💣', // Menunjukkan ledakan atau kekerasan, bisa digunakan dalam konteks drama atau peringatan.
      '🔪', // Menunjukkan kekerasan, sering digunakan dalam konteks ancaman atau agresi.
      '🔫', // Menunjukkan senjata api, sering digunakan dalam konteks kekerasan atau ancaman.
      '⚔️', // Menunjukkan pertarungan atau konflik, sering digunakan dalam konteks sejarah atau fantasi.
      '💥', // Menunjukkan kekuatan atau dampak, bisa merujuk pada situasi dramatis atau kekerasan.
      '🔨', // Sering digunakan dalam konteks konstruksi atau kekerasan, bisa menunjukkan agresi.
      '🖕'  //  Menunjukkan penghinaan atau ketidaksenangan, sering dianggap sebagai gesture kasar.
    ].join("|"), "gi");

    this.__subtxic = []; // Penyimpanan untuk kata-kata kasar yang terdeteksi
    this._st = false;
}


static getboundPosition(word, _position){
  
    var paragap, end, output;
    
    paragap = word;
    
    while (paragap[_position] == " ") _position--;
    
    _position = paragap.lastIndexOf(" ", _position) + 1;
    
    end = paragap.indexOf(" ", _position);
    
    if (end == -1){
      
      end = paragap.length;
    
    }
    output = replaceLettersAndRemoveCertainSpecialChars(paragap.substring(_position, end), ".,"); // Pisahkan bagian kata
    return output;
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

            let findMissing  = findMissingParts(json_[i].word, filters);
            
            if (wordlist_ != false) {
            
              position_.push(json_[i].position_);
            
            }else if(findMissing){
            
              if (findMissing.remaining && findMissing.matched==null){
            
                let findsimiliar = findSimilarMatches(replaceLettersAndRemoveCertainSpecialChars(findMissing.remaining, ".,"), filters), indexing = -1;
            
                indexing = findHighestSimilarityIndex(findsimiliar);
            
                if (indexing>=0){
            
                  const countChars = findsimiliar[indexing]?.countChars;
            
                  const halfMissingLength = Math.floor(findMissing.remaining.length / 2);
            
                  const iscountCharsValid = (countChars - findMissing.remaining.length) <= halfMissingLength;
            
                  const isSimilarityValid = findsimiliar[indexing].similarity >= 60;
                  if (iscountCharsValid && isSimilarityValid) {
            
                      position_.push(json_[i].position_);
            
                  };
            
                };
            
              }
            
            };

        }
      
    };
  
    return position_;

}

['position']() {
  
    var positionList = this.constructor.position_static(this.__text__.toString(), this.__filt__);
    if (positionList.length>0){
      positionList = positionList.filter(check => {
        const word_s = this.constructor.getboundPosition(this.__text__.toLowerCase().toString(), check);
        // true jika kondisi _st aktif (true) dan word_s tidak cocok dengan filter atau subfilter.
        // Jika kondisi tersebut tidak terpenuhi, maka word_s cocok dengan filter yang dikembalikan.
        return (this._st && !(word_s.match(this.__filt__)||word_s.match(this.__subfilter__))) || word_s.match(this.__filt__);
      });
    };
    return positionList;

}

get ['thisToxic'](){
  
    var check = this.position();

    var after ="", before ="", check_repr ="";
    
    var arry = [];
    
    if (check != null || check != 0) {
    
        var word = this.__text__.toLowerCase();
    
        function before_str(number , key){

          return word.substring(number, word.indexOf(key));//nomer dan keyword
        
        };

        function after_str(w, spec){
          let data =word.substring( word.indexOf(w), spec.length+word.length );
          return data.replace(w, "").trim(); //, word.indexOf(spec));
        };

        for (var i = 0; i < check.length; i++) {
              
              const word_s = this.constructor.getboundPosition(this.__text__.toLowerCase().toString() , check[i]);

              before = before_str(0 , word_s).toString().split(" ");

              after = after_str(word_s, this.__text__).toString().split(" ");

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

                    if (d.match(this.__subfilter__)){

                        this.__subtxic.push([d, '*'.repeat(d.length)]);
                      
                    };
                    
                });
              };
              if (after){
                after.forEach(d=>{

                    if (d.match(this.__subfilter__)){

                        this.__subtxic.push([d, '*'.repeat(d.length)]);

                    };

                });
              };
              try{
                  
                  if (before[before.length-1].match(this.__subfilter__) != null) {
                      
                      check_repr = before[before.length-1].match(this.__subfilter__);

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

                  else if (after[0].match(this.__subfilter__) != null){

                      check_repr = after[0].match(this.__subfilter__);

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

                  else if (after[1].match(this.__subfilter__) != null){

                      check_repr = after[1].match(this.__subfilter__);

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
                
                if ( this.__text__.match(this.__filt__) != null) {
                      
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
    
    function hasSpecialCharAtEnd(str) {
      const specialCharRegex = /[!.,]+$/;
      return specialCharRegex.test(str);
    };

    if ((position || this.__subtxic) && this.__emoji__.test(this.__text__) && this._st) {
        this.__text__ = this.__text__.replace(this.__emoji__, (matchedWord) => '*'.repeat(matchedWord.length-1));
    };

    word = this.__text__.split(" ");

    position.forEach(number => {
      var get_word = this.constructor.getboundPosition(this.__text__.toString(), number);
      word.forEach((w, i) => {
          if (!(validateInput("email", w) || validateInput("url", w))) {
            let specialChar = '';
      
            // Jika ada karakter khusus di akhir, pisahkan karakter tersebut
            const match = get_word.match(/^([a-zA-Z]+)([^a-zA-Z][0-9]*)$/);
            if (hasSpecialCharAtEnd(w) && match) {
              const [fullMatch, wordPart, specialPart] = match;
              get_word = replaceLettersAndRemoveCertainSpecialChars(wordPart, ".,"); // Pisahkan bagian kata
              specialChar = specialPart; // Pisahkan bagian karakter khusus
            };
            // Lakukan penggantian dan tambahkan karakter khusus di akhir (jika ada)
            word[i] = w.replace(get_word, (matchedWord) => '*'.repeat(matchedWord.length)) + specialChar;
          }
      });
    });
    
  
    this.__subtxic.forEach(([oldWord, newWord]) => {
      word.forEach((w, i) => {
        if (!(validateInput("email", w) || validateInput("url", w)) && this._st) {
          let specialChar = '';
          
          // Jika ada karakter khusus di akhir, pisahkan karakter tersebut
          if (hasSpecialCharAtEnd(w) && oldWord.match(this.__subfilter__)) {
              const match = oldWord.match(/^([a-zA-Z]+)([^a-zA-Z][0-9]*)$/);
              if (match) {
                const [fullMatch, wordPart, specialPart] = match;
                oldWord = wordPart; // Pisahkan bagian kata
                specialChar = specialPart; // Pisahkan bagian karakter khusus
              };
          };
          
          // Ganti oldWord dengan '*' tanpa mempengaruhi karakter khusus di akhir
          word[i] = w.replace(oldWord, (matchedWord) => '*'.repeat(matchedWord.length)) + specialChar;
        }
      });
    });

    return word.join(" ");

}

};


class filters_badword extends FilterBadWord{

['text_o'](text){
  
  this.__text__ = text.toString();

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
            this.__subfilter__ = new RegExp(this.__subfilter__.source + "|" + escapeRegExp(readata.join("|")), "gi");
        };
    }else{
      if (customSubFilter.includes("|")) this.__subfilter__ = new RegExp(this.__subfilter__.source+"|"+escapeRegExp(customSubFilter), "gi");
    };
    isfiles = true;
  };

  if (customFilter.length>3){
      this.__filt__ = new RegExp(this.__filt__.source+"|"+escapeRegExp(customFilter), "gi");
  };
  if (customSubFilter.length>3 && !isfiles){
      this.__subfilter__ = new RegExp(this.__subfilter__.source+"|"+escapeRegExp(customSubFilter), "gi");
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
    
    return this.__text__.trim();
  
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
  };
};
