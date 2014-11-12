(function (factory) {

  if (typeof exports === 'object'){
    module.exports = factory()
  }else{
    this.StateManager = factory()
  }

}(function () {
  var _defaultOpts = {
    override : false
  }
  var ERRORS = {
    STATE_EXISTS : 'Attempting to add state when already exists. Set override in opts to allow states to be overridden.'
  }
  /**
   * @constructor
   * each 'state' is expected to have a 'create' method. 'preload' and 'destroy' methods are optional
   */
  function StateManager (opts){
    opts = opts || {};
    this.opts = extend(_defaultOpts, opts);
    /**
     * @property {Hash#state}
     */
    this.states = {}

    /**
     * @property {Object#state}
     */
    this.currentState

  }

  /**
   * @method
   * @param {String}
   * @param {Object#state}
   */
  StateManager.prototype.add = function(name, obj) {
    var state = this.states[name]

    if(state && !this.opts.override) throw new Error(ERRORS.STATE_EXISTS)
    this.states[name] = obj

    return this

  }

  /**
   * @method
   * @param {String}
   */
  StateManager.prototype.go = function(name) {

    if(!this.states[name]){
      console.warn(name + ' state does not exist.')
      return
    } else {

      if(this.currentState && this.currentState.destroy){
        this.currentState.destroy()
      }

      this.currentState = this.states[name]

      if(this.currentState.preload){
        var self = this
        this.currentState.preload(function () {
          self.currentState.create()
        })
      } else {
        this.currentState.create()
      }
    }
    return this
  }

  return {
    create: function () {
      return new StateManager()
    }
  }

  function extend (to, from) {
    var newObj = {}
    keys(to).forEach(function(key){
      if(from[key] != null) return newObj[key] = from[key];
      newObj[key] = to[key];
    });
    return newObj;
  }
  function keys (obj) {
    if(typeof Object.keys === 'function') return Object.keys(obj);
    var ret = [];
    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
      throw new TypeError('Object.keys called on non-object')
    }
    for(key in obj){
      if(obj.hasOwnProperty(key)) ret.push(obj[key])
    }
    return ret;
  }

}))

