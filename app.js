const express = require('express');
const {connectToDb, getDb} = require('./db');
const { ObjectId } = require('mongodb');

// init app & middleware
const app = express();
app.use(express.json());//use json request in routes
//db connection
let db; 
connectToDb((err)=>{
  if(!err){
    app.listen(3000, () => {
      console.log("database connection successfull");
    })
    db = getDb();
  }else{
    console.log(err);
  }
})

// routes
app.get('/books', (req, res) => {
  // res.json({msg: "welcome to the api"});

  //fetch parameters from url : books/?p=0
  const page = req.query.p || 0;
  const booksPerPage = 1;

  let books = [];
  // db.collection('books')
  // .find()
  // .sort({author: 1})
  // .forEach((book)=>{
  //   books.push(book);
  // }).then(()=>{
  //   res.status(200).json(books);
  // }).catch(()=>{
  //   res.status(500).json({error: 'Could Not Fetch the Documents'});
  // });

  //limiting result and sending it in sets
  db.collection('books')
  .find()
  .sort({author: 1})
  .skip(page * booksPerPage)
  .limit(booksPerPage)
  .forEach((book)=>{
    books.push(book);
  }).then(()=>{
    res.status(200).json(books);
  }).catch(()=>{
    res.status(500).json({error: 'Could Not Fetch the Documents'});
  });
  /* 
  find method does not  return all the data to us
  what it does is, it creates a cursor that points to that data.
  to fetch the data we can use ToArray or forEach.
  */
})
//fetch through id
app.get('/books/:id', (req,res)=>{
  //check id is valid
  if(ObjectId.isValid(req.params.id)){
    const id = req.params.id;
    db.collection('books')
    .findOne({_id: ObjectId(id)})
    .then((doc)=>{
      res.status(200).json(doc);
    }).catch(()=>{
      res.status(500).json("could not found");
    });
  }else{
    res.status(500).json({error: "Wrong Id"});
  }
  // if the document does not exist but id is valid then it sends null
})
// to insert in daatabase
app.post('/books', (req,res)=>{
  const book = req.body;
  db.collection('books')
  .insertOne(book)
  .then(result => res.status(201).json(result))
  .catch(err=> res.status(500).json({error: "Could not add"}));
});
// to delete
app.delete('/books/:id',(req,res)=>{
  const id = req.params.id;
  if(ObjectId.isValid(id)){
    db.collection('books')
    .deleteOne({_id: ObjectId(id)})
    .then((result)=>{
      res.status(200).json(result);
    }).catch(()=>{
      res.status(500).json("could not delete");
    });
  }else{
    res.status(500).json({error: "Wrong Id"});
  }
})
//to update
app.patch('/books/:id', (req,res)=>{
  const id = req.params.id;
  const book = req.body;

  if(ObjectId.isValid(id)){
    db.collection('books')
    .updateOne(
      {_id: ObjectId(id)},
      {$set: book}
      )
    .then((result)=>{
      res.status(200).json(result);
    }).catch(()=>{
      res.status(500).json("could not update document");
    });
  }else{
    res.status(500).json({error: "Wrong Id"});
  }
})