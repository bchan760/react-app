const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');


const users = { 
   users_list :
   [
      { 
         id : 'xyz789',
         name : 'Charlie',
         job: 'Janitor',
      },
      {
         id : 'abc123', 
         name: 'Mac',
         job: 'Bouncer',
      },
      {
         id : 'ppp222', 
         name: 'Mac',
         job: 'Professor',
      }, 
      {
         id: 'yat999', 
         name: 'Dee',
         job: 'Aspring actress',
      },
      {
         id: 'zap555', 
         name: 'Dennis',
         job: 'Bartender',
      }
   ]
}
 
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
   res.send('Hello World!');
});

app.get('/users', (req, res) => {
   const name = req.query.name;
   const job = req.query.job;
   if (name !== undefined && job !== undefined){
      let result = findUserByNameAndJob(name, job);
      result = {users_list: result};
      res.send(result);
   }
   else if (name !== undefined){
      let result = findUserByName(name);
      result = {users_list: result};
      res.send(result);
   }
   else{
      res.send(users);
   }
});

const findUserByName = (name) => { 
   return users['users_list'].filter( (user) => user['name'] === name); 
}

const findUserByNameAndJob = (name, job) => { 
   return users['users_list'].filter( (user) => user['name'] === name && user['job'] === job); 
}

app.get('/users/:id', (req, res) => {
   const id = req.params['id']; //or req.params.id
   let result = findUserById(id);
   if (result === undefined || result.length == 0)
      res.status(404).send('Resource not found.');
   else {
      result = {users_list: result};
      res.send(result);
   }
});

function findUserById(id) {
   return users['users_list'].find( (user) => user['id'] === id); // or line below
   //return users['users_list'].filter( (user) => user['id'] === id);
}

app.post('/users', (req, res) => {
   const userToAdd = req.body;
   addUser(userToAdd, res);
   res.status(201).end(); //#1 implemented 201 http code
});

function addUser(user, res){ // #2 modified to generate id for new user object
   const id = generateId(); // generate random ID
   const userWithId = {...user, id}; // add ID to user object
   users['users_list'].push(userWithId); // push user object to users_list
   res.status(201).send(users); // #3 send the new user object 
}

app.delete('/users/:id', (req, res) => {
   const id = req.params['id'];
   let result = findUserById(id);
   if (result === undefined || result.length == 0)
      res.status(404).send('Resource not found.');
   else {
      result = {users_list: result};
      res.status(204).end();
   }
});

function findUserIndexById(id) {
   return users['users_list'].findIndex( (user) => user['id'] === id); // or line below
   //return users['users_list'].filter( (user) => user['id'] === id);
}

function generateId() {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
   const numbers = '0123456789';
   let id = '';

   for (let i = 0; i < 3; i++) { // Generate 5 random characters
     id += characters.charAt(Math.floor(Math.random() * characters.length));
   }

   for (let i = 0; i < 3; i++) { // Generate 3 random numbers
     id += numbers.charAt(Math.floor(Math.random() * numbers.length));
   }
   return id;
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});