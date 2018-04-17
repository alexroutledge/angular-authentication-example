/*
 * Copyright (c) 2018 Company Name.
 * All rights reserved.
 *
 * Company Name and the Company Name logo are trademarks
 * or registered trademarks of Company Name
 * or its affiliates in the U.S. and other countries.
 * Other names may be trademarks of their respective owners.
 *
 * WATERMARK
 */

import * as express from 'express';
import * as path from 'path';
import { AuthService } from './services/auth.service';
import { StrategyService } from './services/strategy.service';
import * as passport from 'passport';
import * as session from 'express-session';
import * as uuid from 'uuid';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import { includes } from 'lodash';

class App {
  public express;

  constructor() {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const authService = new AuthService({});
    const app = express();
    const router = express.Router();
    const staticRoot = path.resolve(__dirname, '../../dist');
    app.use(express.static(staticRoot));
    app.use(session({
      name: 'APP_V1',
      secret: 'secret',
      cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: null // browser-session cookie by default
      },
      resave: false,
      saveUninitialized: false
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(passport.initialize());
    app.use(passport.session());
    const strategy = new StrategyService((user: any, next: any) => {
      next(user, undefined);
    }, {});
    passport.use(strategy);
    // Configure how Passport serializes the user object
    // to the session (we'll serialize everything):
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
    app.get('/', (req, res) => {
      res.sendFile('index.html', { root: staticRoot });
    });
    app.post('/api/v1/token', (req, res) => {
      const token = jwt.sign({
        name: 'alex',
        roles: ['write']
      }, 'xyz');
      res.json({
        accessToken: token
      });
    });
    app.post('/api/v1/login', authService.handleAuth, (req, res) => {
      res.json({
        isAuthenticated: true
      });
    });
    app.post('/api/v1/logout', authService.logout, (req, res) => {
      res.json({
        isAuthenticated: false
      });
    });
    app.get('/api/v1/authenticate', authService.checkAuthenticated, (req, res) => {
      res.json({
        isAuthenticated: true
      });
    });
    app.get('/api/v1/user', authService.checkAuthenticated, (req, res) => {
      res.json(req.user);
    });
    app.get('/api/v1/roles/:permission', authService.checkAuthenticated, (req, res) => {
      if (includes(req.user.roles, req.params.permission)) {
        res.json(req.user);
      } else {
        res.send(422);
      }
    });
    this.express.use('/', app);
  }
}

export default new App().express;
