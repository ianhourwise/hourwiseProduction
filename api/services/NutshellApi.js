//Nutshell Api Functions 
JsonRpc = require('../services/JsonRpc');


module.exports = {
  createClient: function(username, api_key) {
    
    var client = JsonRpc.create('https://app01.nutshell.com/api/v1/json', username, api_key);
    
    return client;
  },

  nutshell: function(callback) {
  // client = NutshellApi.createClient("jon@hourwise.com","22b17e8532cef15c2dc2a4579caf94498c1d0324");
  // //Could this be an issue with Asynchronous calls?
  // // blah = getActiveUsers(client);
  // // console.log(getActiveUsers(client, callback));
  // getActiveUsers(client, callback);
  // // callback(null, getActiveUsers(client));
  // // callback(null, getActiveUsers(client));
  callback(null, ['test']);
  },

  getNutshellId: function(username, api_key, name, cb){
    var client = NutshellApi.createClient(username, api_key);
    var users = getActiveUsers(client); 
    console.log(users); 
    nutshellId= 'pre-loop';
    for(var i in users){
      if(users[i].name == name) { nutshellId = users[i].id; cb(nutshellId);}
      else {nutshellId = 'none'};
    }
    
  },
// Valid reportType strings: [Effort, NewLeads, Pipeline, SalesCycle, SalesProcess, Success, ]
// Effort (Activities + activities on won leads)
// NewLeads (# of new leads)
// Pipeline (# of open leads + open lead value)
// SalesCycle (Avg. # of days to close a lead)
// SalesProcess (Leads on time)
// Success (statistics about won leads)
// Valid period strings:
// "yyyy" for specific whole years (e.g. "2009")
// "yyyy-mm" for specific months (e.g. "2009-10")
// "yyyy-Q#" for specific quarters (e.g. "2009-Q3" for 3rd quarter of 2009)
// "timestamp-timestamp" for exact ranges (e.g. "1277930662-1277956800")
// "w" for current week
// "m" for current month
// "y" for current year
// "-d30" for past 30 (or x) days
// The filter is an optional array of entity dictionaries (entityName and entityId). Valid entityNames: [Users, Teams, Products, Sources]

  getSalesAnalytics: function(user, callback){
    // var client = NutshellApi.createClient("jon@hourwise.com","22b17e8532cef15c2dc2a4579caf94498c1d0324");
    console.log(user.name);
    console.log(user.integrations.nutshell.nutshellId);
    var client = NutshellApi.createClient(user.integrations.nutshell.nutshellAPI_Key,user.integrations.nutshell.nutshellAPI_Password);
    client.call('getAnalyticsReport', 
                  { "reportType": "Success", 
                    "period":"y", 
                    "filter": [
                       {
                           "entityId" : user.integrations.nutshell.nutshellId,
                           "entityName" : "Users"
                       }
                    ],                    
 
                    "options":null}, 
                  function(err, res){
                    if(err) {console.log(err); throw err}
                    else{                            
                        console.log(res);
                        callback(null, res);            
                    }
                  });
  }, 

  getPerformanceReports: function(user, callback){
  console.log(pTasks + '____________________');
  console.log(completedTasks + '_________________________');
  var task1= function(){ return getSalesReport(user, callback)};
  var task2= function(){ return getLeadsReport(user,callback)};
  var task3= function(){ return getPipelineReport(user,callback)};
  pTasks = [task1, task2, task3];
  // pTasks = [task1];

  for (var task in pTasks){
    pTasks[task]();
    }
},

  //Find open leads on one user 
 getRedLeads: function(user, callback) {
  pTasks = [];
  completedTasks = 0;
  // console.log(user.nutshellAPI_Password);
  // callback(null, user, {'heck': 'yeah hector'});  
  console.log('getting leads....');
  var client = NutshellApi.createClient(user.integrations.nutshell.nutshellAPI_Key,user.integrations.nutshell.nutshellAPI_Password);
  client.call('findLeads',{ "query" :{"status": 0, "assignee":[{"entityType": "Users", "id": user.integrations.nutshell.nutshellId}]},
                  "stubResponses": false, "limit": 100}, function(err, res){
                      if(err) {console.log(err); throw err}
                      else{ 
                        //console.log(res);
                        var red=0;
                        var green=0;
                        var userCounts={};
                        var leadsDetail = {};
                        var newResponse = {};
                        for (var index in res){
                          if(res[index].isOverdue){
                            red++;
                            var milestone = res[index].milestone.name;
                            var lead = res[index].name;
                            var description = res[index].description;
                            var value = res[index].value ? res[index].value.amount : 0  ;
                            var primaryContact = (res[index].contacts[0] ) ? res[index].contacts[0].name: '';
                            var fullLead = {'name': lead, 'description': description, 'milestone': milestone, 'value': value, 'contact': primaryContact};
                            userCounts[milestone] = (userCounts[milestone]) ? userCounts[milestone] + 1 : 1;
                            if (leadsDetail[milestone]){ leadsDetail[milestone].push(fullLead); }
                            else{leadsDetail[milestone] = [fullLead]; }
                            // leadsDetail[milestone] = (leadsDetail[milestone]) ? leadsDetail[milestone].push(fullLead) : [fullLead];
                            // console.log(leadsDetail[milestone]);
                            // console.log(typeof(leadsDetail[milestone]));
                            }
                            else{ green++}
                        }
                        userCounts["Total_PCT_Red"]= red/res.length;
                        userCounts["Total_Red_Leads"]= red;
                        //I thing the line below got brought over from another function...
                        // leadCounts[user] = userCounts; 
                        newResponse= {'counts': userCounts, 'leads': leadsDetail};
                        completedTasks = 0;
                        // newResponse['res']= res;
                        // console.log(newResponse);
                        // callback(null, user, newResponse);
                        callback(null, newResponse);
                      }
                });
// for(var user in users){
//         var query= (function(user){
//             return function(){
//                 // console.log(user.id)
//                 client.call('findLeads',{ "query" :{"status": 0, "assignee":[{"entityType": "Users", "id": user.id}]},
//                   "stubResponses": false, "limit": 100}, function(err, res){
//                       if(err) {console.log(err); throw err}
//                       else{ 
//                           countAndCategorizeByOwner(user.name, res);
//                           checkIfComplete();
//                       }
//                 });
//               }
//         })(users[user]);
//         queries.push(query);
//     }
//     for (var query in queries){
//     queries[query]();
//     }
//   next(null, "empty");
  
}




};


//Hard-Coded Api Keys
//Umbrella Account
//Sans Impersonation
// var username = "jon@hourwise.com";
// var api_key = "20e8dea728bcffaf5d9b6572eea63008a1ce1023";
//Con impersonation
var username = "jon@hourwise.com";
var api_key = "22b17e8532cef15c2dc2a4579caf94498c1d0324";

//89 Paint
// var username = "jon@89paint.com"
// var api_key = "3de55d809969c44d07e99f4ebd97e1b294a665e7";

// Get api endpoint (this is hardcoded in below)
// client = new JsonrpcClient('https://api.nutshell.com/v1/json');

// // console.log(client);
// client.call(
//     'getApiForUsername', 
//     { "username":"jim@demo.nutshell.com"}, 
   
//     function(error, response) {
//     if (error) { console.log(error); }
//     else { console.log(response); }
//   }

// );

// Umbrella Algorithm

// 1) Create JsonrpcClient with endpoint and user creds
// 2) Get and store list of users and their ids
// 3) Get and store list of Milestones (get ids) [New, Appt Set, Estimated, Proposal Viewed, In Progress, Closing] --> Can hard-code for now
// 4) Loop through each user and get open leads 
// 5) Group Overdue Leads: {Owner: <name> {Count: <count>, New: [number- description], Set: [number-description], 
//         Sent: [number-description], Viewed: [number-description] }}
// - Needs Initial Phone Call (New)
// - Estimate follow up (Need to send proposal ASAP) (Appt. Set)
// - Quote should have been viewed (Estimated)
// - Lead needs follow up, bug client! (Proposal Viewed)

// Create JsonrpcClient with endpoint and user creds
// client = new JsonrpcClient('https://app01.nutshell.com/api/v1/json')
// var client = JsonRpc.create('https://app01.nutshell.com/api/v1/json', username, api_key);
// client= TestService.ts();
var users = [{"Test": "Tester"}];
var overdue =[];
var assignees =[];
var unassigned =[];
var counts = {};
// var test = [];
//Completed Queries
var completedQueries = 0;
var queries = [];
var completedTasks = 0;
var pTasks = [];
var leadCounts = {};
var globalTest = '';
// var blah = 'Hello Nutshell World';
var data = {};
// var Ronnie= {
//     name: "Ronnie Evans",
//     company: "89 Paint",
//     email: "ronnie@89paint.com",
//     nutshellId: "23",
//     password: "1234",
//     confirmation: "1234",
//     _csrf: "jlqGq8P08hZ1xf3PK69xvQzZD8hWD3PUeAhL4=",
//     encryptedPassword: "$2a$10$ewhyikPRxkGWLeV2FBrD8.vmKPqITETSfkq3wekJVdbEBILPwbH1i",
//     performanceMetrics: {  },
//     nutshellAPI_Key: "jon@89paint.com",
//     nutshellAPI_Password: "3de55d809969c44d07e99f4ebd97e1b294a665e7",
//     salesGoal: 1500000
// };

// getLeadsReport(Ronnie, function(err, res){console.log(res)});
function getActiveUsers(client, cb){
  // users = [{"Test": Date()}]; 
  client.call('findUsers', {stub:true} ,
   function(error, response) {
       testReturnCB = 'returnstring';
       if (error) { console.log(error); }
       else { 
         // users= response;
         // console.log(logResponsee);
         var test = [];
         for(i=0; i<response.length; i++){
             if(response[i].isEnabled) {
                 test.push(response[i]);
              }
             // else {console.log(response[i].name + " isn't enabled")}
          }
          input =  "This is a test inside successful callback";
          cb(null, test);
          return test
        }
    // console.log(users);
    return "This is a test inside the unssuccessful callback"
    // next(null,users); 
   });
  // setTimeout(function(){console.log("This is a long test"); users= [{"Testies":"Made it!"}]; return users}, 5000);
 
  // next2 (null, users);
// return "This is a test outside the callback"
// return testCall.testReturnCB;   
}



function checkIfComplete() {
  completedQueries++;
  if (completedQueries == queries.length) {
    for (var usr in leadCounts) {
        for(var milestone in leadCounts[usr]){
          console.log(usr +':' + milestone+ '-'+ leadCounts[usr][milestone]) ;  
        }
    } 
  }

}

function countAndCategorizeByOwner(user, leads){
    var red=0;
    var green=0;
    var userCounts={};
    for (var index in leads){
        if(leads[index].isOverdue){
            red++;
            var milestone = leads[index].milestone.name;
            // if (milestone){
                userCounts[milestone] = (userCounts[milestone]) ? userCounts[milestone] + 1 : 1;
            // }
        }
        else{ green++}
    }
    userCounts["Total Percent Red"]= red/leads.length;
    userCounts["Total Red Leads"]= red;
    leadCounts[user] = userCounts; 
}


//Find leads on all users in parallel

function getAllOpenLeads(users){
    for(var user in users){
        var query= (function(user){
            return function(){
                // console.log(user.id)
                client.call('findLeads',{ "query" :{"status": 0, "assignee":[{"entityType": "Users", "id": user.id}]},
                  "stubResponses": false, "limit": 100}, function(err, res){
                      if(err) {console.log(err); throw err}
                      else{ 
                          countAndCategorizeByOwner(user.name, res);
                          checkIfComplete();
                      }
                });
              }
        })(users[user]);
        queries.push(query);
    }
    for (var query in queries){
    queries[query]();
    }
  next(null, "empty");
}

function logResponse(response){
    console.log(response);    
}       

//Force serial Flow
var tasks = [ getActiveUsers,
              getAllOpenLeads];//,
              // countAndCategorizeByOwner,
              // countAndCatgorizeByMilestone ];
function next(err, result) {
  if (err) throw err;
  var currentTask = tasks.shift();
  if (currentTask) {
    currentTask(result);
  } 
}

function checkIfComplete2(callback){
  completedTasks++;
  if (completedTasks == pTasks.length){
    //trigger callback that pushes performance metrics to user. 
    // console.log("we made it!" + data['leads'] + data['sales']);
    // console.log(require('util').inspect(data, true, 10));
    pTasks = [];
    completedTasks = 0;
    callback(null, data);
  }

}

// getPerformanceReports(Ronnie, function(){console.log('Made it')});


function getSalesReport(user, callback){
  console.log('getting sales reports...');
  // client = NutshellApi.createClient(user.nutshellAPI_Key,user.nutshellAPI_Password);
  var client = createClient(user.integrations.nutshell.nutshellAPI_Key,user.integrations.nutshell.nutshellAPI_Password);
  // var client = createClient(username,api_key);
  // console.log(client);
  client.call('getAnalyticsReport', 
                // { "reportType": "Success", 
                //   "period":"y", 
                //   "filter":[{"entityId": 23, "entityName": "Users"}], 
                //   // "filter":[{"entityId": user.nutshellId, "entityType": "Users"}], 
                //   // "filter":[{"entityId": user.nutshellId, "entityName": "Users"}], 
                //   "options":null},
                 // { "reportType": "Success", 
                 //  "period":"y", 
                 //  "filter":[{"entityId": 23, "entityType": "Users"}], 
                 //  "options":null}, 
                 { "reportType": "Success", 
                    "period":"y", 
                    "filter": [{"entityId" : user.integrations.nutshell.nutshellId, "entityName" : "Users"}],                  
                    "options":null}, 

                function(err, res){
                  if(err) {console.log(err); throw err}
                  else{                            
                      // console.log(res);
                      data["sales"] = res;
                      // console.log(data);
                      console.log("nutshell id:" + user.integrations.nutshell.nutshellId);
                      //console.log("nutshell name:" + user.name);
                      console.log("nutshell u/n:" + user.integrations.nutshell.nutshellAPI_Key);
                      console.log("nutshell p/w:" + user.integrations.nutshell.nutshellAPI_Password);
                      console.log(res.summaryData.won_lead_value.sum);
                      checkIfComplete2(callback);            
                  }
                });
}

function getLeadsReport(user, callback){ 
  console.log('getting leads report...');

  // client = NutshellApi.createClient(user.nutshellAPI_Key,user.nutshellAPI_Password);
  var client = createClient(user.integrations.nutshell.nutshellAPI_Key,user.integrations.nutshell.nutshellAPI_Password);
  client.call('getAnalyticsReport', 
                { "reportType": "NewLeads", 
                  "period":"y", 
                  "filter":[{"entityId": user.integrations.nutshell.nutshellId, "entityName": "Users"}], 
                  "options":null}, 
                function(err, res){
                  if(err) {console.log(err); throw err}
                  else{                            
                      // console.log(res);
                      data["leads"] = res;
                      console.log('got leads reports');
                      checkIfComplete2(callback);           
                  }
                });
}

function getPipelineReport(user, callback){
  console.log('getting pipeline report...');
  // client = NutshellApi.createClient(user.nutshellAPI_Key,user.nutshellAPI_Password);
  var client = createClient(user.integrations.nutshell.nutshellAPI_Key,user.integrations.nutshell.nutshellAPI_Password);
  client.call('getAnalyticsReport', 
                { "reportType": "Pipeline", 
                  "period":"y", 
                  "filter":[{"entityId": user.integrations.nutshell.nutshellId, "entityName": "Users"}], 
                  "options":null}, 
                function(err, res){
                  if(err) {console.log(err); throw err}
                  else{                            
                      // console.log(res);
                      data["pipeline"] = res;
                      console.log('got pipeline report');
                      checkIfComplete2(callback);           
                  }
                });
}

function createClient(username, api_key) {
    
    var client = JsonRpc.create('https://app01.nutshell.com/api/v1/json', username, api_key);
    
    return client;
  }
// exports.nutshell = function(callback) {
   
// //Could this be an issue with Asynchronous calls?
//   users = getActiveUsers();

//   callback();
//    // return users;

//   // return client;
// };

//run tasks in serial
// next();

//API Examples
// var call1 = client.call('findUsers', {stub:true} ,
//         function(error, response) {
//             if (error) { console.log(error); }
//             else { 
//              // console.log(response);
//             // return users
//             users= response;
//             // console.log("Got " + users.length+" Users "+ users);
//             for(i=0; i<users.length; i++){
//                 if(users[i].isEnabled) {
//                     console.log(users[i].name + " - " + users[i].id);
//                     var call2 = client.call('findLeads',{"query": {
//                         "status": 0,  "assignee":[{ "entityType": "Users", "id": users[i].id}]},
//                         "stubResponses": false,
//                         "limit": 100 }, function(error, response){
//                             if (error) {console.log(error);}
//                             else {
//                              for (j= 0; j < response.length; j++){
//                                 if (response[j].isOverdue) {
//                                         overdue.push(response[j].name);
//                                         if(response[j].assignee != null ){ assignees.push(response[j].assignee.name);}
//                                             else {unassigned.push(response[j].number);}
//                                      }
//                                 }
//                             console.log(i);
//                             // console.log(users[i].name);
//                             // if(i==users.length) {console.log(assignees);};
//                             }
//                         });
                    
//                 }
//                 else {console.log(users[i].name + "isn't enabled")}
//             // var counts = {};
//             // for(var i=0; i<assignees.length; i++) {
//             //   var str = assignees[i];
//             //   counts[str] = str in counts ? counts[str] + 1 : 1;
//             // }           
//             }
            
//             }
//     });
// // }

// // console.log(users);

// console.log("hello");

// var test = testing();
// function testing () {
//     var testing = {test: "test"};
//     return testing;
// }

// console.log(test);

// // Examples and Experiments
// // client2= new JsonrpcClient('https://api.nutshell.com');
// client2= new JsonrpcClient('https://app01.nutshell.com/api/v1/json');

// // // console.log(client2);
// client2.call(
//     // 'getAnalyticsReport',{
//     // 'reportType': "Effort",
//     // 'period': 2014,
//     // 'filter': null,
//     // 'options': null},    
// // unassigned4373,4529,4657,4661,4721,4737
//     'getLead', 
//     {"leadId": 4737},

//     // 'editStep', 
//     // {"stepId": 68189,
//     //   "rev": 0 , 
//     //   "step": {"status": 2}
    
//     // },

//     // // 'findTasks',
//     // 'findProcesses',
//     // {"query": {
//     //  "entity": { "entityType": "Leads", "id": 4729 }},
   
// //Get Number open leads (not viewed)
//     // 'findLeads',
//     // {"query": {
//     //     "status": 0},
//     //     // "isOverdue": true}, 
//     //     // "stubResponses": true,
//     //     "stubResponses": false,
//     //     "limit": 100 },


//     // // 'findLeads',
//     // // { "query" :{"number": 1966 },
//     // // {"query": {
//     // //     // "number": 1929},
//     // //     "status": 0},
//     // //     // "isOverdue": true}, 
//     //     // "stubResponses": true,
//     //     "stubResponses": false},
//     // //     "limit": 1000 },
//     function(error, response) {
//     if (error) { console.log(error); }
//     else { 
//         var list = response;
//         var len = response.length;
//         var overdue = [];
//         var assignees = [];
//         var unassigned = [];
//         // console.log('Returned...'+len.toString());
//         // console.log(response[0].isOverdue);
//         // for (i= 0; i < len; i++){
//         //     if (response[i].isOverdue) {
//         //         overdue.push(response[i].name);
//         //         if(response[i].assignee != null ){ assignees.push(response[i].assignee.name)}
//         //             else {unassigned.push(response[i].number)}
//         //      }
//         // }


//         // var counts = {};
//         // for(var i=0; i<assignees.length; i++) {
//         //   var str = assignees[i];
//         //   counts[str] = str in counts ? counts[str] + 1 : 1;
//         // }

        
//         // console.log(overdue.length.toString() + ' leads of ' + len.toString() + ' are RED');
//         // console.log(counts);
//         // console.log(unassigned.length + ' are unassigned' + unassigned);
//         // console.log(overdue);

//         console.log(response); 
//         }
//     }
//     );

