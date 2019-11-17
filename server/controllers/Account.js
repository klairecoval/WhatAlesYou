const models = require('../models');

const Account = models.Account;

// render login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// render custom 404 page
const notFoundPage = (req, res) => {
  res.render('notFound', { csrfToken: req.csrfToken() });
};

// logout, delete session, redirect to login page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// login user
// check for all fields filled out
// check for values that match existing accounts
// redirect once successful to main maker page
const login = (request, response) => {
  const req = request;
  const res = response;

  // force case to strings to cover security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// handle new user signup
// check for VALID values in all fields
// create a new user and redirect to main maker page
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to a string to cover some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occurred.' });
    });
  });
};

// change user password
// check for data in all fields
// update password and redirect 
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // force case to strings to cover security flaws
  const currentPass = `${req.body.currPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!currentPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields required.' });
  }

  return Account.AccountModel.authenticate(`${req.session.account.username}`, currentPass,
    (err, pass) => {
      if (err || !pass) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }

      return Account.AccountModel.generateHash(newPass, (salt, hash) => {
        const searchUser = {
          username: `${req.session.account.username}`,
        };

        Account.AccountModel.update(searchUser, { $set: { password: hash, salt } }, {}, (error) => {
          if (error) {
            return res.status(500).json({ error: 'Unable to update password.' });
          }

          return res.status(200).json({ redirect: '/maker' });
        });
      });
    }
  );
};

// get CSRF token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports = {
  loginPage,
  notFoundPage,
  login,
  logout,
  signup,
  changePassword,
  getToken,
};
