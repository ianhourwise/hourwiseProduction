
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
 // try catch?

  if(req.url != '/' || req.url != '/homepage' || req.url != '/landing'){
  	res.locals.layout = "layouts/layout"; 
  	return next();}
  // else if(req.url){
  // 	res.locals.layout = "layout";
  // 	return next();
  // }
  // else{res.local.layout = "staticLayout";}

  return next();
};
