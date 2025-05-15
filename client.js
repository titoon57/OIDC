import express from 'express'
import { nanoid } from 'nanoid'
import cookieParser from 'cookie-parser'
const COOKIE_SECRET = "SUPER_SECRET_SECRET"
const AUTH_SERVER = "http://localhost:3000"
const AUTH_ENDPOINT = `${AUTH_SERVER}/oidc/auth`
const CLIENT_ID = "oidcCLIENT"
const CLIENT_SECRET = "Some_super_secret"

const app = express()
app.use(cookieParser(COOKIE_SECRET))
app.set('views', './views');
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    const state = nanoid(15)
    res.cookie("state", state, {signed: true})
    console.log(state)
    let query = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: "http://localhost:3000/oidc_redirect",
        response_mode: "form_post",
        response_type: "code",
        scope: "openid",
        state
    })
    res.render("login.ejs", {link_url:`${AUTH_ENDPOINT}?${query.toString()}`})
    // res.send("<a href=\"\">Login with OIDC Provider")
})

app.listen(8080, function (err) {
    if (err) console.log(err)
        console.log('OIDC is listening on port 8080')
})