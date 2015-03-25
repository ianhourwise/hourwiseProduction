module.exports = function(agenda) {
    var job = {
    
        // job name (optional) if not set, 
        // Job name will be the file name or subfolder.filename (without .js)
        name: 'Nutshell',

        // set true to disabled this hob
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        frequency: 'schedule at 6:30am',

        // Jobs options
        //options: {
            // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
            //priority: 'highest'
        //},
        
        // Jobs data 
        //data: {},
        
        // execute job
        run: function(job, done) {
            User.find().exec(function (err, users) {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].integrations && users[i].integrations.nutshell && users[i].integrations.nutshell.nutshellAPI_Password && users[i].integrations.nutshell.nutshellAPI_Key && users[i].integrations.nutshell.nutshellId) {
                        users[i].getPerformanceMetrics(users[i]);
                        users[i].getRedLeadsNoCallback(users[i]);

                        console.log(users[i].username + '\'s nutshell data was resynced');
                    }
                }

                done();
            });
        },
    };

    return job;
}