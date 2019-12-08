const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let BreweryModel = {};

// mongoose.types.objectid converts string id to mongo id
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const BrewerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  address: {
    type: String,
    required: true,
    trim: true,
  },

  link: {
    type: String,
    required: true,
    trim: true,
  },

  notes: {
    type: String,
    required: true,
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

// send brewery info to api for display
BrewerySchema.statics.toAPI = (doc) => ({
  name: doc.name,
  address: doc.address,
  link: doc.link,
  notes: doc.notes,
  rating: doc.rating,
});

// find all breweries created by account
BrewerySchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return BreweryModel.find(search).select('name address link notes rating').exec(callback);
};

// search for brewery by name
BrewerySchema.statics.findBrewery = (breweryName, callback) => {
  console.log(breweryName);
  BreweryModel.find(breweryName).select('name address link notes rating').exec(callback);
};

// delete brewery by id
BrewerySchema.statics.deleteById = (id, callback) => {
  const search = {
    _id: convertId(id),
  };

  return BreweryModel.findOneAndRemove(search).exec(callback);
};

BreweryModel = mongoose.model('Brewery', BrewerySchema);

module.exports = {
  BreweryModel,
  BrewerySchema,
};
