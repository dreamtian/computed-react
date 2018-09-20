function looseEqual(a, b) {
  if (a === b) return true;
  const isObjectA = isObject(a);
  const isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a);
      const isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i]);
        });
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key]);
        });
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}
function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}
function memory(resultFn) {
  let lastArgs = [];
  let lastResult;
  let calledOnce = false;
  const result = function(...newArgs) {
    if (calledOnce && newArgs.length === lastArgs.length && newArgs.every((item, index) => looseEqual(item, lastArgs[index]))) {
      return lastResult;
    }
    calledOnce = true;
    lastArgs = newArgs;
    lastResult = resultFn.apply(this, newArgs);
    return lastResult;
  };
  return result;
};
export function computedWrap() {
  return function computed(RC) {
    const fun = function() {
      this.__computed && Object.keys(this.__computed).forEach(key => { // 遍历computed 加上memory
        if (typeof this.__computed[key] !== 'function') throw new Error(`${key} should be a function`);
        this.__computed[key] = memory(this.__computed[key]);
      });
    };
    // 重写componentDidMount方法
    RC.prototype.componentDidMount = ((didmount = () => {}) => {
      return function() { didmount.bind(this)(); fun.bind(this)(); };
    })(RC.prototype.componentDidMount);
    return RC;
  };
};
