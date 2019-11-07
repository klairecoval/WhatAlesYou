const models = require('../models');

const Beer = models.Beer;

const makerPage = (req, res) => {
  Beer.BeerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ errpr: 'An error occurred.' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), beers: docs });
  });
};

const makeBeer = (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Name, age, and height are all required' });
  }

  const beerData = {
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
    owner: req.session.account._id,
  };

  const newBeer = new Beer.BeerModel(beerData);
  const beerPromise = newBeer.save();

  beerPromise.then(() => {
    res.json({ redirect: '/maker' });
  });

  beerPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Beer already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return beerPromise;
};

const getBeers = (request, response) => {
  const req = request;
  const res = response;

  return Beer.BeerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ beers: docs });
  });
};

const deleteBeer = (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'RAWR! Beer name required to delete' });
  }

  return Beer.BeerModel.deleteById(req.body.id, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'An error ocurred' });
    }

    return res.status(200).json({ msg: 'Beer deleted successfully' });
  });
};

module.exports.make = makeBeer;
module.exports.getBeers = getBeers;
module.exports.makerPage = makerPage;
module.exports.deleteBeer = deleteBeer;
