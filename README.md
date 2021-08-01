# emoutils

A tiny emoji util in JavaScript to solve all these things:

![javascript-emoji-issues](http://www.ayqy.net/cms/wordpress/wp-content/uploads/2018/09/javascript-emoji-issues.png)

##  Installation

Node.js:

    npm -i --save-dev emoutils

    const emoutils = require('emoutils');
    // or
    // const { isEmoji } = require('emoutils');
    const assert = require('assert');
    assert.strictEqual(emoutils.isEmoji('😄'), true);

Browser:

    <!-- Minified UMD version -->
    <script src="https://unpkg.com/emoutils/dist/umd/emoutils.min.js"></script>
    <!-- Unminified UMD version -->
    <script src="https://unpkg.com/emoutils/dist/umd/emoutils.js"></script>

    <!-- unminified ES version -->
    <script src="https://unpkg.com/emoutils/dist/es/emoutils.js"></script>

    <script>
        console.log(
            emojiUtils.containsEmoji('hello 👋') === true
        );
    </script>

## API

- `isEmoji(str = '')`: Whether `str` is emoji or not
- `containsEmoji(str = '')`: Whether `str` contains emoji or not
- `str2unicodeArray(str = '')`: Convert `str` to an array
- `length(str = '')`: Return the length of `str`
- `substr(str = '', start = 0, len = Infinity)`: Return a sub-string of `str`
- `matchOneEmoji(str = '', fromStrStart = true)`: Match one leading emoji by default, return `''` if failed
- `toArray(str = '')`: Convert `str` to single char/emoji array (like `str.split('')` with emoji supports)

## Changelog

### 2.0.0

- (**BREAKING**) Basic emojis before 0xFFFF supports ([PR#5](https://github.com/ayqy/emoji-utils/pull/5) for details, and [#79efbd7](https://github.com/ayqy/emoji-utils/commit/79efbd7febace47bebccc41430350809957fff53) for breaking case)
- `matchOneEmoji()`: A new parameter `fromStrStart` supports
- `substr()`: A negative value for the `start` parameter bug fixes
- Performance optimization

### 1.0.0

- (**BREAKING**) Unicode Emoji Spec oriented enhancements ([PR#1](https://github.com/ayqy/emoji-utils/pull/1) for details, and [#8c2def7](https://github.com/ayqy/emoji-utils/commit/8c2def7b732f418cd1214a42bd9ff32458fd8f5a) for breaking case)
- `matchOneEmoji()` exported

### 0.0.1

- Initial Version ([JavaScript emoji utils](http://www.ayqy.net/blog/javascript-emoji-utils/) for details)

##  References

-  [JavaScript emoji utils](http://www.ayqy.net/blog/javascript-emoji-utils/)

-  [Finally moving past “💩”.length === 2](https://medium.com/@jtenclay/finally-moving-past-length-2-86054156b180)

-  ["💩".length === 2](https://blog.jonnew.com/posts/poo-dot-length-equals-two)

-  [Can you use String.fromCodePoint just like String.fromCharCode](https://stackoverflow.com/questions/34680898/can-you-use-string-fromcodepoint-just-like-string-fromcharcode)

-  [emoji-regex](https://www.npmjs.com/package/emoji-regex)
