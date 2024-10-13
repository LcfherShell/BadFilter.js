/*!
 * BadFilter.js - A JavaScript utility for filtering offensive or unwanted words
 * Copyright (c) 2023 LcfherShell
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



function escapeRegExp(strings: string): string {
    let data = strings.trim().toLowerCase().split("|").filter(Boolean);
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

class FilterBadWord {
    protected _text: string; // Changed to protected to allow access in subclasses
    protected _filt: RegExp; // Changed to protected
    protected _subfilter: RegExp; // Changed to protected

    constructor(text: string = "", customFilter: string = "", customSubFilter: string = "") {
        this._text = text;
        this._filt = /[b8][[a4][s5]hfu[l1][l1]*|k[i1][l1][l1]*|fuck*|dr[uo]g*|d[i1]ck*|fk/gi;
        this._subfilter = /[a4][s5][s5]|[l1][i1]p|pu[s5][s5]y[*]?|[s5]uck[*]?|m[o0]th[e3]r[*]?|m[o0]m[*]?|d[o0]g[*]?|l[o0]w[*]?|s[e3]x[*]?/gi;

        if (customFilter.length > 3) {
            this._filt = new RegExp(this._filt.source + "|" + escapeRegExp(customFilter), "gi");
        }
        if (customSubFilter.length > 3) {
            this._subfilter = new RegExp(this._subfilter.source + "|" + escapeRegExp(customSubFilter), "gi");
        }
    }

    private getBoundPosition(position: number): string {
        let paragraph = this._text;
        while (position > 0 && paragraph[position] === " ") position--;
        position = paragraph.lastIndexOf(" ", position) + 1;
        let end = paragraph.indexOf(" ", position);
        if (end === -1) {
            end = paragraph.length;
        }
        return paragraph.substring(position, end);
    }

    private positionStatic(): number[] {
        const wordList = this._text.toLowerCase().split(' ');
        const positions: number[] = [];

        wordList.forEach((word, index) => {
            if (word.match(this._filt)) {
                positions.push(index);
            }
        });

        return positions;
    }

    public position(): number[] {
        return this.positionStatic();
    }

    public get thisToxic(): (string | number)[] | false {
        const check = this.position();
        const arry: (string | number)[] = [];

        if (check.length > 0) {
            const word = this._text.toLowerCase();

            for (const index of check) {
                const wordBoundary = this.getBoundPosition(index);
                const before = word.substring(0, word.indexOf(wordBoundary)).trim().split(" ");
                const after = word.substring(word.indexOf(wordBoundary) + wordBoundary.length).trim().split(" ");

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
            const getWord = this.getBoundPosition(number);
            words = words.map(word => word.replace(getWord, sensor.repeat(getWord.length)));
        });

        return words.join(" ");
    }
}

class filters_badword extends FilterBadWord {
    protected cl: boolean;
    protected st: boolean;
    
    constructor(cl: boolean = true, st: boolean = true) {
        super(); // Memanggil konstruktor kelas induk
        this.cl = cl; // Inisialisasi properti cl
        this.st = st; // Inisialisasi properti st
    }

    public text_o(text: string): void {
        this._text = text.toString();
    }

    public config(cl: boolean = true, smart: boolean = true, customFilter: string = "", customSubFilter: string = ""): void {
        this.cl = cl;
        this.st = smart;

        if (customFilter.length > 3) {
            this._filt = new RegExp(this._filt.source + "|" + escapeRegExp(customFilter), "gi");
        }
        if (customSubFilter.length > 3) {
            this._subfilter = new RegExp(this._subfilter.source + "|" + escapeRegExp(customSubFilter), "gi");
        }
    }

    public get cleans(): string {
        if (this.cl) {
            const toxicResult = this.thisToxic; // Simpan hasil dalam variabel
    
            // Pastikan toxicResult adalah array dan tidak false
            if (Array.isArray(toxicResult) && toxicResult[1] === 1 && toxicResult.length > 2) {
                const toxicWord = toxicResult[2];
    
                // Pastikan toxicWord adalah string
                if (typeof toxicWord === 'string') {
                    const sensore = "*".repeat(toxicWord.length);
                    // Memanggil clean dengan hasil posisi yang telah dibersihkan
                    return this.clean(this.position()).replace(toxicWord, sensore);
                }
            }
    
            // Kembali bersih jika tidak ada kata yang terdeteksi
            return this.clean(this.position());
        } else {
            return this._text.trim();
        }
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
