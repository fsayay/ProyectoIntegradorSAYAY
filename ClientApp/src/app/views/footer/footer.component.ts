import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  anio: number;
  today: any;

  constructor(
    private datePipe: DatePipe
  ) {
    this.anio = new Date().getFullYear();
  }

  ngOnInit() {
    this.today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
  }

}
