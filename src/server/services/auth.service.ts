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

'use strict';
import * as _ from 'lodash';
import * as passport from 'passport';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';

export class AuthService {

  private strategyName: string = 'passport-auth';
  constructor(private constants: any) { }
  /**
   * isAuthenticated - Determine if the user is currently authenticated
   */
  public isAuthenticated() {
    return passport.authenticate(this.strategyName, { session: false });
  }

  /**
   * checkAuthenticated - Returns the middleware next function if the user is authenticated.
   * If the user is not authenticated, a 401 response is returned
   * @param {object} req ExpressJS request object
   * @param {object} res ExpressJS response object
   * @param {object} next ExpressJS middleware next function
   */
  public checkAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    // if the user is not authenticated, send a 401 response
    res.sendStatus(401);
  }

  /**
   * login - Creates a user session in Express using the 'passport-auth' strategy.
   * If the session is successfully created, the user is redirected back to the map entry point.
   * If the session cannot be createdd, the user is redirected back to the failureRedirect configured in constants.
   * @param {object} req ExpressJS request object
   * @param {object} res ExpressJS response object
   * @param {object} next ExpressJS middleware next function
   */
  public login(req: express.Request, res: express.Response, next: express.NextFunction) {
    passport.authenticate(this.strategyName, { session: false }, (err: object, user: object, info: object) => {
      req.logIn(user, (error: object) => {
        const passportSession = req.session.passport;
        req.session.regenerate(() => {
          req.session.user = user;
          req.session.passport = passportSession;
          req.session.save(() => {
            next();
          });
        });
      });
    })(req, res, next);
  }

  /**
   * logout - Logs the user out of the application and destroys the ExpressJS user session.
   * @param {object} req ExpressJS request object
   * @param {object} res ExpressJS response object
   * @param {object} next ExpressJS middleware next function
   */
  public logout = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.logout();
    req.session.destroy(() => {
      next();
    });
  }

  /**
   * handleAuth - Validates the JWT if provided and then creates a user session.
   * If no JWT is provided, the user is authenticated using the existing session.
   * If no session exists already, the user is reidrected to the logout path.
   * @param {object} req ExpressJS request object
   * @param {object} res ExpressJS response object
   * @param {object} next ExpressJS middleware next function
   */
  public handleAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.body);
    // Always create new session by login whenever there is a token parameter
    if (req.body.accessToken) {
      return this.login(req, res, next);
    }

    return this.isAuthenticated()(req, res, next);
  }

}
