const models = require('../models');

const Beer = models.Beer;
const recsList = [];

// create maker page
// pass in csrf token
const makerPage = (req, res) => {
  Beer.BeerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), beers: docs });
  });
};

// make a new beer
// check for all field values
const makeBeer = (req, res) => {
  if (!req.body.name || !req.body.brewer ||
    !req.body.type || !req.body.abv ||
    !req.body.ibu || !req.body.notes) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const beerData = {
    name: req.body.name,
    brewer: req.body.brewer,
    type: req.body.type,
    abv: req.body.abv,
    ibu: req.body.ibu,
    notes: req.body.notes,
    rating: req.body.rating,
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

    return res.status(400).json({ error: 'An error occurred' });
  });

  return beerPromise;
};

// load beers from server
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

// remove beer
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

// search for a beer
const searchBeer = (req, res) => {
  console.log(req.query.search);
  if (!req.query.search) {
    return res.status(400).json({ error: 'Name of beer is required' });
  }

  const searchedBeer = {
    name: req.query.search,
  };

  console.log(searchedBeer);
  return Beer.BeerModel.findBeer(searchedBeer, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    console.log(doc);
    return res.json({ beers: doc });
  });
};

const getRecs = (req, res) => Beer.BeerModel.findByBool(req, (err) => {
  if (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error ocurred.' });
  }

  return res.status(200).json({ beers: recsList });
});

// create pairings to be loaded
const getPairs = (req, res) => {
  res.json([
    { beer: 'Amber Ales',
      image: '/assets/img/ale.png',
      about: 'Amber ale is a pale ale brewed with amber malt to produce an amber color.',
      food: 'pulled pork, brisket, and pizza.' },
    { beer: 'Brown Ales',
      image: '/assets/img/ale.png',
      about: 'Brown ale is usually lightly hopped and brewed from 100% brown malt',
      food: 'sausage and sushi.' },
    { beer: 'Dark Lagers',
      image: '/assets/img/pilsner.png',
      about: 'Dark beers are characterized by their smooth malty flavor.',
      food: 'pizza, burgers, and sausage.' },
    { beer: 'IPAs',
      image: '/assets/img/ale.png',
      about: 'India pale ale is a hoppy beer style within the broader category of pale ale.',
      food: 'steak, ribs, fries, and burritos.' },
    { beer: 'Light Lagers',
      image: '/assets/img/pilsner.png',
      about: 'Light lager is lower in alcohol but lower in calories and carbohydrates.',
      food: 'wings, fries, and fish.' },
    { beer: 'Porters',
      image: '/assets/img/ale.png',
      about: 'Porter is a dark style of beer made from brown malt.',
      food: 'shellfish, barbecue, and game meets.' },
    { beer: 'Stouts',
      image: '/assets/img/ale.png',
      about: 'Stout is a dark, top-fermented beer.',
      food: 'chocolate, lobster, barbecue, and shellfish.' },
    { beer: 'Wheat Beers',
      image: '/assets/img/weizen.png',
      about: 'Wheat beer is a top-fermented beer that is brewed with more wheat than barley.',
      food: 'salads, fruit, and pastries.' },
  ]);
};

// create recipes to be loaded
const getRecipes = (req, res) => {
  res.json([
    { name: 'Beer Dip',
      image: '/assets/img/dip.png',
      description: 'Ranch dressing and shredded cheese form dip, paired best with pretzels.',
      link: 'https://www.tasteofhome.com/recipes/beer-dip/' },
    { name: 'Beer Can Chicken',
      image: '/assets/img/chicken.png',
      description: 'Keep chicken moist by teaming it in beer while on the grill.',
      link: 'https://www.tasteofhome.com/article/beer-can-chicken/' },
    { name: 'Potato-Beer-Cheese Soup',
      image: '/assets/img/soup.png',
      description: 'Warm your soul with a velvety soup with notes of beer and cheese.',
      link: 'https://www.tasteofhome.com/recipes/potato-beer-cheese-soup/' },
    { name: 'Fish and Chips with Mushy Peas',
      image: '/assets/img/fishChips.png',
      description: 'Fry once to cook through. Fry twice to crisp the outside.',
      link: 'https://www.bonappetit.com/recipe/fish-and-chips-with-minty-mushy-peas' },
    { name: 'Beer Battered Onion Rings',
      image: '/assets/img/onionRings.png',
      description: 'Onion rings deliver big crunch and rich onion flavor.',
      link: 'https://www.foodnetwork.ca/recipe/beer-battered-onion-rings/18695/' },
  ]);
};

module.exports = {
  make: makeBeer,
  getBeers,
  getRecipes,
  makerPage,
  deleteBeer,
  searchBeer,
  getPairs,
  getRecs,
};
