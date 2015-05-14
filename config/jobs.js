/**
 * Default jobs configuration
 * (sails.config.jobs)
 *
 * For more information using jobs in your app, check out:
 * https://github.com/vbuzzano/sails-hook-jobs
 */

module.exports.jobs = {

  //Where are jobs files
  "jobsDirectory": "api/jobs",
  "db": { 
    //alternate address for dev and production!
   "address" :  process.env.DB_URL,
   //"address" :  "localhost:27017/jobs",
   "collection" : "agendaJobs" 
  },
  "name": "process name",
  "processEvery": "3 seconds",
  "maxConcurrency": 15,
  "defaultConcurrency": 10,
  "defaultLockLifetime": 10000
};