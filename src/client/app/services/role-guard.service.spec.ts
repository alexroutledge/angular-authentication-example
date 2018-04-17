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

import { TestBed, async, inject } from '@angular/core/testing';

import { RoleGuardService } from './role-guard.service';

describe('RoleGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleGuardService]
    });
  });

  it('should ...', inject([RoleGuardService], (guard: RoleGuardService) => {
    expect(guard).toBeTruthy();
  }));
});
