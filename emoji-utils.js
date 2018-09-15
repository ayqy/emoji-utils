// 假设
// 1.所有代理对儿都是emoji
// 2.肤色对所有emoji都是有效的
// 3.joiner连接起来的emoji都算一个

const EMOJIS = [
  // pairs of regional indicators (which display emoji country flags)
  /\ud83c[\udde6-\uddff]\ud83c[\udde6-\uddff]/,
  // the unofficial emoji flags for England, Scotland and Wales
	// each of these begins with the black flag emoji and ends with the cancel tag
  /\ud83c\udff4.+\udb40\udc7f/,
  // range of surrogate pairs
  /[\ud800-\udbff][\udc00-\udfff]/
];
// zero width joiner
const EMOJI_JOINER = /\u200d/;
// 后缀控制符
const EMOJI_INDICATORS = [
  // variation selection-16, which specifies that the preceding character should be displayed as an emoji
  /\ufe0f/,
  // combining enclosing keycap, which is used after keycap characters
  /\u20e3/
];
const EMOJI_MODIFIERS = [
  // skin tone modifiers
  /\ud83c[\udffb-\udfff]/
].concat(EMOJI_INDICATORS);

/**
 * 尝试匹配由零宽空格连接起来的emoji
 * @param {String} str
 * @param {String} matched
 */
function _matchJoined(str, matched = '') {
  // joiner
  let reJoiner = new RegExp('^' + EMOJI_JOINER.source);
  let matchedJoiner = str.match(reJoiner);
  if (matchedJoiner) {
    // 吃掉连接符
    matched += matchedJoiner[0];
    str = str.substr(str2unicodeArray(matchedJoiner[0]).length);
    return matchOneEmoji(str, matched);
  }

  return matched;
}

/**
 * 向后看一位，如'\u0023\ufe0f\u20e3'
 * @param {String} str
 * @param {String} matched 匹配到的emoji
 */
function _matchForwarding(str, matched = '') {
  let reForwarding = new RegExp('^.' +
      '(?:' + EMOJI_INDICATORS.map(re => '(?:' + re.source + ')').join('|') + ')+'
  );
  let matchedForwarding = str.match(reForwarding);
  if (matchedForwarding) {
    matched += matchedForwarding[0];
    str = str.substr(str2unicodeArray(matchedForwarding[0]).length);
    return _matchJoined(str, matched);
  }

  return matched;
}

/**
 * 尝试匹配开头的emoji，失败返回''
 * @param {String} str
 * @param {String} matched 匹配到的emoji
 */
function matchOneEmoji(str, matched = '') {
  let isMatched = false;
  for (let i = 0; i < EMOJIS.length; i++) {
    let emojiTester = new RegExp('^' + EMOJIS[i].source);
    if (emojiTester.test(str)) {
      isMatched = true;
      const reEmoji = new RegExp(
          emojiTester.source +
          // match following modifiers if exist
          '(?:' + EMOJI_MODIFIERS.map(re => '(?:' + re.source + ')').join('|') + ')*'
      );
      let matchedEmoji = str.match(reEmoji);
      matched += matchedEmoji[0];
      str = str.substr(str2unicodeArray(matchedEmoji[0]).length);
      return _matchJoined(str, matched);
    }
  }

  // 向后看1位，应对类似'#️⃣'的场景
  if (!isMatched && str !== '') {
    return _matchForwarding(str, matched);
  }

  return matched;
}

/**
 * 向左补位
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart#Polyfill
 * @param {String} str
 * @param {Number} targetLength
 * @param {String} padString
 */
function padStart(str, targetLength, padString) {
  // truncate if number or convert non-number to 0;
  targetLength = targetLength >> 0;
  padString = String((typeof padString !== 'undefined' ? padString : ' '));
  if (str.length > targetLength) {
    return str;
  }
  else {
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
      // append to original to ensure we are longer than needed
      padString += padString.repeat(targetLength / padString.length);
    }
    return padString.slice(0,targetLength) + str;
  }
};

/**
 * 是不是一个emoji
 * @param {String} str
 */
export function isEmoji(str = '') {
  let isEmoji = false;
  if (str.length > 0) {
    let matchedEmoji = matchOneEmoji(str);
    isEmoji = matchedEmoji && matchedEmoji.length === str.length;
  }
  return isEmoji;
}


/**
 * 是否含有emoji
 * @param {String}} str
 */
export function containsEmoji(str = '') {
  let rest = str;

  while (rest.length > 0) {
    let matchedEmoji = matchOneEmoji(rest);
    if (matchedEmoji) return true;
    let consumed = str2unicodeArray(matchedEmoji).length || 1;
    rest = rest.substr(consumed);
  }

  return false;;
}

/**
 * 字符串转Unicode数组
 * @param {String} str
 */
export function str2unicodeArray(str = '') {
  return str.split('').map(c =>
    '\\u' + padStart(c.charCodeAt(0).toString(16), 4, '0')
  );
}

/**
 * 计算长度
 * @param {String} str
 */
export function length(str = '') {
  let len = 0;
  let rest = str;

  while (rest.length > 0) {
    let emoji = matchOneEmoji(rest);
    let consumed = str2unicodeArray(emoji).length || 1;
    rest = rest.substr(consumed);
    len++;
  }

  return len;
}

/**
 * 子串截取
 * @param {String} str
 * @param {Number} start 起始index，负数表示倒着数
 * @param {Number} len 子串长度
 */
export function substr(str = '', start = 0, len = Infinity) {
  if (start < 0 || len === Infinity) {
    let splitted = toArray(str);
    let len = splitted.length;
    if (start < 0) {
      start = len + start;
    }

    return splitted.slice(start, start + len).join('');
  }

  let index = 0;
  let substring = '';
  while (str.length > 0 && len > 0) {
    let matched = matchOneEmoji(str);
    if (!matched) {
      matched = str[0];
    }
    if (index >= start) {
      substring += matched;
      len--;
    }
    str = str.substr(str2unicodeArray(matched).length);
    index++;
  }

  return substring;
}

/**
 * 字符串转数组，相当于split('')
 */
export function toArray(str = '') {
  let arr = [];

  while (str.length > 0) {
    let matched = matchOneEmoji(str);
    if (!matched) {
      matched = str[0];
    }
    arr.push(matched);
    str = str.substr(str2unicodeArray(matched).length);
  }

  return arr;
}

export default {
  isEmoji,
  containsEmoji,
  str2unicodeArray,
  length,
  substr,
  toArray
}
