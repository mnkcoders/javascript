/**
 * @type Content
 */
export default function Content( data ){
    
    var _storage ={
        
    };
    /**
     * @type Content
     */
    this.load = ( db ) => {
        
        if( typeof db === 'object' ){
            console.log(db);
            var atts = Object.keys(db);
            console.log(atts);
            for( var i = 0 ; i < atts.length ; i++ ){
                if( db.hasOwnProperty( atts[i] ) ){
                    _storage[ atts[ i ] ] = db[ atts[ i ] ];
                }
            }
        }
        
        return this;
    };
    /**
     * 
     */
    this.data = () => _storage;
    
    return this.load( data );
}


export {Content};
