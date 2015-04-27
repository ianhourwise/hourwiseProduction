// module.exports = function (req, res, next) {
//   // Initialize Passport
//   passport.initialize()(req, res, function () {
//     // Use the built-in sessions
//     passport.session()(req, res, function () {
//       // Make the user available throughout the frontend
//       res.locals.user = req.user;

//       next();
//     });
//   });
// };
// var util = require('util');

module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
 // try catch?
  // console.log('got into layoutselection from : ' + util.inspect(req, false, null));
  console.log('************* ');
  console.log('got into layoutselection from : ' + req.url);
  console.log('*************' );
  next();
  // if(req.url != '/' || req.url != '/homepage' || req.url != '/landing'){
  // 	res.locals.layout = "layouts/layout"; 
  // 	return next();}
  // // else if(req.url){
  // // 	res.locals.layout = "layout";
  // // 	return next();
  // // }
  // // else{res.local.layout = "staticLayout";}

  // return next();
};
