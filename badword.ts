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


function RegexMatch(word: string, regex: RegExp): boolean {
    const words = word.trim();
    const barisdata: string[] = [];

    if (words) {
        for (let index = 0; index < words.length; index++) {
        const datacocok = barisdata.join("").toLowerCase();

        if (datacocok.match(regex)) {
            return true;
        } else {
            let modifiedWord = words[index];

            if (modifiedWord.includes("3")) {
            modifiedWord = modifiedWord.replace("3", "e");
            } else if (modifiedWord.includes("0")) {
            modifiedWord = modifiedWord.replace("0", "o");
            } else if (modifiedWord.includes("4")) {
            modifiedWord = modifiedWord.replace("4", "a");
            } else if (modifiedWord.includes("5")) {
            modifiedWord = modifiedWord.replace("5", "s");
            } else if (modifiedWord.includes("8")) {
            modifiedWord = modifiedWord.replace("8", "b");
            }

            if (datacocok.replace(/1/gi, "i").match(regex) ||
                datacocok.replace(/1/gi, "l").match(regex) ||
                datacocok.replace(/6/gi, "b").match(regex) ||
                datacocok.replace(/6/gi, "g").match(regex)) {
            return true;
            }
        }

        barisdata.push(words[index].trim());
        }
    }

    return false;
}

function escapeRegExp(strings: string): string {
    const data = strings.trim().toLowerCase().split("|").filter(Boolean);
    
    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        if (!((element.includes("(") && element.includes(")")) || 
            (element.includes("[") && element.includes("]")))) {
        data[index] = data[index]
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/[a4]/g, "[a4]")
            .replace(/[s5]/g, "[s5]")
            .replace("i", "[i1]")
            .replace("l", "[l1]")
            .replace(/[o0]/g, "[o0]")
            .replace(/[e3]/g, "[e3]")
            .replace(/[b8]/g, "[b8]")
            .replace(/[kx]/g, "[kx]");
        }
    }

    return new RegExp(data.join("|")).source;
}

function validateInput(type: string, value: string): boolean {
    let regex: RegExp;

    switch (type) {
        case 'email':
        regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|co|info|io|biz|id|us|uk|ca|au|de|fr|es|it|jp|cn|br|in|ru|mx|kr|za|nl|se|no|fi|dk|pl|pt|ar|ch|hk|sg|my|th|vn|ae|at|be|cz|hu|ro|bg|gr|lt|lv|sk|si|ee|cy)(\.[a-zA-Z]{2,})?$/;
        break;
        case 'phone':
        regex = /^(?:\+?(\d{1,3}))?[-. ]?(\(?\d{1,4}?\)?)[-.\s]?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/;
        break;
        case 'url':
        regex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
        break;
        default:
        return false; // Invalid type
    }

    return regex.test(value);
}


/**
 * A function to find the missing part of the text based on the given regex pattern.
 *
 * @param {string} text1 - The text to be matched.
 * @param {RegExp} regexPattern - The regex pattern used for matching.
 * @returns {{ matched: string | null, remaining: string }} 
 * - Returns an object containing the matched part and the rest of the text, or a default empty object if an error occurs.
 */
function findMissingParts(
    text1: string,
    regexPattern: RegExp
  ): { matched: string | null; remaining: string |null} {
    try {
      const match = text1.match(regexPattern); // Match text1 with regex
  
      if (match) {
        return {
          matched: match[0], // The part that matches the regex
          remaining: text1.replace(match[0], '') // The part that doesn't match (missing)
        };
      } else {
        return { matched: null, remaining: text1 }; // If there is no match, return the original text
      }
    } catch (e) {
      return { matched: null, remaining: null }; // Return default values on error
    }
}

  
function findHighestSimilarityIndex(matches:Array<{similarity: number}>) {
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
 * A function to find similar matches from data based on the given regex pattern.
 *
 * @param {string} data1 - String to match.
 * @param {RegExp} regex - The regex pattern used to match the strings.
 * @returns {Array<{ matched: string, missingChars: number, similarity: number, countChars: number }> | null} 
 * - Returns an array of objects containing matched patterns, missing characters, similarity score,
 *   and count of matched characters or null if no matches found.
 */
function findSimilarMatches(
    data1: string,
    regex: RegExp
  ): Array<{ matched: string; missingChars: number; similarity: number; countChars: number }> | null {
    const regexMatches: Array<{ matched: string; missingChars: number; similarity: number; countChars: number }> = [];
    const possiblePatterns: string[] = regex.source.split('|'); // Retrieve regex patterns
  
    // Function to calculate Levenshtein distance considering characters in brackets
    function getLevenshteinDistance(str1: string, str2: string): number {
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
  
    // Function to convert regex pattern to a simpler form for calculating Levenshtein distance
    function convertPattern(pattern: string): { converted: string; matchedCount: number } {
      let converted = '';
      let matchedCount = 0; // Variable to count the number of matched characters
      let i = 0;
  
      while (i < pattern.length) {
        if (pattern[i] === '[') {
          // Find the closing position ']'
          const closingBracket = pattern.indexOf(']', i);
          if (closingBracket !== -1) {
            // Count the number of characters in the brackets
            matchedCount += closingBracket - i - 1; // Count the number of characters in []
            converted += 'X'; // Replace the character in brackets with 'X'
            i = closingBracket + 1; // Skip content within brackets
          } else {
            converted += pattern[i]; // If there is no closing bracket, keep adding characters
            i++;
          }
        } else if (pattern[i] === '?') {
          // Ignore '?'
          i++;
        } else {
          converted += pattern[i]; // Add other characters
          i++;
        }
      }
  
      return { converted, matchedCount }; // Return the converted pattern and matched character count
    }
  
    // Match the regex to each pattern
    possiblePatterns.forEach((pattern) => {
      const testRegex = new RegExp(pattern); // Regex for matching
      const matchResult = testRegex.exec(data1); // Search for matches
  
      if (matchResult) {
        regexMatches.push({
          matched: pattern,
          missingChars: 0,
          similarity: 100, // If full match, no missing characters
          countChars: (pattern.match(/\[[^\]]+\]/g) || []).length, // Count the number of characters in []
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
          missingChars: missingChars + levDistance, // Add Levenshtein distance
          similarity: Math.floor(similarity), // Round down the similarity percentage
          countChars: matchedCount, // Store the number of matched characters
        });
      }
    });
  
    return regexMatches.length > 0 ? regexMatches : null;
  }
  
function replaceLettersAndRemoveCertainSpecialChars(word:string, charsToRemove:string) {
    // Create a regex based on the special characters you want to remove
    const specialCharsRegex = new RegExp(`[${charsToRemove}]`, 'g');
    // Removing certain special characters
    return word.replace(specialCharsRegex, '');
}

class FilterBadWord {
    protected __text__: string;
    protected __filt__: RegExp;
    protected __subfilter__: RegExp;
    protected __emoji__: RegExp;
    protected __subtxic: [string, string][];
    protected _st: boolean|{cEmoji:boolean, subObject:boolean, deepcensor:boolean};

    constructor(text: string = "", customFilter: string = "", customSubFilter: string = "") {
        this.__text__ = text;
        this.__filt__ = /b[a4][s5]hfu[l1][l1]|k[i1][l1][l1]|fuck[*]?|dr[uo]g[*]?|d[i1]ck[*]?|[a4][s5][s5]|[l1][i1]p|pu[s5][s5]y[*]?|fk/gi;
        this.__subfilter__ = /[a4][s5][s5]|[l1][i1]p|pu[s5][s5]y[*]?|[s5]uck[*]?|m[o0]th[e3]r[*]?|m[o0]m[*]?|d[o0]g[*]?|l[o0]w[*]?|s[e3]x[*]?/gi;

        if (customFilter.length > 3) {
        this.__filt__ = new RegExp(this.__filt__.source + "|" + escapeRegExp(customFilter), "gi");
        }
        
        if (customSubFilter.length > 3) {
        this.__subfilter__ = new RegExp(this.__subfilter__.source + "|" + escapeRegExp(customSubFilter), "gi");
        }

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

        this.__subtxic = [];
        this._st = false;
    }

    private getBoundPosition(word: string, position: number): string {
        let paragraph = word;

        while (position > 0 && paragraph[position] === " ") position--;

        position = paragraph.lastIndexOf(" ", position) + 1;
        let end = paragraph.indexOf(" ", position);

        if (end === -1) {
        end = paragraph.length;
        }

        return replaceLettersAndRemoveCertainSpecialChars(paragraph.substring(position, end), ".,");
    }

    private positionStatic(word: string, filters: RegExp): number[] {
        // Initialize variables
        let position = 0;
        const wordlist = word.toLowerCase().split(' ');
      
        // Map each word to an object containing the word and its position
        const json = wordlist.map((word, index) => {
          if (index > 0) {
            // Update the position based on the length of the previous word + 1 (for the space)
            position += wordlist[index - 1].length + 1;
          }
          return { word, position };
        });
      
        // Reset position to an empty array for collecting positions of filtered words
        let positions: number[] = [];
      
        // Loop through each word in the json array
        for (let i = 0; i < json.length; i++) {
          let wordMatch = json[i].word.match(filters);
      
          if (wordMatch) {
            positions.push(json[i].position);
          } else {
            // Process if the word is assumed to be inappropriate or offensive
            let regexMatch = RegexMatch(json[i].word, filters);
            let findMissing = findMissingParts(json[i].word, filters);
      
            if (regexMatch) {
              positions.push(json[i].position);
            } else if (findMissing && findMissing.remaining != null && findMissing.matched == null) {
              let similarMatches = findSimilarMatches(replaceLettersAndRemoveCertainSpecialChars(findMissing.remaining, ".,"), filters);
              let highestSimilarityIndex = findHighestSimilarityIndex(similarMatches||[]);
      
              if (highestSimilarityIndex >= 0) {
                const similarMatch = similarMatches?  similarMatches[highestSimilarityIndex] : {countChars:0, similarity:0};
                const countChars = similarMatch.countChars;
                const halfMissingLength = Math.floor(findMissing.remaining.length / 2);
      
                const isValidChars = (countChars - findMissing.remaining.length) <= halfMissingLength;
                const isValidSimilarity = similarMatch.similarity >= 60;
      
                if (isValidChars && isValidSimilarity) {
                  positions.push(json[i].position);
                }
              }
            }
          }
        }
      
        return positions;
    }

    public position(): number[] {
        const thismart = typeof this._st === 'object' ? this._st?.deepcensor : this._st;
        // Call the static method to get a list of positions based on the text and filter
        var positionList = this.positionStatic(this.__text__.toString(), this.__filt__);

        // Check if the position list has any elements
        if (positionList.length > 0) {
            // Filter the position list based on specific conditions
            positionList = positionList.filter(check => {
                // Get the bound word for the current position
                const word_s = this.getBoundPosition(this.__text__.toLowerCase().toString(), check);
                
                // Check conditions based on the _st status
                // If _st is true and word_s does not match the main filter or subfilter,
                // or if it matches the main filter, include it in the filtered list.
                return (thismart && !(word_s.match(this.__filt__) || word_s.match(this.__subfilter__))) || word_s.match(this.__filt__);
            });
        }
            return positionList;
    }

    public get thisToxic(): (string | number)[] | false {
        const check = this.position();
        const arry: (string | number)[] = [];

        if (check.length > 0) {
        const word = this.__text__.toLowerCase();
        
        for (const index of check) {
            const word_s = this.getBoundPosition(this.__text__.toLowerCase(), index);
            const before = word.substring(0, word.indexOf(word_s)).trim().split(" ");
            const after = word.substring(word.indexOf(word_s) + word_s.length).trim().split(" ");

                    // Check before
                    before.forEach(d => {
                        if (d.match(this.__subfilter__)) {
                            this.__subtxic.push([d, '*'.repeat(d.length)]);
                        }
                    });

                    // Check after
                    after.forEach(d => {
                        if (d.match(this.__subfilter__)) {
                            this.__subtxic.push([d, '*'.repeat(d.length)]);
                        }
                    });

                    // Add toxic word if found in before or after
                    if (before.length && before[before.length - 1].match(this.__subfilter__)) {
                        arry.push("Toxic", 1, before[before.length - 1]);
                        return arry;
                    }

                    if (after.length && after[0].match(this.__subfilter__)) {
                        arry.push("Toxic", 1, after[0]);
                        return arry;
                    }

                    if (after.length > 1 && after[1].match(this.__subfilter__)) {
                        arry.push("Toxic", 1, after[1]);
                        return arry;
                    }
        }

        arry.push("Notoxic", 0);
        return arry;
        }

        return false;
    }

    set thisToxic(key: any) {
        throw key;
    }

    public clean(position: number[]): string {
        const thismartsubObject = typeof this._st === 'object' ? this._st?.subObject : this._st, 
        thismartEmoji= typeof this._st === 'object' ? this._st?.cEmoji : this._st;
        if ((position || this.__subtxic) && this.__emoji__.test(this.__text__) && thismartEmoji) {
            // Replace emojis in the text with asterisks (keeping one character visible)
            this.__text__ = this.__text__.replace(this.__emoji__, '*'.repeat(1));
        };
        
        let words = this.__text__.split(" ");
        const sensor = "*";
        
        position.forEach((number) => {
            const getWord = this.getBoundPosition(this.__text__, number);
            words = words.map(word => word.replace(getWord, sensor.repeat(getWord.length)));
        });
        
        this.__subtxic.forEach(([oldWord, newWord]) => {
            words = words.map(word => {
                return !(validateInput("email", word) || validateInput("url", word)) && thismartsubObject
                ? word.replace(oldWord, newWord): word;
            });
        });
        return words.join(" ");
    }
}

class filters_badword extends FilterBadWord {
    protected _cl: boolean;
    protected _st: boolean|{cEmoji:boolean, subObject:boolean, deepcensor:boolean};
    
    constructor() {
        super(); // Memanggil konstruktor kelas induk
        this._cl = true; // Inisialisasi properti cl
        this._st = true; // Inisialisasi properti st
    }

    public text_o(text: string): void {
        this.__text__ = text.toString();
    }

    public config(cl: boolean = true, smart: boolean|{cEmoji:boolean, subObject:boolean, deepcensor:boolean} = true, customFilter: string = "", customSubFilter: string = ""): void {
        this._cl = cl;
        this._st = smart;

        if (customFilter.length > 3) {
            this.__filt__ = new RegExp(this.__filt__.source + "|" + escapeRegExp(customFilter), "gi");
        }
        if (customSubFilter.length > 3) {
            this.__subfilter__ = new RegExp(this.__subfilter__.source + "|" + escapeRegExp(customSubFilter), "gi");
        }
    }

    public get cleans(): string {
        if (this._cl) {
            if (this.thisToxic){
                if (this.thisToxic[1] === 1 && this.thisToxic.length > 2) {
                    return this.clean(this.position());
                };
            };
            return this.clean(this.position());
        };
        return this.__text__.trim();
    }

    set cleans(value: string) {
        throw value;
    }
}

export {
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
