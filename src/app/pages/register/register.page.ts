import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  showDatePicker: boolean = false;

  constructor(private router:Router) { }

  ngOnInit() {
  }

  register(){
    this.router.navigate(['doc-home'])
  }

  toggleDateOfBirth() {
    this.showDatePicker = !this.showDatePicker;
  }

  closeDatePicker() {
    this.showDatePicker = false;
  }
}
