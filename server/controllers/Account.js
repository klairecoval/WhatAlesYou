const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

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

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // force case to strings to cover security flaws
  // const userName = `${req.body.userName}`;
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

// upgrade user's account to the paid, no-adds version with 'increased logger size'
const upgradeAccount = (req, res) => {
  const request = req;
  const response = res;

  const search = {
    username: `${request.session.account.username}`,
  };

  return Account.AccountModel.update(search, { $set: { upgraded: true } }, {}, (err) => {
    if (err) {
      return response.status(500).json({ error: 'Unable to upgrade account.' });
    }

    request.session.account.upgraded = true;
    return response.status(200).json({ message: 'Account upgraded successfully!' });
  });
};

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
  login,
  logout,
  signup,
  changePassword,
  upgradeAccount,
  getToken,
};
