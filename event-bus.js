/**
 * @returns {EventBus}
 */
function EventBus(){
 
    var _bus = {
        'events': []
    };
    /**
     * @param {Object} content
     * @returns {Object}
     */
    function envelope( content ){
        return {
            'ts': (new Date()).getTime(),
            'data': typeof content === 'function' ? content() : content
        };
    };
    /**
     * @returns {Array}
     */
    this.dump = () => {
        var output = [];
        for( var e in _bus.events ){
            if( _bus.events.hasOwnProperty(e)){
                output[e] = _bus.events[e].length;
            }
        }
        return output;
    };
    /**
     * @param {String} event
     * @param {Function} callBack
     * @returns {EventBus}
     */
    this.listen = ( event , callBack ) => {
        
        if( typeof callBack === 'function' ){
            
            if( !_bus.events.hasOwnProperty( event ) ){
                _bus.events[ event ] = [];
            }
            
            _bus.events[ event ].push( callBack );
        }
        
        return this;
    };
    /**
     * @param {String} event
     * @param {Boolean|Number|String|Object|Callback} data
     * @returns {EventBus}
     */
    this.notify = (event , data ) => {
        
        if( _bus.events.hasOwnProperty( event ) ){
            for( var i = 0 ; i < _bus.events[event].length ; i++ ){
                _bus.events[ event ][i]( envelope( data ) );
            }
        }
        return this;
    };
    
    return this;
}
EventBus.Instance = new EventBus();
//EventBus.prototype = new EventBus();
Object.freeze(EventBus);

export {EventBus};