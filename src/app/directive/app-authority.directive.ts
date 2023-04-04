import { Subscription } from "rxjs";
import { AuthentificationService } from "../pages/service/authentification.service";
import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { AppUser } from "../pages/model/user.model";

@Directive({
  selector: '[appHasAnyAuthority]'
})
export class HasAnyAuthorityDirective {

  private authorities: string[] | undefined = [];
  private authenticationSubscription?: Subscription;


  constructor(private accountService: AuthentificationService, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {}

  @Input()
  set appHasAnyAuthority(value: string | string[] | undefined) {
    this.authorities = typeof value === 'string' ? [value] : value;

    this.updateView();
    // Get notified each time authentication state changes.
    this.authenticationSubscription = this.accountService.getAuthenticationState().subscribe(() => this.updateView());

  }

  ngOnDestroy(): void {
    if (this.authenticationSubscription) {
      this.authenticationSubscription.unsubscribe();
    }
  }

  private updateView(): void {
    const hasAnyAuthority = this.accountService.hasAnyAuthority(this.authorities);
    this.viewContainerRef.clear();
    if (hasAnyAuthority) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }




}
