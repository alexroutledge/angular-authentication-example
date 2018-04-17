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

import { Directive, OnInit, ElementRef, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { UserService } from './services/user.service';
import { intersection } from 'lodash';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {

  private currentUser: any;
  private permissions = [];

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService
  ) {
  }

  public ngOnInit() {
    this.userService.getUser()
    .subscribe((user: any) => {
      this.currentUser = user;
      this.updateView();
    });
  }

  @Input()
  set hasPermission(val) {
    this.permissions = val;
  }

  private updateView() {
    if (this.checkPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission() {
    return intersection(this.currentUser.roles, this.permissions).length > 0;
  }

}
