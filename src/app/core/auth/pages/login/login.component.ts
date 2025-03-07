import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../features/services/auth.service';
import { SnackbarNotificationService } from '../../../../shared/services/notifications/snackbar-notification.service';
import { HttpStatusCode } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { waitFor } from '../../../../shared/utility/time.util';
import { IntegrationService } from '../../../../features/services/integration.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  private returnUrl: string = '/';
  private loginReturnUrl: string = '/dashboard/overview'

  public isLoading: boolean = false;
  public isLoggingIn: boolean = false;

  public loginForm: FormGroup;
  public hidePassword: boolean = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private tokenService: TokenService,
              private snackbarNotificationService: SnackbarNotificationService,
              private integrationService: IntegrationService) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.tokenService.isAuthenticated.value) {
      this.router.navigate([this.loginReturnUrl]);
    }
    else {
      this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || this.loginReturnUrl;
    }
  }

  onPasswordToggle() {
    this.hidePassword = !this.hidePassword;
  }

  async onLogIn() {
    if (this.loginForm.invalid)
      return;

    this.isLoading = true;
    this.isLoggingIn = true;

    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    let response = await this.authService.login(username, password);
    if (response.isSuccess) {
      // Status code is also needed to be checked because of the integartion process
      if (response.statusCode == HttpStatusCode.Accepted) {
        response = await this.authService.integrate(username, password);
        if (response.isSuccess) {
          const notification = await this.snackbarNotificationService.showSnackbar({
            messageKey: 'auth.integration-in-progress',
            isLoading: true
          });
          this.isLoggingIn = false;
          this.integrationService.initialize(response);
          await waitFor(10);
          this.snackbarNotificationService.closeSnackbar(notification);
        }
      }
      else {
        this.integrationService.initialize(response);
      }
      this.router.navigate([this.returnUrl]);
    }
    
    this.isLoading = false;
    this.isLoggingIn = false;
  }

  get form() {
    return this.loginForm.controls;
  }
}
