const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]
const number = process.argv[4]
//console.log(process.argv[2]) //pass
//console.log(process.argv[3]) //name

const url =
`mongodb+srv://fullstack:${password}@cluster0-78bxv.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number
  //number: parseInt(number), if numbers were pure numbers
})
if (process.argv.length<4) { //Just a query with the password
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(note => {
      console.log(note.name + ' ' + note.number)
    })
    mongoose.connection.close()
  })

} else {
  person.save().then(console.log(`added ${name} number ${number} to phonebook`))
  mongoose.connection.close()
}