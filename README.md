## 🎉 **Welcome to BadFilter.js!** 🎉

Tired of offensive language in your app? 🚫 **BadFilter.js** to the rescue! We’ve crafted a supercharged, customizable solution that helps developers filter out inappropriate words like a pro. Let's make the internet a friendlier place one word at a time! 🌐💬

---

## 🛠️ **Overview**

**BadFilter.js** offers two powerful components:
- **FilterBadWord Class**: The brains of the operation! This utility class is responsible for filtering unwanted words from your text.
- **filters_badword Function**: A lightweight wrapper around `FilterBadWord` for easier, more streamlined usage. Think of it as the "express mode" for your text-filtering needs!

With these components, you can easily cleanse your text, ensuring a respectful, safe online environment. 🚀✨

---

## 🔧 **How It Works**
Both **FilterBadWord** and **filters_badword** combine Natural Language Processing (NLP) and Machine Learning (ML) for *accurate* and *intelligent* word filtering.

Here's the breakdown of the magic:
1. **Tokenization**: Your text gets split into individual words (tokens) 🧩.
2. **NLP Analysis**: The tokens are scanned using cutting-edge NLP algorithms to sniff out those pesky bad words 🕵️‍♂️.
3. **Machine Learning**: Filtering gets smarter with each interaction, ensuring those inappropriate words vanish into thin air ✨.
4. **Customization**: Want to fine-tune the filter to match your app's personality? You got it! Use the handy config method to tweak things to perfection 🎛️.

---

## 🚀 **Getting Started**

### 1️⃣ **HTML Setup**
Want to use BadFilter.js in your web app? No problem! Here’s how:
```html
<!-- Add badword.js into the HTML page -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/badfilter-js@1.2.2/badword.min.js"></script>
<!-- Or import directly if supporting ES Module -->
<script type="module" src="https://cdn.jsdelivr.net/npm/badfilter-js@1.2.2/badword.min.js">
</script> 

<script>
const badfilter = new FilterBadWord("FUck master");
console.log(badfilter.clean(badfilter.position())); // Output: ***** master
</script>
```
Easy peasy, right? 🍋

### 2️⃣ **Node.js Setup**
If you’re working on a Node.js project, just use this:
```javascript
const { FilterBadWord, filters_badword } = require('./badword.js');

// Express filtering using filters_badword
const badfilter = new FilterBadWord("FUck master");
console.log(badfilter.clean(badfilter.position())); // Output: ***** master
```

### 🎯 **Pro Mode: filters_badword Class**
For full control over filtering, dive into the **filters_badword** class:
```javascript
const badfilt = new filters_badword();

// Customize the filter settings
badfilt.config(true, {cEmoji:true, subObject:false, deepcensor:true}, "dict|kick|chicky hu\|", "stupid|badly"); // Custom filtering settings

// Set text to be filtered
badfilt.text_o("hello master sss");
console.log(badfilt.cleans); // Output: ***** master ***
console.log(badfilt.position()); // Shows position of the bad words
```

🔧 **Config it your way!** Customize how strict or lenient your filter should be using `.config()`. Want more control? You got it!

---

## 💡 **New Features in the Latest Update**

We've added even more robust features to ensure that **BadFilter.js** remains your top choice for filtering offensive content:

1. **Naughty or Offensive Emoji Filtering** 😈
   - The latest version introduces the ability to filter out inappropriate or offensive emojis. Whether it's a sneaky emoji or something clearly distasteful, we’ve got it covered.

2. **Prediction of Words Not in the Dictionary** 🔮
   - This powerful new feature predicts and identifies words that may not exist in standard dictionaries but are assumed to be inappropriate or offensive. The filter smartly processes such words to ensure your app stays clean.

3. **Improved Accuracy for Every Word** 🎯
   - We've supercharged the accuracy for each word processed, making sure that even the slightest variation in inappropriate language gets caught. The ML-powered filter continues to learn and improve with every use, boosting precision.

---

## 💡 **Features You'll Love**

### 🧠 **Smart Filtering**
Thanks to the NLP + ML combo, your filters get sharper over time, catching even the sneakier bad words. Say goodbye to offensive content! 🙅‍♂️🚫

### 🎨 **Fully Customizable**
Want to allow certain words or apply extra strict filtering? Adjust it with ease. You’re in the driver’s seat of how clean your app should be. Customize the experience and make it yours! 🛠️

### ⚡ **Blazing Fast**
We know speed matters! BadFilter.js is optimized to perform like a ninja—fast and precise. Your users won’t even notice the filtering happening in the background. 🌪️

---

## 🤔 **Why Choose BadFilter.js?**

- **Accuracy**: Spot-on detection of offensive words using cutting-edge algorithms 🎯.
- **Customizable**: Shape the filter to match your app’s personality 🎛️.
- **Safe Spaces**: Build a more positive, respectful community 🌸.

Whether you're building a chat app, a forum, or an online game, **BadFilter.js** will ensure everyone has a good time without the drama! 🎉

---

## 🎬 **Wrap-Up**

With **BadFilter.js**, you're one step closer to making the internet a more positive place. Say goodbye to offensive language and hello to a world of friendly interactions. Let's get filtering, and have some fun while we're at it! ✨

Go on, give it a spin and watch the magic unfold in your app! 🚀
