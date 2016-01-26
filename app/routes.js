module.exports = function(app, passport) {

    
   app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.html');
    });

    app.get('/gps', function(req, res) {
        res.render('gps.html');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.html', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.send('exit.html');
    });

    app.get('/brejas', function(req, res) {
        res.render('brejas.html');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form

        // process the login form
        app.post('/login', function(req, res, next) {
          passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
              // *** Display message using Express 3 locals
              req.session.message = info.message;
              return res.send('index.html');
            }
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              return res.send('brejas.html');
            });
          })(req, res, next);
        });

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.send('signup.html');
        });

        // process the signup form
        app.post('/signup', function(req, res, next) {
          passport.authenticate('local-signup', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
              // *** Display message using Express 3 locals
              req.session.message = info.message;
              return res.send('signup.html');
            }
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              return res.send('brejas.html');
            });
          })(req, res, next);
        });

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/brejas',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/brejas',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/brejas',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.html', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/brejas', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/brejas',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/brejas',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/brejas',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


// CRUD routes ===============================================================

    var mongoose = require('mongoose');
    var breja = require('./models/breja');

     
    // ROTA BUSCAR ============================================
   app.get('/principal', function(req, res) {
        // utilizaremos o mongoose para buscar todos as principal no BD
        breja.find(function(err, principal) {
            // Em caso de erros, envia o erro na resposta
            if (err)
                res.send(err)
            // Retorna todos as principal encontrados no BD
            res.json(principal); 
        });
    });
     
    // ROTA CRIAR =============================================
    app.post('/principal', function(req, res) {
        // Cria um breja, as informações são enviadas por uma requisição AJAX pelo Angular
        breja.create({
            loja : req.body.loja,
            produto : req.body.produto,
            preco : req.body.preco,
            done : false
        }, function(err, breja) {
            if (err)
                res.send(err);
            // Busca novamente todos os principal após termos inserido um novo registro
            breja.find(function(err, principal) {
                if (err)
                    res.send(err)
                res.json(principal);
            });
        });
     
    });
     
    // ROTA DELETAR ============================================
    app.delete('/principal/:breja_id', function(req, res) {
        // Remove o breja no Model pelo parâmetro _id
        breja.remove({
            _id : req.params.breja_id
        }, function(err, breja) {
            if (err)
                res.send(err);
            // Busca novamente todos os principal após termos removido o registro
            breja.find(function(err, principal) {
                if (err)
                    res.send(err)
                res.json(principal);
            });
        });
    });
     
    // ROTA EDITAR =============================================
    app.get('/principal/:breja_id', function(req, res) {
        // Busca o breja no Model pelo parâmetro id
        breja.findOne({
            _id : req.params.breja_id
        }, function(err, breja) {
            if (err)
                res.send(err);
            res.json(breja);
        });
    });
     
    // ROTA ATUALIZAR ==========================================
    app.put('/principal/:breja_id', function(req, res) {
        // Busca o breja no Model pelo parâmetro id
        var brejaData = req.body;
        var id = req.params.breja_id;
     
        breja.update( 
            {_id: id }, 
            brejaData, 
            { upsert: true}, 
            function(err, breja) {
                if (err) res.send(err);
                res.json(breja);
        });
        
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}