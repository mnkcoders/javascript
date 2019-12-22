
Location = function () {

    return this;
};

Location.Current = function(){
    
    window.navigator.geolocation.getCurrentPosition( position => {
        console.log(position);
    }, error => {
        console.error(error);
    });
};


HTML = function( element, attributes , content ){
    
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

/**
 * @type CookieManager
 */
class CookieManager {
    /**
     * @param {Array|Object} inputCookies Define nuevas cookies en el documento
     * @returns {CookieManager}
     */
    constructor(inputCookies) {

        this.cookies = [];

        if (document.cookie.length > 0) {

            var list = document.cookie.split(';');

            for (var i = 0; i < list; i++) {

                var val = list[ i ].split('=');

                this.set(val[0], val.length > 1 ? val[ 1 ] : true);
            }
        }

        if (typeof inputCookies === 'object') {
            //si es objeto o array
            for (var key in inputCookies) {
                if (inputCookies.hasOwnProperty(key)) {
                    this.set(key, inputCookies[ key ]).register(key);
                }
            }
        } else if (typeof inputCookies === 'string') {
            //si es cadena de texto
            this.set(inputCookies, true).register(inputCookies);
        }
    }
    /**
     * @param {String} name
     * @returns {CookieManager}
     */
    register(name) {

        if (this.exists(name)) {

            var cookie = name + '=' + this.get(name);

            var expiration = this.expiration(name);

            var path = this.path(name);

            if (expiration.length) {
                cookie += '; expires=' + expiration;
            }

            if (path.length) {
                cookie += '; path=' + path;
            }

            document.cookie = cookie;
        }
        return this;
    }
    /**
     * @param {String} cookie
     * @param {Mixed} def
     * @returns {Mixed}
     */
    get(cookie, def) {

        return this.cookies.hasOwnProperty(cookie) ?
                this.cookies[ cookie ].value :
                typeof (def !== undefined) ? def : null;
    }
    /**
     * @param {String} cookie
     * @returns {String}
     */
    expiration(cookie) {

        return this.cookies.hasOwnProperty(cookie) ? this.cookies[ cookie ].expires : '';
    }
    /**
     * @param {String} cookie
     * @returns {String}
     */
    path(cookie) {

        return this.exists(cookie) && this.cookies[cookie].path.length > 0 ?
                this.cookies[ cookie ].path :
                '/';
    }
    /**
     * @param {String} cookie
     * @returns {Boolean}
     */
    exists(cookie) {
        return this.cookies.hasOwnProperty(cookie);
    }
    /**
     * @param {String} cookie
     * @param {String} value
     * @param {String} expires
     * @param {String} path
     * @param {Boolean} register
     * @returns {CookieManager}
     */
    set(cookie, value, expires, path, register) {

        this.cookies[ cookie ] = {
            'value': value,
            'expires': typeof expires === 'string' ? expires : '',
            'path': typeof path === 'string' ? path : ''
        };

        if (typeof register === 'boolean' && register) {
            this.register(cookie);
        }

        return this;
    }
    /**
     * @returns {Object}
     */
    list() {

        var output = {};

        for (var cookie in this.cookies) {

            output[ cookie ] = this.get(cookie);
        }

        return output;
    }
    /**
     * @returns {JSON}
     */
    serialize( ) {

        return JSON.stringify(this.list( ));
    }
    /**
     * @returns {String}
     */
    toString() {
        var output = [];
        for (var cookie in this.cookies) {
            output.push(cookie + '=' + this.get(cookie));
        }
        return output.join('; ');
    }
}
