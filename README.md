io.session
------
Session middleware for socket.io

### usage:
```js
const session   = require('express-session');
const iosession = require('io.session');

const options   = {
  name:   'cookie name',
  secret: 'cookie secret',
  store:   new session.MemoryStore(),
};

app.use(session(options));
io.use(iosession(options));

app.use('*', (req, res, next) => {
  req.session = { waff: 666 };
  next();
});

io.on('connection', socket => {
  console.log(socket.session);
});
```
