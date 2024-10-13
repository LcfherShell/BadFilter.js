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

class FilterBadWord {
    protected _text: string;
    protected _filt: RegExp;
    protected _subfilter: RegExp;
    protected __subtxic: [string, string][];
    protected _st: boolean;

    constructor(text: string = "", customFilter: string = "", customSubFilter: string = "") {
        this._text = text;
        this._filt = /b[a4][s5]hfu[l1][l1]|k[i1][l1][l1]|fuck[*]?|dr[uo]g[*]?|d[i1]ck[*]?|[a4][s5][s5]|[l1][i1]p|pu[s5][s5]y[*]?|fk/gi;
        this._subfilter = /[a4][s5][s5]|[l1][i1]p|pu[s5][s5]y[*]?|[s5]uck[*]?|m[o0]th[e3]r[*]?|m[o0]m[*]?|d[o0]g[*]?|l[o0]w[*]?|s[e3]x[*]?/gi;

        if (customFilter.length > 3) {
        this._filt = new RegExp(this._filt.source + "|" + escapeRegExp(customFilter), "gi");
        }
        
        if (customSubFilter.length > 3) {
        this._subfilter = new RegExp(this._subfilter.source + "|" + escapeRegExp(customSubFilter), "gi");
        }
        
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

        return paragraph.substring(position, end);
    }

    private positionStatic(word: string, filters: RegExp): number[] {
        const wordlist_ = word.toLowerCase().split(' ');
        const positions: number[] = [];

        wordlist_.forEach((word, index) => {
        const pos = index && wordlist_[index - 1].length + positions.length + 1;

        if (word.match(filters) || RegexMatch(word, filters)) {
            positions.push(pos);
        }
        });

        return positions;
    }

    public position(): number[] {
        return this.positionStatic(this._text.toString(), this._filt);
    }

    public get thisToxic(): (string | number)[] | false {
        const check = this.position();
        const arry: (string | number)[] = [];

        if (check.length > 0) {
        const word = this._text.toLowerCase();
        
        for (const index of check) {
            const word_s = this.getBoundPosition(this._text.toLowerCase(), index);
            const before = word.substring(0, word.indexOf(word_s)).trim().split(" ");
            const after = word.substring(word.indexOf(word_s) + word_s.length).trim().split(" ");

                    // Check before
                    before.forEach(d => {
                        if (d.match(this._subfilter)) {
                            this.__subtxic.push([d, '*'.repeat(d.length)]);
                        }
                    });

                    // Check after
                    after.forEach(d => {
                        if (d.match(this._subfilter)) {
                            this.__subtxic.push([d, '*'.repeat(d.length)]);
                        }
                    });

                    // Add toxic word if found in before or after
                    if (before.length && before[before.length - 1].match(this._subfilter)) {
                        arry.push("Toxic", 1, before[before.length - 1]);
                        return arry;
                    }

                    if (after.length && after[0].match(this._subfilter)) {
                        arry.push("Toxic", 1, after[0]);
                        return arry;
                    }

                    if (after.length > 1 && after[1].match(this._subfilter)) {
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
        let words = this._text.split(" ");
        const sensor = "*";

        position.forEach((number) => {
        const getWord = this.getBoundPosition(this._text, number);
        words = words.map(word => word.replace(getWord, sensor.repeat(getWord.length)));
        });
        this.__subtxic.forEach(([oldWord, newWord]) => {
            words = words.map(word => {
                return !(validateInput("email", word) || validateInput("url", word)) && this._st
                ? word.replace(oldWord, newWord): word;
            });
        });
        return words.join(" ");
    }
}

class filters_badword extends FilterBadWord {
    protected _cl: boolean;
    protected _st: boolean;
    
    constructor() {
        super(); // Memanggil konstruktor kelas induk
        this._cl = true; // Inisialisasi properti cl
        this._st = true; // Inisialisasi properti st
    }

    public text_o(text: string): void {
        this._text = text.toString();
    }

    public config(cl: boolean = true, smart: boolean = true, customFilter: string = "", customSubFilter: string = ""): void {
        this._cl = cl;
        this._st = smart;

        if (customFilter.length > 3) {
            this._filt = new RegExp(this._filt.source + "|" + escapeRegExp(customFilter), "gi");
        }
        if (customSubFilter.length > 3) {
            this._subfilter = new RegExp(this._subfilter.source + "|" + escapeRegExp(customSubFilter), "gi");
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
        return this._text.trim();
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
