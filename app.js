var cfg = require('./knex-config'),
    knex = require('knex')(cfg),
    Treeize = require('treeize');

//czysci terminal (funkcja clear)
process.stdout.write("\033c");

//wypisuje treść kwerendy sqlowej toSQL() daje więcej info
var query = knex.select('title', 'rating').from('book').where({
    author_id: 1
});
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
//join to tree

knex("book")
    .select(["book.author_id as book:author_id", "book.title as book:title", "book.rating as book:rating", "author.firstname as author:firstname", 'author.lastname as author:lastname'])
    .join("author", "author.id", "=", "book.author_id")
    .then(function(result){
        var tree = new Treeize();
        tree.grow(result);
        return tree.getData();
    })
    .then(function (result) {
        console.log("\n tree \n");
        console.log(result);
    })
    .catch(function (err) {
        console.log("\n tree \n");
        console.log(err);
    }).finally(function () {
        knex.destroy();
    });


//dodana bezsensowna transakcja
knex.transaction(function (trx) {
    trx.insert({firstname: "Anna", lastname: "Hanna"}).into("author")
        .then(function (result) {
            console.log('transakcja');
            console.log(result);
            return result;
        }).then(function(){
            return trx.from("author").where({firstname: "Anna"}).del()
            //edycja analogicznie
        }).then(trx.commit)
        .catch(trx.rollback);
});


console.log("Done. ");