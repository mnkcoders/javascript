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
         * @type Event[]
         */
        'handlers': [
            //event handlers here
        ]
    };
    /**
     * 
     * @param {Function|Object|String} receiver
     * @param {String} event
     * @returns {String}
     */
    function generateSignature( receiver , event ){
        
        var signature = '';
        
        switch( typeof receiver ){
            case 'string':
                signature = receiver;
                break;
            case 'function':
                signature = receiver.name;
                break;
            case 'object':
                signature = receiver.prototype.name;
                break;
        }

        return signature.length ? [ signature , event ].join('.') : event;
    }
    /**
     * @param {Object|Function|String} signature
     * @param {String} event
     * @returns {Boolean}
     */
    this.checkSignature = ( signature , event ) => {
        
        var handler = generateSignature( signature , event );
        
        return typeof _bus.handlers[ handler ] === 'object';
    };
    /**
     * 
     * @param {String} event
     * @param {Object} data
     * @param {Object|String} receiver
     * @returns {EventBus}
     */
    this.register = ( event , data , receiver ) =>{
        
        var evtNode = generateSignature( receiver , event );
        
        if( typeof _bus.handlers[ evtNode ] === 'undefined' ){
            _bus.handlers[ evtNode ] = new CustomEvent(
                    event ,
                    {'detail': data } );
        }
        
        return this;
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


