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
                function asyncLoop(iterations, func, callback) {
                    var index = 0;
                    var done = false;
                    var loop = {
                        next: function() {
                            if (done) {
                                return;
                            }

                            if (index < iterations) {
                                index++;
                                func(loop);

                            } else {
                                done = true;
                                callback();
                            }
                        },

                        iteration: function() {
                            return index - 1;
                        },

                        break: function() {
                            done = true;
                            callback();
                        }
                    };
                    loop.next();
                    return loop;
                }

                var usersToUpdate = [];
                for (var i = 0; i < users.length; i++) 
                    if (users[i].integrations && users[i].integrations.nutshell && users[i].integrations.nutshell.nutshellAPI_Password && users[i].integrations.nutshell.nutshellAPI_Key && users[i].integrations.nutshell.nutshellId) 
                        usersToUpdate.push(users[i]);

                var userIndex = 0;    

                asyncLoop(usersToUpdate.length, function (loop) {
                    usersToUpdate[userIndex].getPerformanceMetrics(usersToUpdate[userIndex], function (user) {
                        usersToUpdate[userIndex].getRedLeads(usersToUpdate[userIndex], function (user) {
                            console.log('++++++UPDATED+++++++ ' + usersToUpdate[userIndex].username);
                            userIndex++;
                            console.log(loop.iteration());
                            loop.next();
                        })
                    })
                    },
                    function() {console.log('cycle ended')}
                );      

                // for (var i = 0; i < usersToUpdate.length; i++) {
                //     if (i == users.length - 1) {
                //         usersToUpdate[i].getPerformanceMetrics(users[i], function (user) {
                //             console.log('-scope of users[i]? - ' + users[i]);
                //             user.getRedLeads(user, function (user) {
                //                 console.log(user.username + '\'s nutshell data was resynced');
                //                 done();
                //             });    
                //         });
                //     }
                //     else {
                //         usersToUpdate[i].getPerformanceMetrics(users[i], function (user) {
                //             console.log('-scope of users[i]? - ' + users[i]);
                //             user.getRedLeads(user, function (user) {
                //                 console.log(user.username + '\'s nutshell data was resynced');
                //             });    
                //         });
                //     }
                    
                // }
            });
        },
    };

    return job;
}