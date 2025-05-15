import express from "express";
import * as oidcProvider from 'oidc-provider';

const app = express();
const client_id = "oidcCLIENT";
const client_secret = "Some_secret";
const configuration = {
  clients: [
    {
      client_id,
      client_secret,
      grant_types: ["authorization_code", "refresh_token"],
      redirect_urls: ["http://localhost:3000/oidc_redirect"],
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