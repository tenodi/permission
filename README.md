Permission is [Express](http://expressjs.com/) & [Passport](http://passportjs.org/)-compatible authorization
middleware for [Node.js](http://nodejs.org/). It provides customizable management of access control list (ACL).

## Install

    $ npm install --save permission


## Usage

#### Fast start
It is as simple as `require('permission')`, because you do want to _require permission_, don't you? Don't mess your model nor view with control-specific logic. Pass middleware determing which roles user needs to have!
``` js
router.get('/', require('permission')(['admin']), function(req, res) {
    res.render('stats');
})
```

Pass an array determining which roles one controller supports. 
Pass an empty array to ensure nobody has access, even when authenticated. 
Leave empty if you want to allow any role to be authorized, but still to be authenticated (signed in).

``` js
router.get('/', require('permission')(), function(req, res) {
    res.render('profile');
})
```

Fill out array with more roles, if needed.
``` js
router.get('/', require('permission')(['admin', 'user']), function(req, res) {
    res.render('schools');
})
```

#### Advantage start
There are _permission_ options some of which you'll most likely want to customize. You can do so by setting _permission_ name in Express' _app_ object:
``` js
app.set('permission', {role: 'myRole'});
```
It is optional to customize any option, but when done so, customized option needs to follow its interface. 
Here you can find listed all the properties that you may customize:

**role**
Defines property name for Express' user. Defaults to ```role```.

**notAuthenticated**
Defines what to do with non-authenticated user. Both ```notAuthenticated``` and ```notAuthorized``` (see below) implement the same interface. This interface consists of 4 properties:

- ```flashType``` {string}: type of the [Flash](https://www.npmjs.com/package/connect-flash) message
- ```message``` {string}: flash message
- ```redirect``` {string}: URL or path for [Express](https://www.npmjs.com/package/express) redirection
- ```status``` {number}: HTTP status for response

Not all the properties are needed to be present at the same time. See [control flow](https://www.npmjs.com/package/permission#control-flow) for more information.

Only ```status``` property of ```notAuthenticated``` is set by default to value ```401```.

**notAuthorized**
Defines what to do with non-authorized user. Shares the same interface with ```notAuthenticated```. 
Only ```status``` property of ```notAuthorized``` is set by default to value ```403```.

**after**
Defines custom callback function to be called upon determining the state of user authentication/authorization. This is the function's skeleton:

``` js
function(req, res, next, authorizedStatus){}
```
Arguments ```req```, ```res``` and ```next``` are Express objects, while ```authorizedStatus``` refers to one of the following values:

- ```authorized``` : user has been successfully authorized
- ```notAuthenticated``` : user has failed to authenticate.
- ```notAuthorized``` : user has been successfully authenticated, but failed to authorize.

This allows you to organise logic based on authorized status of the user.
You can access these constants with:
``` js
var p = require('permission')
p.AUTHORIZED === 'authorized' // true
p.NOT_AUTHENTICATED === 'notAuthenticated' // true
p.NOT_AUTHORIZED === 'notAuthorized' // true
```

#### Control flow
It is noted that you don't need to customize any _permission_ option. But, if you want to, not all of them are needed. This section explains the control flow:

After _permission_ has determined user's authorized status, it:

1. calls ```after``` and passes it ```authorizedStatus```
2. if ```after``` is not provided, calls Express ```res.redirect()``` with ```redirect``` value and sets Flash message
3. if ```redirect``` of specific state is not provided, calls Express ```res.status()``` with ```status```.

#### Example
This example shows how _permission_ options can be used: we want to redirect user with message if he fails to authenticate and send ```HTTP status 403``` if he fails to authorize.
``` js
var notAuthenticated = {
	flashType: 'error',
	message: 'The entered credentials are incorrect',
	redirect: '/login'
};

app.set('permission', {
	role: 'userRole',
	notAuthenticated: notAuthenticated 
});
```
Not that we used defaults ```HTTP status``` for authorization fail. 


## Contribution
If you want to suggest something, make a pull request or contribute in any other form, you're welcome to do so @ GitHub's [repository](https://github.com/ttenodi/permission).