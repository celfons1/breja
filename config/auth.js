// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '830618807064085', // your App ID
        'clientSecret'    : '8f023e9d093c40f9291c8afaf4debde8', // your App Secret
        'callbackURL'     : 'http://127.0.0.1:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'        : 'your-consumer-key-here',
        'consumerSecret'     : 'your-client-secret-here',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'         : '642630082137-q7etvn2skhkg3bibc824kuvev6432hag.apps.googleusercontent.com',
        'clientSecret'     : 'T672YZeiiwhSybMLP1tbNS93',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};