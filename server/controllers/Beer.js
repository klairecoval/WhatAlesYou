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
  if (!req.body.name || !req.body.brewer || !req.body.type || !req.body.abv || !req.body.ibu || !req.body.notes) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const beerData = {
    name: req.body.name,
    brewer: req.body.brewer,
    type: req.body.type,
    abv: req.body.abv,
    ibu: req.body.ibu,
    notes: req.body.notes,
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
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.json({ beers: docs });
  });
};

const deleteBeer = (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'Beer id is required to delete.' });
  }

  return Beer.BeerModel.deleteById(req.body.id, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'An error ocurred.' });
    }

    return res.status(200).json({ msg: 'Beer deleted successfully.' });
  });
};

const getPairs = (req, res) => {
  res.json([
    {beer: 'Light Lager', food: 'wings, fries, and fish.'},
    {beer: 'Wheat Beer', food: 'salads, fruit, pastries, and noodles.'}
    {beer: 'IPA', food: 'steak, ribs, fries, and burritos.'},
    {beer: 'Amber Ales', food: 'pulled pork, brisket, and pizza.'},
    {beer: 'Dark Lager', food: 'pizza, burgers, and sausage.'},
    {beer: 'Brown Ale', food: 'sausage and sushi.'},
    {beer: 'Porter', food: 'shellfish, barbecue, and game meets (rabbit, venison).'},
    {beer: 'Stout', food: 'chocolate, lobster, barbecue, and shellfish.'},
  ]);
};

module.exports = {
  make: makeBeer,
  getBeers,
  makerPage,
  deleteBeer,
  getPairs,
};
