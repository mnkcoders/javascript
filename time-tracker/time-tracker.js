/**
 * @returns {TimeTracker}
 */
function TimeTracker() {

        var _span = {
            /**
             * @type {Timer|Boolean}
             */
            'timer': false,
            /**
             * @@type Array
             */
            'sessions': [],
            /**
             * @type Object
             */
            'tasks':{'main':'Main','test':'Testers','game':'Game'},
            /**
             * @type {Number}
             */
            'interval': 0,
            /**
             * @returns {TimeTracker}
             */
            'controller': this
        };
        /**
         * @returns {Array}
         */
        this.sessions = () => _span.sessions;
        /**
         * @param {Timer} timer
         * @returns {TimeTracker}
         */
        this.add = function( timer ){
            //_span.sessions.push(timer);
            _span.sessions.unshift( timer );
            return this;
        };
        /**
         * @returns {Element}
         */
        this.getTimer = () => document.getElementById('timer');
        /**
         * @returns {Element}
         */
        this.getReset = () => document.getElementById('reset');
        /**
         * @returns {Element}
         */
        this.getSessions = () => document.getElementById('sessions');
        /**
         * @returns {Element}
         */
        this.getTasks = () => document.getElementById('tasks');
        /**
         * @returns {Element}
         */
        this.getTotal = () => document.getElementById('summary');
        /**
         * @returns {TimeTracker}
         */
        this.refreshTotals = function(){
            
            var T = this.total();
            
            var display = this.getTotal();
            
            var seconds = T.seconds % 60;
            var minutes = T.minutes + parseInt(seconds / 60);
            var hours = T.hours + parseInt( minutes / 60);
            minutes %= 60;
            
            if( null !== display ){
                display.innerHTML = '<strong>' + (hours > 9 ? hours : '0' + hours)
                    + '</strong>:<span>' + (minutes > 9 ? minutes : '0' + minutes)
                    + '</span>:<span>' + (seconds > 9 ? seconds : '0' + seconds)
                    + '</span>';
            }
            
            return this;
        };
        /**
         * @returns {TimeTracker}
         */
        this.refreshList = function () {
            var list = this.getSessions();
            list.innerHTML = '';
            var sessions = this.sessions();
            for (var s = 0; s < sessions.length; s++) {
                var item = document.createElement('li');
                item.setAttribute('data-init', sessions[s].init.getTime());
                item.setAttribute('data-end', sessions[s].end !== false ? sessions[s].end.getTime() : 0);
                item.innerHTML = sessions[s].toString();
                item.classList.add('item');
                //console.log( sessions[s]);
                if( sessions[s].running() ){
                    item.classList.add('active');
                }
                list.appendChild(item);
            }
            return this;
        };
        /**
         * @returns {String}
         */
        this.selectedTask = function(){
            
            return this.getTasks().value;
        };
        /**
         * @param {type} e
         * @returns {Object}
         */
        this.serialize = () => {
            var output = [];
            var sessions = this.sessions();
            for (var s = 0; s < sessions.length; s++) {
                output.push(sessions[s].data());
            }
            return output;
        };
        /**
         * @returns {TimeTracker}
         */
        this.save = function () {

            var data = JSON.stringify(this.serialize());

            window.localStorage.setItem('sessions', data);
            
            return this;
        };
        /**
         * @returns {TimeTracker}
         */
        this.load = function () {
            var data = window.localStorage.getItem('sessions');
            if (data !== null) {
                var input = JSON.parse(data);
                for( var s = 0 ; s < input.length ; s++ ){
                    //console.log( input[s] );
                    var session = new Timer(
                            input[s].init,
                            input[s].end,
                            input[s].title);
                    
                    this.add( session );
                }
            }
            return this.refreshList().refreshTotals();
        };
        /**
         * @returns {Object}
         */
        this.total = function(){
            var amount = {
                'hours':0,
                'minutes':0,
                'seconds':0,
            };
            _span.sessions.forEach( function( item ){
                amount.hours += item.hours( true );
                amount.minutes += item.minutes( );
                amount.seconds += item.seconds( );
            });
            return amount;
        };
        /**
         * @returns {TimeTracker}
         */
        this.syncTasks = function(){
            
            var tasks = this.getTasks();
            
            for( var t in _span.tasks ){
                if( _span.tasks.hasOwnProperty(t)){
                    var option = document.createElement('option');
                    option.setAttribute('value',t);
                    option.innerHTML = _span.tasks[ t ];
                    tasks.appendChild(option);
                }
            }
            
            tasks.addEventListener('change',function(e){
                e.preventDefault();
                //console.log('changed!!! ' + _span.controller.selectedTask());
                return true;
            });
            
            return this;
        };
        /**
         * @param {Function} handler
         * @returns {TimeTracker}
         */
        this.toggle = function( handler ){
            //console.log( typeof handler );
            if (_span.timer === false) {
                _span.timer = new Timer();
                _span.timer.setTask( this.selectedTask( ) );
                this.add( _span.timer ).save().refreshList().refreshTotals();
                console.log('Timer Started ' + _span.timer.toString());
                
                if( typeof handler === 'function' ){
                    handler( _span.timer.summary() );
                    _span.interval = window.setInterval(function () {
                        //console.log( _span.timer.summary());
                        handler( _span.timer.summary() );
                    }, 1000);
                }
            }
            else {
                if( _span.interval ){
                    window.clearInterval(_span.interval);
                    _span.interval = 0; 
                }
                _span.timer.stop();
                this.save().refreshList().refreshTotals();
                console.log('Timer Stopped ' + _span.timer.toString() + '');
                _span.timer = false;
                if( typeof handler === 'function' ){
                    handler( 'Start' );
                }
            }
            
            return this;
        };

        this.getReset().addEventListener('click',function(e){
            e.preventDefault();
            window.localStorage.clear();
            _span.sessions = [];
            _span.controller.refreshList().refreshTotals();
            return true;
        });

        //init events
        this.getTimer().text = function( text ){
            return this;
        };
        this.getTimer().addEventListener('click', function (e) {
            var btn = _span.controller.getTimer();
            _span.controller.toggle( function( text ){
                if( typeof text !== 'undefined' ){
                    btn.innerHTML = text.toString();
                }
                else{
                    btn.innerHTML = 'Start';
                }
            } );
        });
        
        this.load().syncTasks();
    };
/**
 * @param {Number} init 
 * @param {Number} end
 * @param {String} title 
 * @param {Array|String} tags 
 * @returns {Timer}
 */
function Timer(init, end, title, tags) {

    this.task = '';
    this.tags = tags || [];
    this.init = typeof init === 'number' ? new Date(init) : new Date();
    this.end = typeof end === 'number' ? new Date(end) : false;
    this.title = title || 'Session [ '
            + this.init.getUTCFullYear() + '/'
            + this.init.getUTCMonth() + '/'
            + this.init.getUTCDate() + ' '
            + this.init.getUTCHours() + ':'
            + this.init.getUTCMinutes() + ':'
            + this.init.getUTCSeconds() + ' ]';
    /**
     * @returns {String}
     */
    this.toString = function () {
        
        var display = this.title + ' ' + this.timeStamp();
        
        if( this.task.length ){
            display += ' for ' + this.task;
        }
        
        return this.elapsed() > 0 ? display + ' ' + this.summary() : display;
    };
    /**
     * @returns {String}
     */
    this.timeStamp = function(){
            return this.init.getUTCFullYear() + '/'
            + this.init.getUTCMonth() + '/'
            + this.init.getUTCDate() + ' '
            + this.init.getUTCHours() + ':'
            + this.init.getUTCMinutes() + ':'
            + this.init.getUTCSeconds() + ' ]';
    };
    /**
     * @param {String} task
     * @returns {Timer}
     */
    this.setTask = function( task ){
        this.task = task;
        return this;
    };
    /**
     * @param {String|Array} tag
     * @returns {Timer}
     */
    this.setTag = function( tag ){
        if( typeof tag === 'object' && Array.isArray( tag ) ){
            var timer = this;
            tag.forEach( function( tg ){
                timer.tags.push( tg );
            });
        }
        else if( typeof tag === 'string' ){
            this.tags.push( tag );
        }
        return this;
    };
    /**
     * @returns {Boolean}
     */
    this.running = function(){
        return this.end === false;
    };
    /**
     * @param {String} text
     * @returns {Timer}
     */
    this.rename = function (text) {
        if (typeof text === 'string' && text.length) {
            this.title = text;
        }
        return this;
    };
    /**
     * @returns {Number}
     */
    this.stop = function () {
        if (this.end === false) {
            this.end = new Date();
        }
        return this.elapsed();
    };
    /**
     * @returns {Number}
     */
    this.elapsed = function () {
        var current = this.end !== false ? this.end.getTime() : (new Date()).getTime();
        return current - this.init.getTime();
    };
    /**
     * @param {Boolean} total
     * @returns {Number}
     */
    this.hours = function (total) {
        if (typeof total !== 'boolean') {
            total = false;
        }
        return total ?
                parseInt(this.elapsed() / (3600 * 1000)) :
                parseInt((this.elapsed() / (3600 * 1000)) % 24);
    };
    /**
     * @param {boolean} total
     * @returns {Number}
     */
    this.minutes = function (total) {
        if (typeof total !== 'boolean') {
            total = false;
        }
        return total ?
                parseInt(this.elapsed() / (60 * 1000)) :
                parseInt((this.elapsed() / (60 * 1000)) % 60);
    };
    /**
     * @param {Boolean} total
     * @returns {Number}
     */
    this.seconds = function (total) {
        if (typeof total !== 'boolean') {
            total = false;
        }
        return total ?
                parseInt(this.elapsed() / (1000)) :
                parseInt((this.elapsed() / 1000) % 60);
    };
    /**
     * @returns {String}
     */
    this.summary = function () {
        var H = this.hours(true);
        var M = this.minutes();
        var S = this.seconds();

        if (H < 10) {
            H = '0' + H;
        }
        if (M < 10) {
            M = '0' + M;
        }
        if (S < 10) {
            S = '0' + S;
        }

        return H + ':' + M + ':' + S;
    };
    /**
     * @returns {Object}
     */
    this.data = function () {
        return {
            'init': this.init.getTime(),
            'end': this.end !== false ? this.end.getTime() : 0,
            'title': this.title,
            'task':this.task,
            'tags':this.tags
        };
    };
}

Timer.ts = () => (new Date()).getTime();


document.addEventListener('DOMContentLoaded', function (e) {

    new TimeTracker();

});
      