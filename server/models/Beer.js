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

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  height: {
    type: Number,
    min: 0,
    required: true,
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

BeerSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  height: doc.height,
});

BeerSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return BeerModel.find(search).select('name age height').exec(callback);
};

BeerSchema.statics.deleteById = (id, callback) => {
  const search = {
    _id: convertId(id),
  };

  return BeerModel.findOneAndRemove(search).exec(callback);
};

BeerModel = mongoose.model('Beer', BeerSchema);

module.exports.BeerModel = BeerModel;
module.exports.BeerSchema = BeerSchema;
