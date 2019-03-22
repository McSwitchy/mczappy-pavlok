# zappy time



## setup
- clone / download the repo
- `yarn` install
- get pavlok api tokens. put these into a file named `.env` with the same format as `.env.example`
  - **you may also need to allow API access to your pavlok via the pavlok mobile app... look under settings**
  - go to http://pavlok-mvp.herokuapp.com/docs/oauth.html
  - create pavlok account
  - click "[register your application](http://pavlok-mvp.herokuapp.com/oauth/applications)"
  - click "New Application" button
  - give it a name
  - paste the following into the `Redirect URI` field & submit:
    ```
      urn:ietf:wg:oauth:2.0:oob
      http://localhost:3010/auth/pavlok/result
    ```
  - `cp .env.example .env.development`
  - paste `Client ID` & `Secret` from the `pavlok-mvp` into the `.env.development` file.
  - the process will complete in your browser when the local server is started
- references:
  - https://buy.pavlok.com/blogs/news/115896643-pavlok-developer-api
  - https://github.com/Behavioral-Technology-Group/Pavlok-Node-Samples/tree/master/Pavlok_Node_Remote

## server mode
- to run the app on a remote server, another oauth key needs to be provisioned.
  - click "[register your application](http://pavlok-mvp.herokuapp.com/oauth/applications)"
  - click "New Application" button
  - give it a name
  - paste the following into the `Redirect URI` field & submit:
    ```
      http://<your-host-url.tld>/auth/pavlok/result
    ```
  - `cp .env.example .env`
  - paste `Client ID` & `Secret` from the `pavlok-mvp` into the `.env` file.

## run
- `yarn dev` to start dev mode (go to http://localhost:3000 after the server starts)
- `yarn now` to deploy to now.sh


## usage
- I tested this with a v1 pavlok. It would drop the bluetooth connection w/ my iphone/ipad quite often and wouldn't reconnect. This poor behavior may be fixed in pavlok v2 (they use a better bluetooth module)
-


#### 30 Jan 2018
- update readme
- post to GitHub

#### 17 nov 2017
forked from https://github.com/Behavioral-Technology-Group/Pavlok-Node-Samples/tree/master/Pavlok_Node_Remote
