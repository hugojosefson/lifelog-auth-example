var express = require('express');
var request = require('request');
var app = express();

var PORT = process.env.PORT || 3000;

var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('CLIENT_ID and CLIENT_SECRET must be set.');
}

var LOCALTUNNEL_SUBDOMAIN = process.env.LOCALTUNNEL_SUBDOMAIN;
var BASE_URI = process.env.BASE_URL || LOCALTUNNEL_SUBDOMAIN ? 'https://' + LOCALTUNNEL_SUBDOMAIN + '.localtunnel.me' : undefined;

if (!BASE_URI || BASE_URI.substring(0, 8) !== 'https://') {
    throw new Error("Must set BASE_URI in env to your server's https url (or use localtunnel and set LOCALTUNNEL_SUBDOMAIN).");
}

var CALLBACK_URI = BASE_URI + '/callback';

console.log('=================================================================');
console.log('| CONFIG                                                        |');
console.log('+---------------------------------------------------------------+');
console.log('| PORT:          ' + PORT);
console.log('| BASE_URI:      ' + BASE_URI);
console.log('|');
console.log('| CLIENT_ID:     ' + CLIENT_ID);
console.log('| CLIENT_SECRET: ' + CLIENT_SECRET);
console.log('| CALLBACK_URI:  ' + CALLBACK_URI);
console.log('=================================================================');

var oauth2 = require('simple-oauth2')({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    useBasicAuthorizationHeader: false,
    site: 'https://platform.lifelog.sonymobile.com/oauth/2',
    tokenPath: '/token',
    authorizationPath: '/authorize'
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: CALLBACK_URI,
    scope: 'lifelog.profile.read lifelog.activities.read lifelog.locations.read',
    state: 'XXXXXXXX'
});

// Initial page redirecting to Lifelog
app.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', function (req, res) {
    var code = req.query.code;
    console.log('/callback');
    oauth2.authCode.getToken({
            code: code,
            redirect_uri: CALLBACK_URI
        }, function (error, result) {
            if (error) {
                console.error('Error fetching access token:', error);
                res.status(500).send(error);
            } else {
                var tokenResponse = oauth2.accessToken.create(result);
                var accessToken = tokenResponse && tokenResponse.token && tokenResponse.token.access_token;
                if (!accessToken) {
                    console.error('No access token found in response:', tokenResponse);
                    res.status(500, 'No access token found in response');
                } else {
                    console.log('Access token:', accessToken);
                    request({
                        url: 'https://platform.lifelog.sonymobile.com/v1/users/me',
                        auth: {bearer: accessToken},
                        json: true
                    }, function (err, response) {
                        if (err) {
                            console.error('User profile error', err);
                            res.status(500).send(err);
                        } else {
                            console.log('User profile:', response.body);
                            res.send(response.body);
                        }
                    });
                }
            }
        }
    );

});

app.get('/', function (req, res) {
    res.send('Hello<br><a href="/auth">Log in with Lifelog and fetch User Profile</a>');
});

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT + '.');
    console.log('You should now browse to ' + BASE_URI);
});