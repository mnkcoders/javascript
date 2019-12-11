/**
 * @type EventBus
 */
function EventBus(){
    
    var _bus = {
        /**
         * @type Element
         */
        'element': document.createElement('eventbus'),
    };
    /**
     * @param {String} event
     * @param {Object|String|Number|Boolean} data
     * @returns {EventBus}
     */
    this.send = ( event , data ) => {
        
        _bus.element.dispatchEvent( new CustomEvent(
                event ,
                {'detail': data }) );
        
        return this;
    };
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


