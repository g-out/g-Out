
const hbs = require('hbs');

hbs.registerHelper('hasCategory', (local, category, options) => {
 if (local  === category) {
   return options.fn(this)
 } else {
   return options.inverse(this)
 }
})