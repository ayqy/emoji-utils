const assert = require('assert');
const {
  isEmoji,
  containsEmoji,
  str2unicodeArray,
  length,
  substr,
  toArray
} = require('./dist/umd/emoutils');


// export to global
(global || window).emojiUtil = {
  isEmoji,
  containsEmoji,
  str2unicodeArray,
  length,
  substr,
  toArray
};

// test
let cases = [
  // 单表情
  {
    emoji: '❤️️',
    unicode: '\u2764\ufe0f\ufe0f',
    array: ['❤️️'],
    length: 1,
    sub: [{
      params: [],
      str: '❤️️'
    }]
  },
  {
    emoji: '👩‍❤️‍💋‍👩',
    unicode: '\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69',
    array: ['👩‍❤️‍💋‍👩'],
    length: 1,
    sub: []
  },
  {
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    unicode: '\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f',
    array: ['🏴󠁧󠁢󠁳󠁣󠁴󠁿'],
    length: 1,
    sub: [{
      params: [],
      str: '🏴󠁧󠁢󠁳󠁣󠁴󠁿'
    }]
  },
  {
    emoji: '👩‍🔬',
    unicode: '\ud83d\udc69\u200d\ud83d\udd2c',
    array: ['👩‍🔬'],
    length: 1,
    sub: [{
      params: [0, 1],
      str: '👩‍🔬'
    }]
  },
  {
    emoji: '👨‍👩‍👦‍👦',
    unicode:
    '\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66',
    array: ['👨‍👩‍👦‍👦'],
    length: 1,
    sub: [{
      params: [0, 1],
      str: '👨‍👩‍👦‍👦'
    }]
  },
  {
    emoji: '😊',
    unicode: '\ud83d\ude0a',
    array: ['😊'],
    length: 1,
    sub: [{
      params: [0, 10],
      str: '😊'
    }]
  },
  {
    emoji: '👶🏿',
    unicode: '\ud83d\udc76\ud83c\udfff',
    array: ['👶🏿'],
    length: 1,
    sub: [{
      params: [0],
      str: '👶🏿'
    }]
  },
  {
    emoji: "🙎🏾",
    unicode: '\ud83d\ude4e\ud83c\udffe',
    array: ["🙎🏾"],
    length: 1,
    sub: [{
      params: [0, 1],
      str: "🙎🏾"
    }]
  },
  {
    emoji: '#️⃣',
    unicode: '\u0023\ufe0f\u20e3',
    array: ['#️⃣'],
    length: 1,
    sub: [{
      params: [3, 1],
      str: ''
    }]
  },
  {
    emoji: '😊️⃣',
    unicode: '\ud83d\ude0a\ufe0f\u20e3',
    array: ['😊️⃣'],
    length: 1,
    sub: [{
      params: [0, 1],
      str: '😊️⃣',
    }, {
      params: [1, 1],
      str: ''
    }]
  },
  // badcase 非常规换肤、组合表情
  {
    emoji: '\u0023\ud83c\udfff',
    unicode: '\u0023\ud83c\udfff',
    array: ['\u0023', '\ud83c\udfff'],
    length: 2,
    sub: [{
      params: [0, 1],
      str: '\u0023'
    }, {
      params: [0, 2],
      str: '\u0023\ud83c\udfff'
    }]
  },
  {
    emoji: '\ud83d\ude0a\ud83c\udfff',
    unicode: '\ud83d\ude0a\ud83c\udfff',
    array: ['\ud83d\ude0a\ud83c\udfff'],
    length: 1,
    sub: [{
      params: [0, 2],
      str: '\ud83d\ude0a\ud83c\udfff'
    }]
  },
  {
    emoji: '\u0023\ufe0f\u20e3\u200d\ud83d\ude0a',
    unicode: '\u0023\ufe0f\u20e3\u200d\ud83d\ude0a',
    array: ['\u0023\ufe0f\u20e3\u200d\ud83d\ude0a'],
    length: 1,
    sub: [{
      params: [0],
      str: '\u0023\ufe0f\u20e3\u200d\ud83d\ude0a'
    }]
  },
  {
    emoji: '\ud83d\ude0a\u200d\ud83d\ude0a',
    unicode: '\ud83d\ude0a\u200d\ud83d\ude0a',
    array: ['\ud83d\ude0a\u200d\ud83d\ude0a'],
    length: 1,
    sub: [{
      params: [0, 0],
      str: ''
    }]
  },
  // 字符串掺杂表情
  {
    emoji: '𝐀𝐁👩‍❤️‍💋‍👩C',
    unicode: '\ud835\udc00\ud835\udc01\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\u0043',
    array: ['𝐀', '𝐁', '👩‍❤️‍💋‍👩', 'C'],
    length: 4,
    sub: [{
      params: [1, 2],
      str: '𝐁👩‍❤️‍💋‍👩'
    }]
  },
  {
    emoji: 'hi🌺',
    unicode: '\u0068\u0069\ud83c\udf3a',
    array: ['h', 'i', '🌺'],
    length: 3,
    sub: [{
      params: [0, 6],
      str: 'hi🌺'
    }, {
      params: [2, 1],
      str: '🌺'
    }]
  },
  {
    emoji: '3️⃣ 1️⃣ 2️⃣ ',
    unicode: '\u0033\ufe0f\u20e3\u0020\u0031\ufe0f\u20e3\u0020\u0032\ufe0f\u20e3\u0020',
    array: ['3️⃣', ' ', '1️⃣', ' ', '2️⃣', ' '],
    length: 6,
    sub: [{
      params: [0, 5],
      str: '3️⃣ 1️⃣ 2️⃣'
    }, {
      params: [-3],
      str: ' 2️⃣ '
    }]
  },
  {
    emoji: '你好hi🌺💰..。🌚',
    unicode: '\u4f60\u597d\u0068\u0069\ud83c\udf3a\ud83d\udcb0\u002e\u002e\u3002\ud83c\udf1a',
    array: ['你', '好', 'h', 'i', '🌺', '💰', '.', '.', '。', '🌚'],
    length: 10,
    sub: [{
      params: [0, 5],
      str: '你好hi🌺'
    }, {
      params: [3, 3],
      str: 'i🌺💰'
    }, {
      params: [-2, 1],
      str: '。'
    }]
  },
  {
    emoji: '😳(/^▽^)/😷😒😤',
    unicode: '\ud83d\ude33\u0028\u002f\u005e\u25bd\u005e\u0029\u002f\ud83d\ude37\ud83d\ude12\ud83d\ude24',
    array: ['😳', '(', '/', '^', '▽', '^', ')', '/', '😷', '😒', '😤'],
    length: 11,
    sub: [{
      params: [0, 9],
      str: '😳(/^▽^)/😷'
    }, {
      params: [0, 1],
      str: '😳'
    }, , {
      params: [9],
      str: '😒😤'
    }]
  },
  // 纯文本
  {
    emoji: '',
    unicode: '',
    array: [],
    length: 0,
    sub: [],
    isPureText: true
  },
  {
    emoji: 'ヾ（〃＾∇＾）ﾉ♪',
    unicode: '\u30fe\uff08\u3003\uff3e\u2207\uff3e\uff09\uff89\u266a',
    array: ['ヾ', '（', '〃', '＾', '∇', '＾', '）', 'ﾉ', '♪'],
    length: 9,
    sub: [],
    isPureText: true
  },
  {
    emoji: '𝐀',
    unicode: '\ud835\udc00',
    array: ['𝐀'],
    length: 1,
    sub: [],
    // badcase 代理对儿并不一定都是emoji
    isPureText: false
  },
  {
    emoji: '𝐀𝐁C',
    unicode: '\ud835\udc00\ud835\udc01\u0043',
    array: ['𝐀', '𝐁', 'C'],
    length: 3,
    sub: [],
    // badcase 代理对儿并不一定都是emoji
    isPureText: false
  }
];

// str2unicodeArray
assert(cases.map(c =>
    str2unicodeArray(c.emoji).map(unicode => String.fromCharCode(unicode.replace('\\u', '0x'))).join('') === c.unicode || console.error([c, str2unicodeArray(c.emoji).map(unicode => String.fromCharCode(unicode.replace('\\u', '0x'))).join(''), c.unicode])
  ).reduce((a, v) => a && v, true), 'str2unicodeArray()');
// length
assert(cases.map(c =>
    length(c.emoji) === c.length || console.error([c, length(c.emoji), c.length])
  ).reduce((a, v) => a && v, true), 'length()');
// substr
assert(cases.map(c =>
    c.sub.reduce((a, v) => a && substr.apply(null, [c.emoji].concat(v.params)) === v.str || console.log([c, substr.apply(null, [c.emoji].concat(v.params)), v.str]), true)
  ).reduce((a, v) => a && v, true), 'substr()');
// toArray
assert(cases.map(c =>
  toArray(c.emoji).reduce((a, v, i) => a && v === c.array[i], true)  || console.error([c, toArray(c.emoji), c.array])
  ).reduce((a, v) => a && v, true), 'toArray()');
// isEmoji
assert(cases.filter(c => c.length === 1).map(c =>
    isEmoji(c.emoji) || console.error([c, isEmoji(c.emoji), true])
  ).reduce((a, v) => a && v, true), 'isEmoji()');
// containsEmoji
assert(cases.map(c =>
    containsEmoji(c.emoji) === !c.isPureText || console.error([c, containsEmoji(c.emoji), !c.isPureText])
  ).reduce((a, v) => a && v, true), 'containsEmoji()');
