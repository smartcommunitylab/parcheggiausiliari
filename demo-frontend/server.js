// Generated by CoffeeScript 1.4.0
(function() {
  var app, connection, count, data, express, getAllData, getLastData, http_server, io, mysql, sys,
    _this = this;

  express = require('express');

  this.io = require('socket.io');

  var entity_id='Room3';

  var bodyParser = require('body-parser');
  var errorHandler = require('error-handler');
  app = module.exports = express();

 
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    //app.use(express.methodOverride());
    app.use(require('stylus').middleware({
      src: __dirname + '/public'
    }));
    //app.use(app.router);
    app.use(express["static"](__dirname + '/public'));
 

 /* if (app.get('env') === 'development') {
      app.use(errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  }

  if (app.get('env') === 'production') {
     app.use(errorHandler());
  }*/

  count = 6;

  data = [];

  sys = require('util');

  mysql = require('mysql');

  connection = mysql.createConnection({
    host: 'localhost',
    user: 'fiware',
    password: 'fiware',
    database: 'fiware'
  });

  connection.connect();

  getBikeData =  function(connection, pcId, callback) {
    var _this = this;
    console.log("querying bike data");
    return connection.query('SELECT m.* from `data-avg-bike` m ORDER BY m.station ASC', [pcId, pcId], function(err, rows, fields) {
      if (err) {
        throw err;
      }
      return callback(rows);
    });
  };

  getLastData = function(connection, pcId, callback) {
    var _this = this;
    console.log("querying for last insert");
    return connection.query('SELECT m.* from `data-pstadio` m where m.receive_timestamp=(select max(m2.receive_timestamp) from `data-pstadio` m2)', [pcId, pcId], function(err, rows, fields) {
      if (err) {
        throw err;
      }
      return callback(rows);
    });
  };

  getAllData = function(connection, pcId, callback) {
    console.log("load  all data");
    return connection.query('SELECT m.* from `data-pstadio` m order by receive_timestamp asc', [pcId], function(err, rows, fields) {
      if (err) {
        throw err;
      }
      return callback(rows);
    });
  };

  this.getAllDataWrapper = function(connection, pcId) {
    return getAllData(connection, pcId, function(result) {
      var item, _i, _len;
      for (_i = 0,lasten =result.length; _i < lasten; _i++) {
        item = result[_i];
        if (typeof io !== "undefined" && io !== null) {
          io.sockets.emit('chart', {
            chartData: item
          });
        }
      }
      return setInterval((function() {
        return _this.getLastDataWrapper(connection, entity_id);
      }), 10000);
    });
  };

  this.getLastDataWrapper = function(connection, pcId) {
    return getLastData(connection, pcId, function(result) {
      var item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = result.length; _i < _len; _i++) {
        item = result[_i];
        //console.log("last "+ JSON.stringify(item));
        _results.push(typeof io !== "undefined" && io !== null ? io.sockets.emit('chart', {
          chartData: item
        }) : void 0);
      }
      return _results;
    });
  };

    this.getBikeDataWrapper = function(connection, pcId) {
    return getBikeData(connection, pcId, function(result) {
      var item, _i, _len;
      item = [];

      for (_i = 0,lasten =result.length; _i < lasten; _i++) {
        item.push(result[_i].avg);
        }
        console.log("Bike "+ JSON.stringify(item) +" " +result.length);
        if (typeof io !== "undefined" && io !== null) {
          io.sockets.emit('bike-chart', {
            chartData: item
          });
      }
      return setInterval((function() {
        return  _this.getBikeDataWrapper(connection, entity_id);
      }), 20000);
    });
  };

  if (!module.parent) {
    http_server = app.listen(3000);
    io = this.io.listen(http_server);
    console.log("Express server listening on port %d", 3000);
  }

  io.sockets.on('connection', function(socket) {
    var mys;
    mys = mysql.createConnection({
      host: 'localhost',
      user: 'fiware',
      password: 'fiware',
      database: 'fiware'
    });
    mys.connect();
    _this.getAllDataWrapper(mys, entity_id);
    _this.getBikeDataWrapper(mys, entity_id);
    return socket.on('disconnect', function() {});
  });

  app.get('/', function(req, res) {
    return res.render('index', {
      title: 'Dashboard'
    });
  });

}).call(this);
