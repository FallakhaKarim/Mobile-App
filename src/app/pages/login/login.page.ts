import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage {
  loginRole: string = 'doctor';

  constructor(private router: Router) {}

  ngOnInit(){

  }

  login(){
    this.router.navigate(['doc-home'])
  }

  register(){
    this.router.navigate(['register'])
  }

  toggleLoginRole() {
    this.loginRole = this.loginRole === 'doctor' ? 'patient' : 'doctor';
  }
}