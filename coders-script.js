function CoderTools() {

    
}


CoderTools.Geolocation = function () {

    return this;
};

CoderTools.Geolocation.Current = function(){
    
    window.navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
    }, error => {
        console.error(error);
    });
};


CoderTools.HTML = function( element, attributes , content ){
    
    var _node = {
        'name': typeof element !== 'undefined' ? element : 'div',
        'attributes': [],
        'content' : typeof content !== 'undefined' ? content : false
    };
    /**
     * @returns {String}
     */
    this.toString = function(){

        return ( _node.content !== false ) ?
            '<' + _node.name + ' ' + this.serializeAtts() + '>' + content.toString() + '</' + _node.name + '>' :
            '<' + _node.name + ' ' + this.serializeAtts() + '/>';
    };
    /**
     * 
     * @param {type} atts
     * @returns {Array}
     */
    this.importAtts = function( atts ){
        
        switch( typeof atts ){
            case 'string':
                break;
            case 'object':
                for( var key in atts ){
                    _node.attributes[ key ] = Array.isArray( atts[ key ] ) ?
                            atts[ key ].join(' ') :
                            atts[ key ].toString();
                }
                break;
            case 'number':
                break;
        }
        
        return this;
    };
    /**
     * @returns {String}
     */
    this.serializeAtts = function( ){
      
        var atts = [];

        for( var key in _node.attributes ){
            
            var val = _node.attributes[ key ];
            
            atts.push( key + '="' + val + '"' );
        }
        
        return atts.join(' ');
    };
    
    return this.importAtts( attributes );
};

