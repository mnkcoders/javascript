/**
 * @type EventBus
 */
function EventBus(){
    
    var _bus = {
        /**
         * @type Element
         */
        'element': document.createElement('eventbus'),  
        /**
         * @type CustomEvent
         */
        'listeners': []
    };
    /**
     * @param {String} event
     * @returns {EventBus}
     */
    this.dispatch = function( event ){
        
        if( _bus.listeners.hasOwnProperty(event)){
 
            _bus.element.dispatchEvent( _bus.listeners[event] );
        }
        
        return this;
    };
    /**
     * 
     * @param {String} event
     * @param {Object|String|Number|Boolean} data
     * @returns {EventBus}
     */
    this.register = ( event , data ) => {
        
        if( !_bus.listeners.hasOwnProperty(event)){
 
            _bus.listeners[event] = new CustomEvent( event , {'detail': data });
        }
        
        return this;
    };
    /**
     * @param {String} event
     * @param {Object} data
     * @returns {EventBus}
     */
    this.registerDispatch = ( event , data ) => this.register( event , data ).dispatch( event );
    /**
     * @param {String} event
     * @returns {Boolean}
     */
    this.check = ( event ) => { _bus.listeners.hasOwnProperty( event ); };
    /**
     * 
     * @param {String} event
     * @returns {EventBus}
     */
    this.remove = ( event ) =>{
        
        _bus.element.removeEventListener( event );
        
        return this;
    };
    /**
     * 
     * @param {String} event
     * @param {Function} callback
     * @returns {EventBus}
     */
    this.listen = ( event , callback ) =>{
        
        _bus.element.addEventListener( event , callback );
        
        return this;
    };
}
EventBus.Instance = new EventBus();
Object.freeze( EventBus );


