var bodyParser = require('body-parser');
var boot = require('loopback-boot');
var logger = require('morgan');
var loopback = require('loopback');
var path = require('path');
var satellizer = require('loopback-satellizer');
var HTTP = require('http-status-codes');


var app = module.exports = loopback();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Force SSL in production
if (process.env.NODE_ENV === 'production') {
  app.use(function (req, res, next) {
    if (req.header('x-forwarded-proto') !== 'https'){
      return res.redirect(HTTP.MOVED_PERMANENTLY, path.join(app.get('url').replace('http:/', 'https:/'), req.url));
    }
    next();
  });
}

boot(app, __dirname);

app.use(loopback.static(path.resolve(__dirname, '../public')));

var satellizerConfig = require('./satellizer-config');
satellizer(app, satellizerConfig);


var indexPath = path.resolve(__dirname, '../public/index.html');
app.get('*', function (req, res) {res.sendFile(indexPath); });

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

if (require.main === module) {
  app.start();
}

