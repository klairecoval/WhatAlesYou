const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getBeers', mid.requiresLogin, controllers.Beer.getBeers);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Beer.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Beer.make);
  app.delete('/deleteBeer', mid.requiresLogin, controllers.Beer.deleteBeer);
  app.post('/upgrade', mid.requiresSecure, mid.requiresLogin, controllers.Account.upgradeAccount);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
  app.post('/pairings', mid.requiresSecure, mid.requiresLogin);
  app.get('/getPairs', controllers.Beer.getPairs);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
