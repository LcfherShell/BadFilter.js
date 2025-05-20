import {FilterBadWord} from "../src/badword";

const badfilter = new FilterBadWord("FUck master 😈");
console.log(badfilter.clean(badfilter.position())); // Output: ***** master