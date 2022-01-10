const Store = require('electron-store');

class StoreHelper {
  static store = new Store();
  
  static set(key, value) {
    StoreHelper.store.set(key, JSON.stringify(value));
  }

  static get(key) {
    const value = StoreHelper.store.get(key) || null;
    return value === null ? value : JSON.parse(value);
  }

  static clear(){
    StoreHelper.store.clear();
  }
}
module.exports = {
    StoreHelper
}
