import express from "express";
import * as oidcProvider from 'oidc-provider';
import config from './config.js'

const app = express();
const client_id = config.client_id;
const client_secret = config.client_secret;
const configuration = {
  clients: [
    {
      client_id,
      client_secret,
      grant_types: ["authorization_code", "refresh_token"],
      redirect_uris: ["http://localhost:8080/oidc_redirect"],
      response_types: ["code"],
    },
  ],
  pkce: {
    required: () => false,
  },
  async findAccount(ctx, id) {
    return {
      accountId: id,
      async claims(use, scope) {
        return { sub: id, name: "user" };
      },
    };
  },
  clientBasedCORS: () => true,
};

const oidc = new oidcProvider.Provider('http://localhost:3000/', configuration);
app.use("/oidc", oidc.callback());

app.listen(3000, function () {
    console.log('OIDC is listening on port 3000!');
});