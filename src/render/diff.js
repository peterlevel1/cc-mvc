/**
 * figure out the differences between 2 objs
 *   1. srcOnly
 *   2. newOnly
 *   3. valueDiff
 *
 * @param  {Object} objSrc
 * @param  {Object} objNew
 * @return {Array}
 */
export function diffObj(objSrc, objNew) {
  const ret = [];

  const keys1 = Object.keys(objSrc);
  const keys2 = Object.keys(objNew);

  for (let i = 0, ii = keys1.length, key1; i < ii; i++) {
    key1 = keys1[i];

    if (keys2.includes(key1)) {
      if (objSrc[key1] !== objNew[key1]) {
        ret.push({ type: 'valueDiff', key: key1, values: [objSrc[key1], objNew[key1]] });
      }

      continue;
    }

    ret.push({ type: 'srcOnly', key: key1, value: objSrc[key1] });
  }

  for (let i = 0, ii = keys2.length, key2; i < ii; i++) {
    key2 = keys2[i];

    if (!keys1.includes(key2)) {
      ret.push({ type: 'newOnly', key: key2, value: objNew[key2] });
    }
  }

  return ret;
}

/**
 * figure out the differences between 2 arrs
 *   1. srcOnly
 *   2. newOnly
 *   3. valueDiff
 *
 * arrayAction(optional)
 *   1. shift
 *   2. unshift
 *   3. pop
 *   4. push
 *
 * @param  {Array} arrSrc
 * @param  {Array} arrNew
 * @return {Array}
 */
export function diffArr(arrSrc, arrNew) {
  // TODO: optimize the algorithm
  // according to the arrSrc
  if (isArrayShift(arrSrc, arrNew)) {
    return [{ arrayAction: 'shift', type: 'srcOnly', key: 0, value: arrSrc[0] }];
  }

  if (isArrayUnshift(arrSrc, arrNew)) {
    return [{ arrayAction: 'unshift', type: 'newOnly', key: 0, value: arrNew[0] }];
  }

  if (isArrayPop(arrSrc, arrNew)) {
    return [{ arrayAction: 'pop', type: 'srcOnly', key: arrSrc.length - 1, value: arrSrc[arrSrc.length - 1] }];
  }

  if (isArrayPush(arrSrc, arrNew)) {
    return [{ arrayAction: 'push', type: 'newOnly', key: arrNew.length - 1, value: arrNew[arrNew.length - 1] }];
  }

  const ret = [];

  const len1 = arrSrc.length;
  const len2 = arrNew.length;

  const lenShort = Math.min(len1, len2);
  for (let i = 0; i < lenShort; i++) {
    if (arrSrc[i] === arrNew[i]) {
      continue;
    }

    ret.push({ type: 'valueDiff', key: i, values: [arrSrc[i], arrNew[i]] });
  }

  const lenLarge = Math.max(len1, len2);
  for (let i = lenShort; i < lenLarge; i++) {
    if (len1 > len2) {
      ret.push({ type: 'srcOnly', key: i, value: arrSrc[i] });
    } else {
      ret.push({ type: 'newOnly', key: i, value: arrNew[i] });
    }
  }

  return ret;
}

/**
 * [1, 2]
 * [2]
 *
 * @param  {Array}  arrSrc
 * @param  {Array}  arrNew
 * @return {Boolean}
 */
function isArrayShift(arrSrc, arrNew) {
  if (arrSrc.length - 1 !== arrNew.length) {
    return false;
  }

  for (let i = 1, ii = arrSrc.length; i < ii; i++) {
    if (arrSrc[i] !== arrNew[i - 1]) {
      return false;
    }
  }

  return true;
}

/**
 * [1, 2]
 * [3, 1, 2]
 *
 * @param  {Array}  arrSrc
 * @param  {Array}  arrNew
 * @return {Boolean}
 */
function isArrayUnshift(arrSrc, arrNew) {
  if (arrSrc.length + 1 !== arrNew.length) {
    return false;
  }

  for (let i = 0, ii = arrSrc.length; i < ii; i++) {
    if (arrSrc[i] !== arrNew[i + 1]) {
      return false;
    }
  }

  return true;
}

/**
 * [1, 2, 3]
 * [1, 2]
 *
 * @param  {Array}  arrSrc
 * @param  {Array}  arrNew
 * @return {Boolean}
 */
function isArrayPop(arrSrc, arrNew) {
  if (arrSrc.length - 1 !== arrNew.length) {
    return false;
  }

  for (let i = 0, ii = arrNew.length; i < ii; i++) {
    if (arrNew[i] !== arrSrc[i]) {
      return false;
    }
  }

  return true;
}

/**
 * [1, 2]
 * [1, 2, 3]
 *
 * @param  {Array}  arrSrc
 * @param  {Array}  arrNew
 * @return {Boolean}
 */
function isArrayPush(arrSrc, arrNew) {
  if (arrSrc.length + 1 !== arrNew.length) {
    return false;
  }

  for (let i = 0, ii = arrSrc.length; i < ii; i++) {
    if (arrSrc[i] !== arrNew[i]) {
      return false;
    }
  }

  return true;
}
