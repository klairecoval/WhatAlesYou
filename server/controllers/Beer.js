const models = require('../models');

const Beer = models.Beer;

const makerPage = (req, res) => {
  Beer.BeerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), beers: docs });
  });
};

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
    { beer: 'Light Lager', food: 'wings, fries, and fish.' },
    { beer: 'Wheat Beer', food: 'salads, fruit, pastries, and noodles.' },
    { beer: 'IPA', food: 'steak, ribs, fries, and burritos.' },
    { beer: 'Amber Ales', food: 'pulled pork, brisket, and pizza.' },
    { beer: 'Dark Lager', food: 'pizza, burgers, and sausage.' },
    { beer: 'Brown Ale', food: 'sausage and sushi.' },
    { beer: 'Porter', food: 'shellfish, barbecue, and game meets (rabbit, venison).' },
    { beer: 'Stout', food: 'chocolate, lobster, barbecue, and shellfish.' },
  ]);
};

const getRecipes = (req, res) => {
  res.json([
    { name: 'Beer Dip', image: 'https://www.tasteofhome.com/wp-content/uploads/2018/06/Beer-Dip_EXPS_THSO18_33049_D01_25_8b-696x696.jpg', description: 'Ranch dressing and shredded cheese form dip, paired best with pretzles', link: 'https://www.tasteofhome.com/recipes/beer-dip/' },
    { name: 'Beer Can Chicken', image: 'https://www.tasteofhome.com/wp-content/uploads/2018/06/shutterstock_438406987-1200x675.jpg', description: 'Keep chicken moist by teaming it in beer while on the grill', link: 'https://www.tasteofhome.com/article/beer-can-chicken/' },
    { name: 'Potato-Beer-Cheese Soup', image: 'https://www.tasteofhome.com/wp-content/uploads/2018/01/Potato-Beer-Cheese-Soup_EXPS_SBZ19_71598_B09_14_1b-696x696.jpg', description: 'This potato soup has a comforting velvety texture to warm your soul on could nights', link: 'https://www.tasteofhome.com/recipes/potato-beer-cheese-soup/' },
    { name: 'Fish and Chips with Mushy Peas', image: 'https://assets.bonappetit.com/photos/57acf290f1c801a1038bc934/16:9/w_5120,c_limit/fish-and-chips-with-minty-mushy-peas.jpg', description: 'Fry once to cook through. Fry twice to crisp the outside', link: 'https://www.bonappetit.com/recipe/fish-and-chips-with-minty-mushy-peas' },
    { name: 'Beer Battered Onion Rings', image: 'https://media.foodnetwork.ca/recipetracker/90cfe932-9edb-441c-9377-0e1662c5bd9f_beer-battered-onion-rings_WebReady.jpg', description: 'Onion rings deliver big crunch and rich onion flavor', link: 'https://www.foodnetwork.ca/recipe/beer-battered-onion-rings/18695/' },
  ]);
};

module.exports = {
  make: makeBeer,
  getBeers,
  getRecipes,
  makerPage,
  deleteBeer,
  getPairs,
};
