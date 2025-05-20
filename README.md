## 🎉 **Welcome to BadFilter.js!** 🎉

Tired of offensive language in your app? 🚫 **BadFilter.js** to the rescue! We’ve crafted a supercharged, customizable solution that helps developers filter out inappropriate words like a pro. Let's make the internet a friendlier place one word at a time! 🌐💬

---

## 🛠️ **Overview**

**BadFilter.js** offers two powerful components:

* **FilterBadWord Class**: The core engine of the library, responsible for detecting and filtering unwanted words from text.
* **filters\_badword Function**: A simplified, express-mode interface that wraps around `FilterBadWord` for quick and easy usage.

These tools let you build respectful, safe online environments with minimal effort. 🚀✨

---

## 🔧 **How It Works**

Both **FilterBadWord** and **filters\_badword** leverage Natural Language Processing (NLP) and Machine Learning (ML) to perform accurate and intelligent filtering.

### Here's how the magic happens:

1. **Tokenization**: Text is broken down into words (tokens) 🧩.
2. **NLP Analysis**: Tokens are scanned for potential offensive content using NLP techniques 🕵️‍♂️.
3. **Machine Learning**: Each interaction makes the filter smarter at catching new or obfuscated terms ✨.
4. **Customization**: You can configure how strict or lenient the filter should be with advanced options 🎛️.

---

## 🚀 **Getting Started**

### 1️⃣ **HTML Setup**

Include it in your browser-based projects:

```html
<!-- Add BadFilter.js via CDN -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/badfilter-js@2.0.13/dist/badword.min.js"></script>
<!-- or -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/badfilter-js@2.0.13/js/badword.min.js"></script>
<!-- Or use ES Module -->
<script type="module" src="https://cdn.jsdelivr.net/npm/badfilter-js@2.0.13/dist/badword.min.js"></script>
<!-- or -->
<script type="module" src="https://cdn.jsdelivr.net/npm/badfilter-js@2.0.13/js/badword.min.js"></script>

<script>
const badfilter = new FilterBadWord("FUck master");
console.log(badfilter.clean(badfilter.position())); // Output: ***** master
</script>
```

### 2️⃣ **Node.js Setup**

For backend or CLI usage:

```javascript
const { FilterBadWord, filters_badword } = require('badfilter-js');

// Basic usage
const badfilter = new FilterBadWord("FUck master");
console.log(badfilter.clean(badfilter.position())); // Output: ***** master
```

### 🎯 **Express Mode: `filters_badword`**

A more concise class for common use cases:

```javascript
const badfilt = new filters_badword();

// Customize filter rules
badfilt.config(true, true, "dict|kick|chicky hu", "stupid|badly");

// Set input text
badfilt.text_o("kick master fck");
console.log(badfilt.cleans);       // Output: **** master ***
console.log(badfilt.position());   // Get positions of filtered words
```

---

## 🌟 **Latest Updates**

We're constantly improving BadFilter.js! Here’s what’s new in the latest version:

### ✨ 1. Cleaned & Smarter `text` Method

The `text_o()` and related text processing methods have been refactored for better clarity, performance, and consistency—especially with large and multilingual text. Expect more stable and readable results.

### 🔎 2. Fuzzy Text Matching

We’ve introduced intelligent fuzzy matching to catch disguised or creatively-written offensive words such as:

* “f\@ck”, “f\*ck”, “phuck”, “fucc”, etc.

This makes BadFilter.js far more effective in real-world, unstructured user input.

### ⚙️ 3. Advanced Configuration via Class Options

The `FilterBadWord` class now comes with a flexible `options` configuration, letting you control how the filter behaves:

```js
options = {
  filterUrls: false,           // Whether to filter offensive words inside URLs
  filterEmails: false,         // Whether to filter inside email addresses
  contextSensitivity: 2,       // Number of surrounding words checked (range: 0–5)
  filterSeverity: 2,           // Level of strictness: 1 = light, 2 = medium, 3 = strict
  replaceChar: '*',            // Character used to replace offensive terms
  preserveFirstLast: false,    // Whether to preserve first/last letters of censored words
  preserveLength: true,        // Keep word length after filtering
  detectMissingChars: true,    // Enable detection of disguised/missing characters
  ignoreLastDigits: 0          // Ignore trailing numbers in a word (useful for usernames/IDs)
};
```

This update enables nuanced handling of sensitive content, ensuring flexibility across different platforms, audiences, and use cases.

---

## 💡 **Features You'll Love**

### 🧠 **AI-Powered Smart Filtering**

Combining NLP and ML ensures the filter becomes smarter with each use—adapting to new slangs and obscure terms. Stop even the sneakiest of offenders!

### 🎨 **Fully Customizable**

Tailor the filter to fit your app’s tone and community standards. Whether you want lenient or strict filtering, it's just a config away.

### ⚡ **Blazing Fast**

Performance matters. BadFilter.js is designed to be lightning fast, even under large text loads, keeping your app running smoothly.

---

## 🤔 **Why Choose BadFilter.js?**

* ✅ **Accuracy**: Industry-grade detection using fuzzy logic and contextual awareness.
* 🔧 **Configurability**: Powerful tuning options for filtering behavior.
* 💬 **Safety First**: Build inclusive communities free from toxicity and hate speech.

Perfect for chats, forums, social apps, education platforms, or any user-generated content.

---

## 🎬 **Wrap-Up**

With **BadFilter.js**, you're equipped to fight toxicity with precision and speed. Say goodbye to offensive language and hello to a clean, inclusive experience for everyone. 🧼✨

Start filtering today and join the movement toward a better, more respectful web. 🌐🚀