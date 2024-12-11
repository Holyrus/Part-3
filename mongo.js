const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}

const password = process.argv[2];

const url = `mongodb+srv://rusonypenko:${password}@cluster0.cryj8.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    id: String,
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    person.save().then(result => {
        console.log(`Added ${process.argv[3]} number ${process.argv[4]} to Phonebook`);
        mongoose.connection.close()
    })

} else if (process.argv.length === 3) {

    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })

}

