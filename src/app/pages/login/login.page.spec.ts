import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ToastController } from '@ionic/angular';

import { LoginPage } from './login.page';
import { Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { loadingReducer } from 'src/store/loading/loading.reducer';
import { loginReducer } from 'src/store/login/login.reducers';
import { AppState } from 'src/store/AppState';
import { recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from 'src/store/login/login.actions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { User } from 'src/app/model/user/User';

describe('LoaderPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;
  let page : any;
  let store : Store<AppState>
  let toastController : ToastController;
  let authService : AuthService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [
        IonicModule.forRoot(),
        AppRoutingModule,
        ReactiveFormsModule,
        StoreModule.forRoot(),
        StoreModule.forFeature("loading", loadingReducer),
        StoreModule.forFeature("login", loginReducer),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    router = TestBed.get(Router);
    store = TestBed.get(Store);
    authService = TestBed.get(AuthService)
    toastController = TestBed.get(ToastController);
    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;

  }));

  it('should create a form on init', () => {
    component.ngOnInit();
    expect(component.form).not.toBeUndefined();
  })

  it('should go to register page on register', ()=>{
    spyOn(router,'navigate');
    component.register();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  })

  it('should recover email/password on email/password', () => {
    fixture.detectChanges();//start page
    component.form.get('email')?.setValue("valid@email.com");//user set valid email
    page.querySelector("#recoverPasswordButton").click(); //user clicked on forgot email/password button
    store.select('login').subscribe(loginState => {
      expect(loginState.isRecoveringPassword).toBeTruthy();
    }) //expect loginState.isRecoveringPassword is true
  });

  it('should show loading when recovering password', () => {
    fixture.detectChanges(); //start page
    store.dispatch(recoverPassword()); //change isReveringPassword to true
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();//verify loadingState.show == true
    });
  });

  it('should hide loading and show success message when has recovered password', () => {
    spyOn(toastController,'create').and.returnValue(<any> Promise.resolve({present: () => {}}));
    fixture.detectChanges(); //start page
    store.dispatch(recoverPassword()); //set login state as recovering password
    store.dispatch(recoverPasswordSuccess()); //set login state as recoverd password
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    }) //verify loadingState.show == false
    expect(toastController.create).toHaveBeenCalledTimes(1); //verify message was shown

  });

  it('should hide loading and show error message when error on recover password', () => {
    spyOn(toastController,'create').and.returnValue(<any> Promise.resolve({present: () => {}}));
    fixture.detectChanges(); //start page
    store.dispatch(recoverPassword()); //recover password
    store.dispatch(recoverPasswordFail({error : "message"})); //recover password fail
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    });
    expect(toastController.create).toHaveBeenCalledTimes(1); 
    //expect error shown
  });

  it('should show loading and start login when logging in' ,  () => {
    fixture.detectChanges(); //start a page
    component.form.get('email')?.setValue('valid@email.com'); 
    component.form.get('password')?.setValue('anyPassword');//set valide email and pass
    page.querySelector('#loginButton').click(); //click on login button
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeTruthy();
    }) //expect loading is showing
    store.select('login').subscribe(loginState => {
      expect(loginState.isLogginIn).toBeTruthy
    }) //expect loggin in
  })

  it('should hide loading and send user to home page when user has logged in', () => {
    spyOn(router,'navigate');
    spyOn(authService,'login').and.returnValue(of(new User()));
    fixture.detectChanges(); //start page
    component.form.get('email')?.setValue('valid@email.com'); //set valid email
    component.form.get('password')?.setValue('anyPassword'); //set vadild password
    page.querySelector('#loginButton').click(); //click on login button
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    }) //expect loading hidden
    store.select('login').subscribe(loginState => {
      expect(loginState.isLoggedIn).toBeTruthy();
    }) //expect logged in
    expect(router.navigate).toHaveBeenCalledWith(['doc-home']) //expect home page showing
  })

  it('should hide the loading componene and show an error message when user couldnt login', () => {
    spyOn(authService, 'login').and.returnValue(throwError({message : 'error'}));
    spyOn(toastController,'create').and.returnValue(<any> Promise.resolve({present: () => {}}));
    fixture.detectChanges(); //start page
    component.form.get('email')?.setValue('error@email.com'); //set error email
    component.form.get('password')?.setValue('anyPassword'); //set vadild password
    page.querySelector('#loginButton').click(); //click on login button
    store.select('loading').subscribe(loadingState => {
      expect(loadingState.show).toBeFalsy();
    });
    expect(toastController.create).toHaveBeenCalledTimes(1); //expect error message shown
  });

});
