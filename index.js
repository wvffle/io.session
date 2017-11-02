const parser  = require('cookie-parser');
const cookie  = require('cookie');

module.exports = options => {
  const { name, secret, store } = options;

  return (socket, next) => {
    try {
      const data = socket.handshake || socket.request;

      if (!data.headers.cookie) {
        return next(new Error('Missing cookie headers'));
      }

      const jar = cookie.parse(data.headers.cookie);

      if (!jar[name]) {
        return next(new Error('Missing cookie header'));
      }

      const sessid = parser.signedCookie(jar[name], secret);

      if (!sessid) {
        console.log('Invalid cookie hash:', jar[name]);
        return next(new Error('Invalid cookie header'));
      }

      store.get(sessid, (err, session) => {
        if (err) {
          console.log(err.stack);
          return next(err);
        }

        if (!session) {
          console.log('No session found for sessid:', sessid);
          return next(new Error('No session found'));
        }

        socket.sessid  = sessid;
        socket.session = session || {};
        socket.session.save = next => {
          store.set(sessid, data.session, next);
        };

        next();
      });

    } catch (err) {
      console.error(err.stack);
      next(new Error('Internal server error'));
    }
  };
}
