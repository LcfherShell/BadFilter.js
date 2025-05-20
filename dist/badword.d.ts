interface FilterOptions {
    filterUrls: boolean;
    filterEmails: boolean;
    contextSensitivity: number;
    filterSeverity: number;
    replaceChar: string;
    preserveFirstLast: boolean;
    preserveLength: boolean;
    detectMissingChars: boolean;
    preprocessLeetspeak?: boolean;
    ignoreLastDigits?: number;
}
declare class FilterBadWord {
    private _origintext;
    protected _text: string;
    protected _options: FilterOptions;
    protected _filt: RegExp;
    protected _emoji: RegExp;
    protected _subfilter: RegExp;
    private _baseBadWords;
    private __subtxic;
    private __originRegex;
    protected _st: boolean;
    private _toxicWords;
    private _toxicPositions;
    private _toxicScore;
    /**
     * @param text - Text to filter
     * @param customFilter - Custom bad words pipe-separated
     * @param customSubFilter - Custom contextual bad words pipe-separated
     * @param options - Additional options
     */
    constructor(text?: string, customFilter?: string, customSubFilter?: string, options?: Partial<FilterOptions>);
    /**
     * Extract a word at a specific position
     * @param text - Text to extract from
     * @param position - Position to extract at
     * @return - Extracted word
     */
    static getboundPosition(text: string, position: number): string;
    /**
     * Find positions of toxic words
     * @param text - Text to search
     * @param regex - Regex pattern to search for
     * @param regexMatch - Original regex patterns to search for
     * @param baseBadWords - Original list of bad words to check against
     * @param detectMissingChars - Whether to detect words with one character missing
     * @return - Array of positions
     */
    static position_static(text: string, regex: RegExp, regexMatch: string[], baseBadWords: string[], detectMissingChars?: boolean): number[];
    /**
     * Get positions of toxic words in the text
     * @return - Array of positions
     */
    position(): number[];
    /**
     * Check if text contains contextual toxic words
     * @param text - Text to check
     * @return - Whether text contains contextual toxic words
     */
    checkContextualToxicity(text: string): boolean;
    /**
     * Calculate toxicity score based on found toxic words
     * @return - Toxicity score (0-100)
     */
    calculateToxicityScore(): number;
    /**
     * Check if text is toxic
     * @return - Toxicity information or false
     */
    get thisToxic(): (string | number)[];
    /**
     * Prevent direct setting of thisToxic
     */
    set thisToxic(key: any);
    /**
     * Get toxicity score
     * @return - Toxicity score (0-100)
     */
    get toxicityScore(): number;
    /**
     * Get list of toxic words found
     * @return - Array of toxic words
     */
    get toxicWords(): string[];
    /**
     * Clean toxic words from text
     * @param positions - Positions of toxic words
     * @return - Cleaned text
     */
    clean(positions?: number[] | null): string;
    /**
     * Get information about the toxicity check
     * @return - Toxicity information
     */
    getToxicityInfo(): {
        isToxic: boolean;
        toxicityLevel: number;
        toxicityScore: number;
        toxicWords: string[];
        cleanedText: string;
        originalText: string;
        normalizedText: string;
    };
}
declare class filters_badword extends FilterBadWord {
    protected _cl: boolean;
    constructor();
    text_o(text: string): void;
    config(cl?: boolean, smart?: boolean, customFilter?: string, customSubFilter?: string): void;
    get cleans(): string;
    set cleans(value: any);
}
export { FilterBadWord, filters_badword };
