var cfg = require('./knex-config');
    knex = require('knex')(cfg);

//czysci terminal (funkcja clear)
process.stdout.write("\033c");

//wypisuje treść kwerendy sqlowej toSQL() daje więcej info
var query = knex.select('title', 'rating').from('book');
console.log(query.toString());

//wykonuje zapytanie
query.asCallback(function (err, result) {
    if (err) {
        console.log(err);
        knex.destroy();

    } else {
        console.log(result);
        knex.destroy();
    }
}).then(function(){
    console.log('\n druga: \n');
});

//kwerenda jest wielokrotnego użytku
//dopuszczalne są promisy i callbacki
query.asCallback()
    .then(function(result){
        console.log(result);
    })
    .catch(function(err){
    console.log(err);
}).finally(function(){
        knex.destroy();
        console.log('\nfinally');
    });


console.log("Done. ");