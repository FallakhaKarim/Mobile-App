import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doc-home',
  templateUrl: './doc-home.page.html',
  styleUrls: ['./doc-home.page.scss'],
})

export class DocHomePage {

  constructor() {}

  ngOnInit() {
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      console.log('Selected file:', selectedFile);
    }
  }
}