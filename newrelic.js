/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['hourwise'],
  /**
   * Your New Relic license key.
   */
  license_key: '05cfeec6dc1c910465b13599ff608f16ffed3546',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    // level: 'info'
    //Suggestiosn from https://discuss.newrelic.com/t/using-newrelic-with-sails-js/3338
    level : 'info',
    rules: {
      ignore: ['^/socket.io/*/polling']
    }
  }
}
