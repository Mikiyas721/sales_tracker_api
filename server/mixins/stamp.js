module.exports = function(Model, bootOptions) {
  const options = Object.assign({
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    required: false,
    validateUpsert: false, // default to turning validation off
    silenceWarnings: false,
    index: false,
  }, bootOptions);

  Model.defineProperty(options.createdAt, {
    type: Date,
    required: options.required,
    defaultFn: 'now',
    index: options.index,
  });

  Model.defineProperty(options.updatedAt, {
    type: Date,
    required: options.required,
    index: options.index,
  });

  Model.observe('before save', (ctx, next) => {
    if (ctx.options && ctx.options.skipUpdatedAt) {
      return next();
    }
    if (ctx.instance) {
      ctx.instance[options.updatedAt] = new Date();
    } else {
      ctx.data[options.updatedAt] = new Date();
    }
    return next();
  });
};
