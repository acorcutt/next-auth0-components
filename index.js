const pm2 = require('pm2');

var instances = process.env.WEB_CONCURRENCY || -1; // Set by Heroku or -1 to scale to max cpu core -1
var maxMemory = process.env.WEB_MEMORY || 512;    // " " "

pm2.connect(() => {
  pm2.start({
    script    : 'app.js',
    name      : 'App',     // ----> THESE ATTRIBUTES ARE OPTIONAL:
    exec_mode : 'cluster',            // ----> https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#schema
    instances : instances,
    max_memory_restart : maxMemory + 'M',   // Auto restart if process taking more than XXmo
    env: {                            // If needed declare some environment variables
    },
  }, (err) => {
    if (err) return console.error('[PM2] Error while launching applications', err.stack || err);
    console.log('[PM2] Application has been succesfully started');
    
    // Display logs in standard output 
    pm2.launchBus((err, bus) => {
      if (err) return console.error('[PM2] Log bus error', err.stack || err);

      console.log('[PM2] Log streaming started');

      bus.on('log:out', function(packet) {
        console.log('[App:%s:%s] %s', packet.process.name, packet.process.pm_id, packet.data);
      });
        
      bus.on('log:err', function(packet) {
        // Mongoose debug logs trigger errors - why?
        console.error('[App:%s:%s] %s', packet.process.name, packet.process.pm_id, packet.data);
      });
    });
  });
});