this.adminCollectionObject = function(collection) {
  if (typeof AdminConfig.collections[collection] !== 'undefined' && typeof AdminConfig.collections[collection].collectionObject !== 'undefined') {
    return AdminConfig.collections[collection].collectionObject;
  } else {
    return lookup(collection);
  }
};

this.adminCallback = function(name, args, callback) {
  var stop, _ref, _ref1;
  stop = false;
  if (typeof (typeof AdminConfig !== "undefined" && AdminConfig !== null ? (_ref = AdminConfig.callbacks) != null ? _ref[name] : void 0 : void 0) === 'function') {
    stop = (_ref1 = AdminConfig.callbacks)[name].apply(_ref1, args) === false;
  }
  if (typeof callback === 'function') {
    if (!stop) {
      return callback.apply(null, args);
    }
  }
};

this.lookup = function(obj, root, required) {
  var arr, ref;
  if (required == null) {
    required = true;
  }
  if (typeof root === 'undefined') {
    root = Meteor.isServer ? global : window;
  }
  if (typeof obj === 'string') {
    ref = root;
    arr = obj.split('.');
    while (arr.length && (ref = ref[arr.shift()])) {
      continue;
    }
    if (!ref && required) {
      throw new Error(obj + ' is not in the ' + root.toString());
    } else {
      return ref;
    }
  }
  return obj;
};
