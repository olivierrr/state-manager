
(function (factory) {

  if (typeof exports === 'object'){
    module.exports = factory()
  }else{
    this.StateManager = factory()
  }

}(function () {

  /**
   * @constructor
   * each 'state' is expected to have a 'create' method. 'preload' and 'destroy' methods are optional
   */
  function StateManager (){

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

}))