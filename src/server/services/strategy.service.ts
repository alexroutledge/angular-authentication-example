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
import * as passport from 'passport-strategy';
import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import * as request from 'request';

export class StrategyService extends passport.Strategy  {

  public name: string;
  private _verify: any;

  constructor(verify: any, constants: any) {
    super();
    this.name = 'passport-auth';
    this._verify = verify;
  }

  /**
   * authenticate - Redirects the user to the correct URL after an existing session is terminated.
   * @param {object} req ExpressJS request object
   * @param {object} options The current configuration object
   */
  public async authenticate(req: express.Request, options: any) {
    let token;
    token = this.getToken(req);
    if (token) {
      // if a JWT is present in the query string, validate it and then redirect the user to the success/failure path
      jwt.verify(token, 'xyz', (err: Error, user: any) => {
        return this._verify(user, this.success);
      });
    }
  }

  /**
   * getToken - Returns the user's JWT.
   * @param {object} req ExpressJS request object
   */
  private getToken(req: express.Request) {
    let sessionId;
    if (req.session.user) {
      sessionId = jwt.sign(req.session.user, 'xyz');
    }
    return req.body.accessToken || sessionId;
  }

}
