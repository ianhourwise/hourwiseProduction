/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  //layoutSelection policy is a potential strategy to handle smart asset loading...need to investigate
  '*': ['passport', 'sessionAuth', 'flash', 'layoutSelection'],
  'auth': {
    '*': ['passport']
  },

  '/': true,
  'static': true,
  
  'touch': {
    inboundSMS: true,
    sendEmail: 'isConcierge',
    outboundSMS: 'isConcierge'
  },

  'job': {
    index: true
  },

  'user': {
    admin: 'isSuperUser',
    welcome: true,
    onboardDump: true
  },

  'task': {
    zendeskTrigger: true,
    subscribeToTasks: true,
    subscribe: true
  },

  'company': {
    profile: 'isCompanyOwner'
  }
  
};
