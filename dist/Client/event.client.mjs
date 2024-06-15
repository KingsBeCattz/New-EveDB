var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class EventEmitter {
  constructor() {
    __publicField(this, "events", {});
  }
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }
  once(event, listener) {
    const onceListener = (args) => {
      this.off(event, onceListener);
      listener(args);
    };
    return this.on(event, onceListener);
  }
  off(event, listener) {
    if (!this.events[event])
      return this;
    this.events[event] = this.events[event].filter((l) => l !== listener);
    return this;
  }
  emit(event, args) {
    if (!this.events[event])
      return false;
    this.events[event].forEach((listener) => listener(args));
    return true;
  }
  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
    return this;
  }
}

export { EventEmitter };
