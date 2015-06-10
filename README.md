# hourwise

a [Sails](http://sailsjs.org) application

Getting Up and Running

1. Ensure node is installed on your machine.

2. Install sails globally through npm, using 'sudo npm -g install sails'.

3. Install mongoDB. (ref. http://docs.mongodb.org/manual/installation/ )

4. Clone the hourwise repository into the location of your choice, using 'git clone https://github.com/jonhill04/hourwise'

5. Navigate to the directory that you cloned the repository into. 

6. Start mongo by running 'mongod' in terminal

7. Create a file named 'local.js' and place it in the 'config' directory in the project directory then add the following content to the file:
	module.exports = {

  /***************************************************************************
   * Your SSL certificate and key, if you want to be able to serve HTTP      *
   * responses over https:// and/or use websockets over the wss:// protocol  *
   * (recommended for HTTP, strongly encouraged for WebSockets)              *
   *                                                                         *
   * In this example, we'll assume you created a folder in your project,     *
   * `config/ssl` and dumped your certificate/key files there:               *
   ***************************************************************************/

  // ssl: {
  //   ca: require('fs').readFileSync(__dirname + './ssl/my_apps_ssl_gd_bundle.crt'),
  //   key: require('fs').readFileSync(__dirname + './ssl/my_apps_ssl.key'),
  //   cert: require('fs').readFileSync(__dirname + './ssl/my_apps_ssl.crt')
  // },

  /***************************************************************************
   * The `port` setting determines which TCP port your app will be           *
   * deployed on.                                                            *
   *                                                                         *
   * Ports are a transport-layer concept designed to allow many different    *
   * networking applications run at the same time on a single computer.      *
   * More about ports:                                                       *
   * http://en.wikipedia.org/wiki/Port_(computer_networking)                 *
   *                                                                         *
   * By default, if it's set, Sails uses the `PORT` environment variable.    *
   * Otherwise it falls back to port 1337.                                   *
   *                                                                         *
   * In env/production.js, you'll probably want to change this setting       *
   * to 80 (http://) or 443 (https://) if you have an SSL certificate        *
   ***************************************************************************/

  // port: process.env.PORT || 1337,

    someMongodbServer: {
    
      // adapter: 'sails-disk'
  
      // Comment/Uncomment for Production
      adapter: 'sails-mongo',
      host: 'localhost',
      port: 27017,
      database: 'hourwise'  
      //Comment/Uncomment for Production
       //url: "mongodb://stageadmin:$tageHourW!$e@dogen.mongohq.com:10045/hourwise-staging"
       //url: process.env.DB_URL

  },

  sockets: {
    adapter: 'memory'
  },

  session: {
    adapter: 'memory',

  }




  /***************************************************************************
   * The runtime "environment" of your Sails app is either typically         *
   * 'development' or 'production'.                                          *
   *                                                                         *
   * In development, your Sails app will go out of its way to help you       *
   * (for instance you will receive more descriptive error and               *
   * debugging output)                                                       *
   *                                                                         *
   * In production, Sails configures itself (and its dependencies) to        *
   * optimize performance. You should always put your app in production mode *
   * before you deploy it to a server.  This helps ensure that your Sails    *
   * app remains stable, performant, and scalable.                           *
   *                                                                         *
   * By default, Sails sets its environment using the `NODE_ENV` environment *
   * variable.  If NODE_ENV is not set, Sails will run in the                *
   * 'development' environment.                                              *
   ***************************************************************************/

   // environment: process.env.NODE_ENV || 'development'

};


8. This file allows you to overwrite any environment variables that are present in the code. As it is right now it will connect you to a mongoDB on localhost, however if you wish to connect to the staging database you can comment out the lines that start with 'host', 'port', and 'database', then uncommenting the line that starts with 'url: "mongodb..."'.

9. Ensure you're in the root directory of the project, then execute the command 'npm install'. (note: if your permissions for npm are not set up properly you may have to run all npm commands with sudo)

10. After npm has installed all the necessary modules, you're ready to start the sails server by running the command 'sails lift'

11. Navigate your browser to 'localhost:1337' and you should see the hourwise homepage. Everything is up and running now and you have a working local instance of the project. 

Ref.

Sails.js - http://sailsjs.org/

MongoDB - http://docs.mongodb.org/

NPM - https://www.npmjs.com/


