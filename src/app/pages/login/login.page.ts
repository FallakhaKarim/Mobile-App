import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageForm } from './login.page.form';
import { AppState } from 'src/store/AppState';
import { Store } from '@ngrx/store';
import { show, hide } from 'src/store/loading/loading.actions';
import { ToastController } from '@ionic/angular';
import { LoginState } from 'src/store/login/LoginState';
import { AuthService } from 'src/app/services/auth/auth.service';
import { login, loginFail, loginSuccess, recoverPasswordFail, recoverPasswordSuccess } from 'src/store/login/login.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit,OnDestroy {
  loginRole: string = 'doctor';

  form!: FormGroup;
  loginStateSubscription!: Subscription;

  constructor(private router: Router, private formBuilder : FormBuilder, private store : Store<AppState>, private toastController : ToastController, private authService : AuthService) {}

  ngOnInit(){
    this.form = new LoginPageForm(this.formBuilder).createForm();

    this.loginStateSubscription = this.store.select('login').subscribe(loginState => {
      this.onIsRecoveredPassword(loginState);
      this.onIsRecoveringPassword(loginState);
      this.onError(loginState);
      this.onIsLogginIn(loginState);
      this.onIsLoggedIn(loginState);
      this.toggleLoading(loginState);

    })
  }

  ngOnDestroy() {
    if(this.loginStateSubscription){
      this.loginStateSubscription.unsubscribe();
    }
  }

  private toggleLoading (loginState: LoginState) {
    if(loginState.isLogginIn || loginState.isRecoveringPassword) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    }
  }

  private onIsLogginIn(loginState: LoginState) {
    if(loginState.isLogginIn) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;
      this.authService.login(email, password).subscribe(user => {
        this.store.dispatch(loginSuccess({user}));
      }, error => {
        this.store.dispatch(loginFail({error}));
      })
    }
  }

  private onIsLoggedIn(loginState: LoginState) {{
    if(loginState.isLoggedIn) {
      this.router.navigate(['doc-home']);
    }
  }}

  private async onError(loginState : LoginState) {
    if(loginState.error) {
      const toaster = await this.toastController.create({
        position : "bottom",
        message : loginState.error.message,
        color : "danger",
      });
      toaster.present();
    }
  }

  private onIsRecoveringPassword(loginState:LoginState){
    if(loginState.isRecoveringPassword) {

      this.authService.recoverEmailPassword(this.form?.get('email')?.value).subscribe(() => {//added "?", might affect code later on
        this.store.dispatch(recoverPasswordSuccess());
      },error => {
      this.store.dispatch(recoverPasswordFail({error}))
      });
    };
  };

  private async onIsRecoveredPassword(loginState:LoginState){
    if(loginState.isRecoverdPassword) {
      const toaster = await this.toastController.create({
        position : "bottom",
        message : "Recovery email sent",
        color : "primary",
      });
      toaster.present();
    }
  }

  forgotEmailPassword() {
    this.store.dispatch(recoverPasswordButton());
  }

  login(){
    this.store.dispatch(login());
  }

  register(){
    this.router.navigate(['register'])
  }

  toggleLoginRole() {
    this.loginRole = this.loginRole === 'doctor' ? 'patient' : 'doctor';
  }
}

function recoverPasswordButton(): any {
  throw new Error('Function not implemented.');
}
