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
}).then(function () {
    console.log('\n druga: \n');
});

//kwerenda jest wielokrotnego użytku
//dopuszczalne są promisy i callbacki
query
    .then(function (result) {
        console.log(result);
    })
    .catch(function (err) {
        console.log(err);
    }).finally(function () {
        knex.destroy();
        console.log('\nfinally');
    });

knex("book")
    .select(["book.author_id", "author.firstname", 'author.lastname'])
    .join("author", "author.id", "=", "book.author_id")
    .groupBy(["author_id", "author.firstname", "author.lastname"])
    .max("rating as score").orderBy('author.firstname', 'DESC')
    .then(function (result) {
        console.log("\n group \n");
        console.log(result);
    })
    .catch(function (err) {
        console.log("\n group \n");
        console.log(err);
    }).finally(function () {
        knex.destroy();
        console.log('\nfinally');
    });

console.log("Done. ");