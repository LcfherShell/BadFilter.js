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
 * Function to check if the word matches the regex pattern
 * @param {string} word - the word string to be checked
 * @param {regex} regex - the regex pattern that will be used to check the words
 * @return {boolean} - true if the word matches the regex pattern, false otherwise
 */
function RegexMatch(word, regex) {
  // Trim whitespace from the input word
  var modWord = word.trim();
  let escapeDta = []; // Array to store processed characters
  
  // Check if the modified word is not empty
  if (modWord) {
      // Iterate through each character in the modified word
      for (let index = 0; index < modWord.length; index++) {
          // Join the processed characters into a string and convert to lowercase
          let currChar = escapeDta.join("").toLowerCase();
          
          // Check if the current processed string matches the regex
          if (currChar.match(regex)) {
              return true; // Return true if a match is found
          } else {
              // Check and replace leetspeak characters with their corresponding letters
              if (modWord[index] === "3") {
                  modWord = modWord.replace("3", "e");
              } else if (modWord[index] === "0") {
                  modWord = modWord.replace("0", "o");
              } else if (modWord[index] === "4") {
                  modWord = modWord.replace("4", "a");
              } else if (modWord[index] === "5") {
                  modWord = modWord.replace("5", "s");
              } else if (modWord[index] === "$") {
                  modWord = modWord.replace("$", "s");
              } else if (modWord[index] === "8") {
                  modWord = modWord.replace("8", "b");
              } else if (modWord[index] === "&") {
                  modWord = modWord.replace("&", "b");
              }

              // Check for matches after replacing with leetspeak alternatives
              if (currChar.replace(/[1!]/gi, "i").match(regex)) {
                  return true;
              } else if (currChar.replace(/[1!]/gi, "l").match(regex)) {
                  return true;
              } else if (currChar.replace(/6/gi, "b").match(regex)) {
                  return true;
              } else if (currChar.replace(/6/gi, "g").match(regex)) {
                  return true;
              }
          }
          // Add the current character to the escape data array
          escapeDta.push(modWord[index].trim());
      }
  }
  // Return false if no matches are found
  return false;
}

/**
 * This function processes an input string containing multiple terms,
 * separates the terms based on the separator character (|),
 * and performs a transformation to make the terms safe to use in a regular expression (regex).
 * 
 * @param {string} strings - Input string containing terms separated by | characters.
 * @returns {Array<string>} - An array containing terms that have been processed and are safe to use in a regex.
 */
function escapeRegExp(strings) {
  // Trim whitespace, convert to lowercase, and split the input into an array using "|" as the delimiter
  let data = strings.trim().toLowerCase().split("|").filter(Boolean);
  
  // Iterate over each element in the array
  for (let index = 0; index < data.length; index++) {
      const element = data[index];

      // Check if the element already contains parentheses or brackets
      if (!((element.includes("(") && element.includes(")")) || 
            (element.includes("[") && element.includes("]")))) {
          // Escape special characters and apply leetspeak transformations
          data[index] = data[index].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
              .replace(/[a4]/g, "[a4]") // Replace 'a' with '[a4]'
              .replace(/[s5]/g, "[s5]") // Replace 's' with '[s5]'
              .replace("i", "[i1]") // Replace 'i' with '[i1]'
              .replace("l", "[l1]") // Replace 'l' with '[l1]'
              .replace(/[o0]/g, "[o0]") // Replace 'o' with '[o0]'
              .replace(/[e3]/g, "[e3]") // Replace 'e' with '[e3]'
              .replace(/[b8]/g, "[b8]") // Replace 'b' with '[b8]'
              .replace(/[kx]/g, "[kx]") // Replace 'k' or 'x' with '[kx]'
              + "[^a-z]?"; // Allow for a non-letter character at the end
      };
  };

  // Join the processed elements into a single regex pattern and create a RegExp object
  data = new RegExp(data.join("|"));
  return data.source; // Return the source pattern of the regex
}

/**
 * Functions to validate inputs based on the given type (email, phone number, or URL).
 *
 * @param {string} type - The input type to be validated ('email', 'phone', 'url').
 * @param {string} value - The value to be validated.
 * @returns {boolean} - Returns true if the value is valid according to the given type, false otherwise.
 */
function validateInput(type, value) {
  let regex;
  switch (type) {
      case 'email':
          // Complex regex for email
          regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|co|info|io|biz|id|us|uk|ca|au|de|fr|es|it|jp|cn|br|in|ru|mx|kr|za|nl|se|no|fi|dk|pl|pt|ar|ch|hk|sg|my|th|vn|ae|at|be|cz|hu|ro|bg|gr|lt|lv|sk|si|ee|cy)(\.[a-zA-Z]{2,})?$/;
          break;
      case 'phone':
          // Complex regex for phone numbers (example: +1-234-567-8900, (123) 456-7890, 123-456-7890, 1234567890)
          regex = /^(?:\+?(\d{1,3}))?[-. ]?(\(?\d{1,4}?\)?)[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
          break;
      case 'url':
          // Complex regex for URL
          regex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
          break;
      default:
          return false; // Invalid type
  }
  return regex.test(value);
};




///versi terbaru

/**
 * A function to find the missing part of the text based on the given regex pattern.
 *
 * @param {string} text1 - The text to be matched.
 * @param {RegExp} regexPattern - The regex pattern used for matching.
 * @returns {object|boolean} - Returns an object containing the matched part and the rest of the text, 
 * or false if an error occurs.
 */
function findMissingParts(text1, regexPattern) {
  try {
    const regex = regexPattern; // Create a regex from regexPattern, case insensitive
    const match = text1.match(regex); // Match text1 with regex

    if (match) {
      return {
        matched: match[0], // The part that matches the regex
        remaining: text1.replace(match[0], '') // The part that doesn't match (missing)
      };
    } else {
      return { matched: null, remaining: text1 }; // If there is no match, return the original text
    }
  } catch (e) {
    return false;
  }
};


/**
 * A function to find similar matches from data based on the given regex pattern.
 *
 * @param {Array<string>} data1 - Array of strings to match.
 * @param {RegExp} regex - The regex pattern used to match the strings.
 * @returns {Array<string>} - Returns an array of strings that match the regex pattern 
 * or similar strings based on Levenshtein distance.
 */
function findSimilarMatches(data1, regex) {
  const regexMatches = [];
  const possiblePatterns = regex.source.split('|'); // Retrieve regex patterns

  // Function to calculate Levenshtein distance considering characters in parentheses
  function getLevenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const dp = Array.from(Array(len1 + 1), () => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) {
      for (let j = 0; j <= len2; j++) {
        if (i === 0) {
          dp[i][j] = j; // If str1 is empty
        } else if (j === 0) {
          dp[i][j] = i; // If str2 is empty
        } else if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]; // If characters are equal
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]); // Edit operation
        }
      }
    }
    return dp[len1][len2];
  }
  // Function to calculate Levenshtein distance by converting regex pattern
  function convertPattern(pattern) {
    let converted = '';
    let matchedCount = 0; // Variable to count the number of matched characters
    let i = 0;

    while (i < pattern.length) {
      if (pattern[i] === '[') {
        // Find the closing position ']'
        let closingBracket = pattern.indexOf(']', i);
        if (closingBracket !== -1) {
          // Count the number of characters in the brackets
          matchedCount += closingBracket - i - 1; // Count the number of characters in []
          converted += 'X'; // Replace the character in parentheses with 'X'
          i = closingBracket + 1; // Skip content within parentheses
        } else {
          converted += pattern[i]; // If there is no closing, keep adding characters
          i++;
        }
      } else if (pattern[i] === '?') {
        // Ignore '?'
        i++;
      } else {
        converted += pattern[i]; // Add another character
        i++;
      }
    }

    return { converted, matchedCount }; // Returns the converted pattern and the number of matched characters
  }

  // Match the regex to each pattern
  possiblePatterns.forEach(pattern => {
    const testRegex = new RegExp(pattern); // Regex for matching
    const matchResult = testRegex.exec(data1); // Search for matches

    if (matchResult) {
      regexMatches.push({
        matched: pattern,
        missingChars: 0,
        similarity: 100, // If full match, no missing characters
        countChars: (pattern.match(/\[[^\]]+\]/g) || []).length // Count the number of characters in []
      });
    } else {
      // Convert pattern to calculate Levenshtein distance
      const { converted: convertedPattern, matchedCount } = convertPattern(pattern);
      const levDistance = getLevenshteinDistance(data1, convertedPattern);
      const maxLength = Math.max(data1.length, convertedPattern.length);
      const similarity = ((maxLength - levDistance) / maxLength) * 100;

      // Calculate the missing characters of the pattern
      const missingChars = Math.abs(data1.length - convertedPattern.length);

      // Store results for patterns that are close matches
      regexMatches.push({
        matched: pattern,
        missingChars: missingChars + levDistance, // Adds Levenshtein distance
        similarity: Math.floor(similarity.toFixed(2)),
        countChars: matchedCount // Stores the number of matched characters
      });
    }
  });

  return regexMatches.length > 0 ? regexMatches : null;
};

/**
 * A function to find the index of the match with the highest similarity value.
 *
 * @param {Array<{similarity: number}>} matches - Array of objects containing similarity values.
 * @returns {number} - Returns the index of the match with the highest similarity, or -1 if there is none.
 */
function findHighestSimilarityIndex(matches) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return -1; // If there are no results, return -1
  }

  let highestIndex = 0; // Initial index
  let highestSimilarity = matches[0].similarity; // Initial highest similarity value

  matches.forEach((match, index) => {
    if (match.similarity > highestSimilarity) {
      highestSimilarity = match.similarity; // Update the highest similarity
      highestIndex = index; // Update the highest index
    }
  });

  return highestIndex; // Return the index with the highest similarity
}

/**
 * A function to remove certain special characters from a word.
 *
 * @param {string} word - The word to be cleaned of special characters.
 * @param {string} charsToRemove - The special characters to remove.
 * @returns {string} - The word that has been cleaned of the specified special characters.
 */
function replaceLettersAndRemoveCertainSpecialChars(word, charsToRemove) {
  // Create a regex based on the special characters you want to remove
  const specialCharsRegex = new RegExp(`[${charsToRemove}]`, 'g');
  
  // Removing certain special characters
  var cleanedWord = word.replace(specialCharsRegex, '');
  return cleanedWord;
}

class FilterBadWord{
/**
* @param {string} text - The original text to be processed. 
* This is an input containing words or phrases that will be 
* checked for the detection of abusive words and emojis.
* 
* @param {string} customFilter - An additional custom filter 
* that can be used to detect special offensive words. 
* If the filter length is more than 3 characters, this filter will be added 
* to the default filter to improve detection.
* 
* @param {string} customSubFilter - An additional custom subfilter 
* to detect more specific offensive words. 
* Just like customFilter, if the subfilter length is more than 
* 3 characters, it will be merged with the default subfilter.
*/
constructor(text = "", customFilter="", customSubFilter=""){
    

    // Initialize instance properties
    this.__text__ = text; // Original text to be processed
    
    // Default filter for detecting common offensive words
    this.__filt__ = /^b[a4][s5]hfu[l1][l1][^a-z]?|[8b]r[e3][a4][s5]t[^a-z]?|[b8][o0][o0][b8][^a-z]?|k[i1][l1][l1][^a-z]?|fuck[^a-z]?|dr[uo]g[^a-z]?|d[i1]ck[^a-z]?|[a4][s5][s5][^a-z]?|[l1][i1]p|pu[s5][s5]y[^a-z]?|fk[^a-z]?/gi;
    
    // Default subfilter for more specific offensive words
    this.__subfilter__ = /^[a4][s5][s5][^a-z]?|[l1][i1]p[^a-z]?|pu[s5][s5]y[^a-z]?|[s5]uck[^a-z]?|m[o0]th[e3]r[^a-z]?|m[o0]m[^a-z]?|d[o0]g[^a-z]?|l[o0]w[^a-z]?|s[e3]x[^a-z]?|[8b]r[e3][a4][s5]t/gi;
    
    // Add custom filter if provided
    if (customFilter.length>3){
        this.__filt__ = new RegExp(this.__filt__.source+"|"+escapeRegExp(customFilter), "gi");
    };
    // Add custom subfilter if provided
    if (customSubFilter.length>3){
        this.__subfilter__ = new RegExp(this.__subfilter__.source+"|"+escapeRegExp(customSubFilter), "gi");
    };
    
    // Mapping emojis to a regular expression for detection
    this.__emoji__ = new RegExp([
      // Emoji dengan penjelasan
      '😈', // Menunjukkan niat nakal atau licik.
      '👿', // Menunjukkan sifat jahat; sering digunakan dalam konteks humor atau kejahatan.
      '🍆', // Merujuk pada bentuknya yang mirip dengan organ genital pria; sering digunakan secara seksual.
      '🍑', // Merujuk pada bokong; sering digunakan secara seksual.
      '🐄', // Sering diplesetkan untuk merujuk pada wanita.
      '🐐', // Sering diplesetkan untuk merujuk pada wanita atau pria.
      '🍋', // Merujuk pada hubungan sesama jenis; sering digunakan secara seksual.
      '🌈', // Simbol untuk hubungan sesama jenis; sering digunakan dalam konteks LGBT.
      '🏳️‍🌈', // Menunjukkan identitas LGBT; sering diasosiasikan dengan hak-hak LGBT.
      '🍉', // Sering diplesetkan untuk merujuk pada ukuran dada wanita.
      '💦', // Dapat merujuk pada aktivitas seksual; menunjukkan keringat atau air.
      '😍', // Menunjukkan cinta atau ketertarikan yang mendalam.
      '🥵', // Menunjukkan ketertarikan fisik atau perasaan terlalu panas.
      '🤤', // Menunjukkan keinginan seksual atau ketertarikan yang kuat.
      '🥥', // Menunjukkan pakaian dalam atau ukuran dada wanita.
      '👙', // Menunjukkan pakaian dalam wanita; sering digunakan dalam konteks mode atau kolam renang.
      '💣', // Menunjukkan ledakan atau kekerasan; dapat digunakan dalam konteks drama atau peringatan.
      '🔪', // Menunjukkan kekerasan; sering digunakan dalam konteks ancaman atau agresi.
      '🔫', // Menunjukkan senjata api; sering digunakan dalam konteks kekerasan atau ancaman.
      '⚔️', // Menunjukkan pertarungan atau konflik; sering digunakan dalam konteks sejarah atau fantasi.
      '💥', // Menunjukkan kekuatan atau dampak; bisa merujuk pada situasi dramatis atau kekerasan.
      '🔨', // Sering digunakan dalam konteks konstruksi atau kekerasan; bisa menunjukkan agresi.
      '🖕'  // Menunjukkan penghinaan atau ketidaksenangan; sering dianggap sebagai gesture kasar.
    ].join("|"), "gi");
  

    // Storage for detected offensive words
    this.__subtxic = []; 
    this._st = false; // Flag for smart processing, initially set to false
}

/**
 * Retrieves words bound around a specific position in the text.
 *
 * @param {string} word - The input text to be processed.
 * @param {number} _position - The position where the word search will start.
 * @returns {string} - Returns the word found at the specified position.
 */
static getBoundPosition(word, _position){
  
    // Initialize variables
    var paragap, end, output;
    
    // Assign the input word to paragap
    paragap = word;
    
    // Move _position backwards until a non-space character is found
    while (paragap[_position] == " ") _position--;
    
    // Find the last space before the current position and adjust _position to the start of the word
    _position = paragap.lastIndexOf(" ", _position) + 1;
    
    // Find the next space after the current position
    end = paragap.indexOf(" ", _position);
    
    // If no space is found, set end to the length of the paragraph
    if (end == -1) {
        end = paragap.length;
    }
    
    // Extract the substring from _position to end, and clean it using the specified function
    output = replaceLettersAndRemoveCertainSpecialChars(paragap.substring(_position, end), ".,");
    return output;
}

/**
 * Determines the position of the word that matches the filter in the given text.
 *
 * @param {string} word - The input text to be processed.
 * @param {RegExp} filters - Filter patterns for matching words.
 * @returns {Array} - Returns an array of word positions that match the filters.
 */
static ['position_static'](word, filters){
    // Initialize variables
    var wordlist_, filt, result, json_, position_;

    
    position_ = 0;
    // Split the input word into lowercase words
    wordlist_ = word.toLowerCase().split(' ');
    
    // Map each word to an object containing the word and its position
    json_ = wordlist_.map( (word, index) => {
      // Update the position based on the length of the previous word
      position_ = index&&wordlist_[index - 1].length+position_+1; // Calculate the position
      
      return {word, position_} // Return an object with word and position
    
    });

    // Reset position_ to an empty array for collecting positions of filtered words
    position_ = [];
    
    // Loop through each word in the json_ array
    for (var i = 0; i < json_.length; i++) {

        // Check if the current word matches the filters
        wordlist_ = json_[i].word.match(filters);

        // If there is a match (not null or zero)
        if (wordlist_ != null || wordlist_ === 0 ) {
          
          position_.push(json_[i].position_);
      
        }else{

            // Process if the word is assumed to be inappropriate or offensive

            wordlist_ = RegexMatch(json_[i].word, filters); // Check with RegexMatch function

            let findMissing  = findMissingParts(json_[i].word, filters); // Find missing parts
            
            // If there is a match from RegexMatch
            if (wordlist_ != false) {
            
              position_.push(json_[i].position_);
            
            }else if(findMissing){

              // If there are missing parts, try to find similar matches
              if (findMissing.remaining && findMissing.matched==null){ // Check conditions
                
                let findsimiliar = findSimilarMatches(replaceLettersAndRemoveCertainSpecialChars(findMissing.remaining, ".,"), filters), indexing = -1;
                
                // Find the highest similarity index
                indexing = findHighestSimilarityIndex(findsimiliar);
                
                // If a similar match is found
                if (indexing>=0){
            
                  const countChars = findsimiliar[indexing]?.countChars;
            
                  const halfMissingLength = Math.floor(findMissing.remaining.length / 2); // Calculate half of the missing length
            
                  const iscountCharsValid = (countChars - findMissing.remaining.length) <= halfMissingLength; // Check character validity
            
                  const isSimilarityValid = findsimiliar[indexing].similarity >= 60; // Check similarity percentage

                  // If both character count and similarity conditions are met
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

/**
 * Get the position list of toxic words in the text based on the applied filter.
 *
 * @returns {Array} - A list of positions containing the indexes of poisonous words
 * in the text based on the specified filter.
 */
['position']() {
  
   // Call the static method to get a list of positions based on the text and filter
   var positionList = this.constructor.position_static(this.__text__.toString(), this.__filt__);

   // Check if the position list has any elements
   if (positionList.length > 0) {
       // Filter the position list based on specific conditions
       positionList = positionList.filter(check => {
           // Get the bound word for the current position
           const word_s = this.constructor.getBoundPosition(this.__text__.toLowerCase().toString(), check);
           
           // Check conditions based on the _st status
           // If _st is true and word_s does not match the main filter or subfilter,
           // or if it matches the main filter, include it in the filtered list.
           return (this._st && !(word_s.match(this.__filt__) || word_s.match(this.__subfilter__))) || word_s.match(this.__filt__);
       });
   }
    return positionList;

}

/**
 * Get the status of toxic words in the text and adjacent words.
 *
 * @returns {Array|boolean} - Returns an array containing the status (Toxic or Notoxic)
 * and the detected word, or false if no position was found.
 */
get ['thisToxic']() {
  // Initialize variables
  var check = this.position(); // Get positions of certain words
  var after = "", before = "", check_repr = "";
  var arry = []; // Array to hold results

  // Proceed if check is not null or 0
  if (check != null || check != 0) {
      var word = this.__text__.toLowerCase(); // Convert text to lowercase

      // Function to get the substring before a keyword
      function before_str(number, key) {
          return word.substring(number, word.indexOf(key)); // Extract substring before key
      };

      // Function to get the substring after a keyword
      function after_str(w, spec) {
          let data = word.substring(word.indexOf(w), spec.length + word.length);
          return data.replace(w, "").trim(); // Remove the keyword and trim spaces
      };

      // Loop through each position in check
      for (var i = 0; i < check.length; i++) {
          // Get the word at the current position
          const word_s = this.constructor.getBoundPosition(this.__text__.toLowerCase().toString(), check[i]);

          // Get words before and after the keyword
          before = before_str(0, word_s).toString().split(" ");
          after = after_str(word_s, this.__text__).toString().split(" ");

          // Filter out empty entries in after array
          if (after.length >= 1) {
              after = after.filter(entry => entry.trim() != '');
          };

          // Filter out empty entries in before array
          if (before[before.length - 1] === "") {
              before = before.filter(entry => entry.trim() != '');
          };

          // Check words before the toxic word
          if (before) {
              before.forEach(d => {
                  if (d.match(this.__subfilter__)) {
                      this.__subtxic.push([d, '*'.repeat(d.length)]); // Mask the word
                  };
              });
          };

          // Check words after the toxic word
          if (after) {
              after.forEach(d => {
                  if (d.match(this.__subfilter__)) {
                      this.__subtxic.push([d, '*'.repeat(d.length)]); // Mask the word
                  };
              });
          };

          try {
              // Check the last word before the toxic word
              if (before[before.length - 1].match(this.__subfilter__) != null) {
                  check_repr = before[before.length - 1].match(this.__subfilter__);

                  if (check_repr != before[before.length - 1]) {
                      arry.push("Toxic"); // Mark as Toxic
                      arry.push(1);
                      break; // Exit the loop
                  };

                  arry.push("Toxic");
                  arry.push(1);
                  arry.push(before[before.length - 1]); // Add the toxic word
                  break;
              }
              // Check the first word after the toxic word
              else if (after[0].match(this.__subfilter__) != null) {
                  check_repr = after[0].match(this.__subfilter__);

                  if (check_repr != after[0]) {
                      arry.push("Toxic");
                      arry.push(1);
                      break; // Exit the loop
                  };

                  arry.push("Toxic");
                  arry.push(1);
                  arry.push(after[0]); // Add the toxic word
                  break;
              }
              // Check the second word after the toxic word
              else if (after[1].match(this.__subfilter__) != null) {
                  check_repr = after[1].match(this.__subfilter__);

                  if (check_repr != after[1]) {
                      arry.push("Toxic");
                      arry.push(1);
                      break; // Exit the loop
                  };

                  arry.push("Toxic");
                  arry.push(1);
                  arry.push(after[1]); // Add the toxic word
                  break;
              };
          } catch (err) {
              // If an error occurs and the text matches the filter
              if (this.__text__.match(this.__filt__) != null) {
                  arry.push("Toxic");
                  arry.push(1);
                  break; // Exit the loop
              };
          }
      }

      // If no toxic words were found, mark as Notoxic
      if (arry.length <= 1) {
          arry.push("Notoxic");
          arry.push(0);
      };

      return arry; // Return the result array
  };

  return false; // Return false if no positions found
}

set ['thisToxic'](key){
  
    throw key;

}

/**
 * Cleans text from offensive words and special characters 
 * based on predefined filters.
 * 
 * @param {number} position - The position where the cleaning will be performed 
 * in the text. This indicates the part of the text that will be 
 * cleaned of harsh words and unwanted characters.
 * 
 * @returns {string} - Text that has been cleaned of offensive words 
 * and special characters. If no cleaning was done, 
 * the original text will be returned.
 */
['clean'](position){
    // Initialize the variable for the word array
    var word;

    // Helper function to check if a string ends with a special character
    function hasSpecialCharAtEnd(str) {
        const specialCharRegex = /[!.,]+$/; // Regex to match special characters at the end
        return specialCharRegex.test(str);
    };

    // Check conditions for emoji handling
    if ((position || this.__subtxic) && this.__emoji__.test(this.__text__) && this._st) {
        // Replace emojis in the text with asterisks (keeping one character visible)
        this.__text__ = this.__text__.replace(this.__emoji__, (matchedWord) => '*'.repeat(matchedWord.length - 1));
    };

    // Split the text into words
    word = this.__text__.split(" ");

    // Process each position provided
    position.forEach(number => {
        // Get the word corresponding to the current position
        var get_word = this.constructor.getBoundPosition(this.__text__.toString(), number);
        
        // Iterate over the words array
        word.forEach((w, i) => {
            // Validate if the word is not an email or a URL
            if (!(validateInput("email", w) || validateInput("url", w))) {
                let specialChar = '';
                
                // Check for special characters at the end and separate them
                const match = get_word.match(/^([a-zA-Z]+)([^a-zA-Z][0-9]*)$/);
                if (hasSpecialCharAtEnd(w) && match) {
                    const [fullMatch, wordPart, specialPart] = match;
                    get_word = replaceLettersAndRemoveCertainSpecialChars(wordPart, ".,"); // Clean the word
                    specialChar = specialPart; // Keep the special character
                };

                // Replace the matched word with asterisks, append any special character at the end
                word[i] = w.replace(get_word, (matchedWord) => '*'.repeat(matchedWord.length)) + specialChar;
            }
        });
    });

    // Process replacements based on __subtxic
    this.__subtxic.forEach(([oldWord, newWord]) => {
        // Iterate over the words array
        word.forEach((w, i) => {
            // Validate if the word is not an email or a URL and if _st is active
            if (!(validateInput("email", w) || validateInput("url", w)) && this._st) {
                let specialChar = '';
                
                // Check for special characters at the end and separate them
                if (hasSpecialCharAtEnd(w) && oldWord.match(this.__subfilter__)) {
                    const match = oldWord.match(/^([a-zA-Z]+)([^a-zA-Z][0-9]*)$/);
                    if (match) {
                        const [fullMatch, wordPart, specialPart] = match;
                        oldWord = wordPart; // Keep the clean word part
                        specialChar = specialPart; // Keep the special character
                    };
                };

                // Replace oldWord with asterisks, keeping any special characters at the end
                word[i] = w.replace(oldWord, (matchedWord) => '*'.repeat(matchedWord.length)) + specialChar;
            }
        });
    });

    return word.join(" ");

}

};


class filters_badword extends FilterBadWord{

/**
* Set the text to be processed by converting the input to a string.
*
* @param {string} text - The text to be set. Can be a string 
* or other data type that will be converted to a string before being 
* stored in the __text__ property.
*/
['text_o'](text){
  
  this.__text__ = text.toString();

}

/**
 * Configure class settings with options for cleaning, 
 * smart processing, and custom filters.
 *
 * @param {boolean} [cl=true] - Specifies whether cleaning 
 * (cleaning) will be enabled. Default is true.
 * @param {boolean} [smart=true] - Specifies whether smart processing 
 * will be enabled. Default is true.
 * @param {string} [customFilter=“”] - Custom filters that can be 
 * added to the main filter. If the length is more than 3 characters, 
 * this filter will be integrated.
 * @param {string} [customSubFilter=“”] - A custom subfilter that can be 
 * added to the main subfilter. Can be a path to a file or 
 * pipe-separated string. If it is longer than 3 
 * characters and no files are processed, this subfilter will be integrated.
 */
['config'](cl = true, smart = true, customFilter = "", customSubFilter = "") {
  // Set class properties based on provided arguments
  this._cl = cl; // Flag for cleaning (default true)
  this._st = smart; // Flag for smart processing (default true)

  var isfiles = false; // Initialize flag for file processing

  // Check if running in Node.js environment
  if (isNode) {
      const { readFileSync, existsSync } = require("node:fs");

      // Check if the custom subfilter file exists
      if (existsSync(customSubFilter)) {
          var readata = readFileSync(customSubFilter).split("\n"); // Read file and split into lines
          
          // Function to extract names based on a pattern
          function extractNames(text) {
              const namePattern = /\b[A-Z][a-zàâäéèêëïîôöùûüç'-]+\b/g; // Regex for capitalized names
              return text.match(namePattern); // Match names
          };

          // Process each line in the read data
          readata = readata.map(value => (
              extractNames(value) || validateInput("email", value) || 
              validateInput("phone", value) || validateInput("url", value) ? 
              "" : value // Replace invalid entries with an empty string
          )).filter(item => item && item.trim()); // Filter out empty or whitespace-only items
          
          // If valid entries are found, update the subfilter
          if (readata.length > 1) {
              this.__subfilter__ = new RegExp(this.__subfilter__.source + "|" + escapeRegExp(readata.join("|")), "gi");
          };
      } else {
          // If customSubFilter is a pipe-separated string, update the subfilter
          if (customSubFilter.includes("|")) {
              this.__subfilter__ = new RegExp(this.__subfilter__.source + "|" + escapeRegExp(customSubFilter), "gi");
          }
      };
      isfiles = true; // Set the file processing flag to true
  };

  // If a custom filter is provided, update the main filter
  if (customFilter.length > 3) {
      this.__filt__ = new RegExp(this.__filt__.source + "|" + escapeRegExp(customFilter), "gi");
  };

  // If a custom subfilter is provided and no files were processed, update the subfilter
  if (customSubFilter.length > 3 && !isfiles) {
      this.__subfilter__ = new RegExp(this.__subfilter__.source + "|" + escapeRegExp(customSubFilter), "gi");
  };
}

/**
 * Get text that has been cleaned of toxic words.
 *
 * @returns {string} - The cleaned text. 
 * If cleaning is enabled, the text will 
 * replace the poisonous word with an asterisk if 
 * intelligent processing is enabled.
 */
get ['cleans']() {
  // Check if cleaning is enabled
  if (this._cl === true) {
      // Check if the text is marked as toxic and has additional data
      if (this.thisToxic[1] === 1 && this.thisToxic.length > 2) {
          // If smart processing is enabled
          if (this._st === true) {
              var sensore = "*"; // Initialize the masking string

              // Create a string of asterisks of the same length as the toxic word
              for (var i = 0; i < this.thisToxic[2].length; i++) {
                  sensore += "*"; // Append asterisks for each character in the toxic word
              }
              // Clean the text and replace the toxic word with asterisks
              return this.clean(this.position()).replace(this.thisToxic[2], sensore);
          }

          // If smart processing is not enabled, just clean the text
          return this.clean(this.position());
      }

      // If text is not marked as toxic, just clean it
      return this.clean(this.position());
  } else {
      // If cleaning is disabled, return the trimmed original text
      return this.__text__.trim();
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



// Export to the appropriate environment
if (isNode) {
  // If in Node.js, use module.exports
  module.exports = exportsObject;
} else {
  // If in browser, check ES Modules support
  if (typeof window.customElements !== "undefined") {
      // Support for ES Modules, use `export`
      window.exportsObject = exportsObject; // Store in window object
      Object.assign(window, exportsObject);
  } else {
      // If ES Modules is not supported, use Object.assign
      Object.assign(window, exportsObject);
  };
};
