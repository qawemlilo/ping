
var request = require('request'),
    statusCodes = require('http').STATUS_CODES;


/*
    Ping Constructor
*/
function Ping (opts) {
    // holds website to be monitored
    this.website = '';
    
    // ping intervals in minutes
    this.timeout = 15;
    
    // interval handler
    this.handle = null;

    // call the initialization method
    this.init(opts);
}

/*
    Methods
*/

Ping.prototype {

    init: function (opts) {
        var self = this;
        
        self.website = opts.website;
        
        self.timeout = (opts.timeout * (60 * 1000)); // timeout x 1 minute

        // start monitoring
        self.start();  
    },




    start: function () {
        var self = this,
            time = Date.now();
        
        console.log("\nLoading... " + self.website + "\nTime: " + time + "\n");
        
        // create an interval for pings
        self.handle = setInterval(function () {
            self.ping();
        }, self.timeout); 
    },




    ping: function () {
        var self = this, currentTime = Date.now();
        
        function handleResponse (error, res, body) {
            // Website is up
            if (!error && res.statusCode === 200) {
                self.isOk();
            }
            
            // No error but website not ok
            else if (!error) {
                self.isNotOk(res.statusCode);   
            }
            
            // Loading error
            else {
                self.isNotOk();
            }
        }
        
        try {
            // send request
            request(self.website, handleResponse);
        }
        catch (err) {
            self.isNotOk();
        }
    },




    isOk: function () {
        this.log('UP', 'OK');
    },

    
    

    isNotOk: function (statusCode) {
        var msg = statusCodes[statusCode + ''],
        
        self.log('DOWN', msg);
    },




    log: function (status, msg) {
        var self = this, 
            time = Date.now(), 
            output = '';
        
        output += "\nWebsite: " + self.website;
        output += "\nTime: " + time;
        output += "\nStatus: " + status;
        output += "\nMessage:" + msg  + "\n";
        
        console.log(output);
    },
    
    



    getFormatedDate: function (time) {
        var currentDate = new Date(time);
  
        currentDate = currentDate.toISOString();
        currentDate = currentDate.replace(/T/, ' ');
        currentDate = currentDate.replace(/\..+/, ''); 

        return currentDate;
    }    
};

module.exports = Ping;
