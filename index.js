/**
 * Function to be called after require!
 * @param {array} roles User roles that have authorization for the view.
 *            If undefined, any role can check the view.
 */

module.exports = function(roles){
  return function(req, res, next) {
    
    /**
     * Default configuration
     */
    var noPermissionRedirect  = '/login';
    var role                  = 'role';

    /**
     * Default configuration is overriden
     */
    if (req.app.get('permission')){
      if (req.app.get('permission').noPermissionRedirect) {
        noPermissionRedirect = req.app.get('permission').noPermissionRedirect;
      }
      if (req.app.get('permission')){
        roleProperty = req.app.get('permission').role;
      }
    }
    

    // checks passport integrated function
    if (req.isAuthenticated()) {
      if (!roles){
        next();
      } else if (roles.indexOf(req.user[role]) > -1){
        next();
      } else {
        res.redirect(noPermissionRedirect);
      }
    }
    else {
      res.redirect(noPermissionRedirect);
    }
  }
}