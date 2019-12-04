const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let BeerModel = {};

// mongoose.types.objectid converts string id to mongo id
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const BeerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  brewer: {
    type: String,
    required: true,
    trim: true,
  },

  type: {
    type: String,
    required: true,
    trim: true,
  },

  abv: {
    type: Number,
    required: true,
  },

  ibu: {
    type: Number,
    required: true,
  },

  notes: {
    type: String,
    required: true,
    trim: true,
  },

  rating: {
    type: Number,
    required: true,
    default: 1,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

// send beer info to api
BeerSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  brewer: doc.brewer,
  type: doc.type,
  abv: doc.abv,
  ibu: doc.ibu,
  notes: doc.notes,
  rating: doc.rating,
});

// find owner beers
BeerSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return BeerModel.find(search).select('name brewer type abv ibu notes rating').exec(callback);
};

// search beers
// eslint-disable-next-line
BeerSchema.statics.findBeer = (beerName, callback) => BeerModel.find(beerName).select('name brewer type abv ibu notes rating').exec(callback);

// delete beer by id that is hidden
BeerSchema.statics.deleteById = (id, callback) => {
  const search = {
    _id: convertId(id),
  };

  return BeerModel.findOneAndRemove(search).exec(callback);
};

BeerModel = mongoose.model('Beer', BeerSchema);

module.exports = {
  BeerModel,
  BeerSchema,
};
