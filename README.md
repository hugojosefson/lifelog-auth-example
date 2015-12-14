# lifelog-auth-example

Example of accessing a user's profile in Lifelog with OAuth2 authorization.

## Installation

```bash
git clone https://github.com/hugojosefson/lifelog-auth-example
cd lifelog-auth-example
npm install
```

## Prerequisites

### Hosted on an https URL

The app needs to be run on an https URL.

One way of achieving this during development or for quick testing, is by
running the app locally on your laptop, and using
[localtunnel.me](https://localtunnel.me/) to let anyone access it:

```bash
export LOCALTUNNEL_SUBDOMAIN=yourname
npm run localtunnel
```

### An application registered with Sony Developer World

Log in and create an application at
[developer.sony.com/develop/services/lifelog-api/create-app/](https://developer.sony.com/develop/services/lifelog-api/create-app/).

Configure its *Callback URL* so that it reflects the localtunnel name you used
above. For example, if you set up localtunnel with the name `yourname`, this
is the correct *Callback URL*:

```
https://yourname.localtunnel.me/callback
```

#### The Client ID and Secret

Save the *Client ID* and *Secret* you are given when registering the
application. If you forget the secret, simply click *Add credentials* to get a
new set of credentials.

## Running


```bash
export BASE_URI=https://your.server.tld  # The https URL where your site is available. Like Callback URL, but without /callback
export PORT=3000                         # to optionally set which port your server should listen on (default is 3000)
export CLIENT_ID=your_client_id          # The Client ID you received from Developer World when creating your app.
export CLIENT_SECRET=your_client_secret  # The Client Secret you received from Developer World when creating your app.
npm start
```

If you are using `localtunnel`, you can use `LOCALTUNNEL_SUBDOMAIN` instead of `BASE_URI` if you want:

```bash
export LOCALTUNNEL_SUBDOMAIN=yourname
export PORT=3000                         # to optionally set which port your server should listen on (default is 3000)
export CLIENT_ID=your_client_id          # The Client ID you received from Developer World when creating your app.
export CLIENT_SECRET=your_client_secret  # The Client Secret you received from Developer World when creating your app.
npm start
```