const jison = require('jison');
const Parser = require("jison").Parser;

module.exports = {
  compile: function compile(text, callback) {
    try {
      const parser = new Parser(text);
      callback(null, parser);
    } catch(err) {
      callback(err);
    }
  }
};
