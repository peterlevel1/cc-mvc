const OBJ = Object;

export function isObject(obj) {
  return obj && obj.constructor === OBJ;
}

export function isArray(obj) {
  return Array.isArray(obj);
}

export function mixProps(inst, props) {
  if (!props) {
    return;
  }

  for (const prop in props) {
    if (props.hasOwnProperty(prop)) {
      if (inst[prop]) {
        console.warn(`prop: ${prop} is alreay exists`);
      }
      inst[prop] = props[prop];
    }
  }
}
