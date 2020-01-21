import {Content as DataBase} from './database.js';
import {Client as Request} from './client.js';
/**+
 * 
 * @returns {Server}
 */
export default function Server(){
    
    var _db = new DataBase({'a':1,'b':2,'c':3});
    
    this.get = () => _db.data();
    
    this.request = () => new Request();

    return this;
};

export {Server};