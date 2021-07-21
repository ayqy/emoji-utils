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
  /[\ud800-\udbff][\udc00-\udfff]/,
  /[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194\u2195\u2196\u2197\u2198\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263a\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u26F9\u2702\u2708\u2709\u270C\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u2764\u27A1\u2934\u2935\u2B05-\u2b07\u3030\u303D\u3297\u3299\u261D\u26F9\u270A-\u270d]/
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
 */
function _matchJoined(str) {
  let matched = '';
  // joiner
  let reJoiner = new RegExp('^' + EMOJI_JOINER.source);
  let matchedJoiner = str.match(reJoiner);
  if (matchedJoiner) {
    // 吃掉连接符
    matched += matchedJoiner[0];
    str = str.substr(matchedJoiner[0].length);
    matched += matchOneEmoji(str);
  }

  return matched;
}

/**
 * 向后看一位，如'\u0023\ufe0f\u20e3'
 * @param {String} str
 */
function _matchForwarding(str) {
  let matched = '';
  let reForwarding = new RegExp('^.' +
      '(?:' + EMOJI_INDICATORS.map(re => '(?:' + re.source + ')').join('|') + ')+'
  );
  let matchedForwarding = str.match(reForwarding);
  if (matchedForwarding) {
    matched += matchedForwarding[0];
    str = str.substr(matchedForwarding[0].length);
    matched += _matchJoined(str, matched);
  }

  return matched;
}

/**
 * 尝试匹配开头的emoji，失败返回''
 * @param {String} str
 */
function matchOneEmoji(str) {
  let matched = '';
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
      str = str.substr(matchedEmoji[0].length);
      matched += _matchJoined(str);
    }
  }

  // 向后看1位，应对类似'#️⃣'的场景
  if (!isMatched && str !== '') {
    matched += _matchForwarding(str);
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
}

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
    let consumed = matchedEmoji.length || 1;
    rest = rest.substr(consumed);
  }

  return false;
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
    let matchedEmoji = matchOneEmoji(rest);
    let consumed = matchedEmoji.length || 1;
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
    let matchedEmoji = matchOneEmoji(str);
    if (!matchedEmoji) {
      matchedEmoji = str[0];
    }
    if (index >= start) {
      substring += matchedEmoji;
      len--;
    }
    str = str.substr(matchedEmoji.length);
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
    str = str.substr(matched.length);
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
