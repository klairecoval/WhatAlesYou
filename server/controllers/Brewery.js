const models = require('../models');

const Brewery = models.Brewery;

// create main brewery page
// pass in csrf token
const breweryPage = (req, res) => {
  Brewery.BreweryModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    return res.render('breweries', { csrfToken: req.csrfToken(), breweries: docs });
  });
};

// make a new brewery
// check for all field values
const makeBrewery = (req, res) => {
  if (!req.body.name || !req.body.address ||
    !req.body.link || !req.body.notes) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const breweryData = {
    name: req.body.name,
    address: req.body.address,
    link: req.body.link,
    notes: req.body.notes,
    rating: req.body.rating,
    owner: req.session.account._id,
  };

  const newBrewery = new Brewery.BreweryModel(breweryData);
  const breweryPromise = newBrewery.save();

  breweryPromise.then(() => {
    res.json({ redirect: '/breweries' });
  });

  breweryPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Brewery already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return breweryPromise;
};

// load breweries from server
const getBreweries = (request, response) => {
  const req = request;
  const res = response;

  return Brewery.BreweryModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.json({ breweries: docs });
  });
};

// remove logged brewery by id
const deleteBrewery = (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'Brewery id is required to delete.' });
  }

  return Brewery.BreweryModel.deleteById(req.body.id, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'An error ocurred.' });
    }

    return res.status(200).json({ msg: 'Brewery deleted successfully.' });
  });
};

// search for a brewery by name
const searchBrewery = (req, res) => {
  if (!req.query.search) {
    return res.status(400).json({ error: 'Name of brewery is required' });
  }

  const searchedBrewery = {
    name: req.query.search,
  };

  return Brewery.BreweryModel.findBrewery(searchedBrewery, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    return res.json({ breweries: doc });
  });
};

module.exports = {
  make: makeBrewery,
  getBreweries,
  breweryPage,
  deleteBrewery,
  searchBrewery,
};
