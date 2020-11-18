import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import { Router } from '@angular/router';
import { ExpiratiosService } from '../expirations/expirations.service';
import esLocale from '@fullcalendar/core/locales/es';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fullcalendar-view',
  templateUrl: './fullcalendar-view.component.html',
  styleUrls: ['./fullcalendar-view.component.css']
})
export class FullcalendarViewComponent implements OnInit {

  contratoActivo: any;
  fullDate= new Array;
  locales = [esLocale];

  // references the #calendar in the template
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  
  constructor(
    private router: Router,
    private vencimientoService: ExpiratiosService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {     
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.cargarDatos();
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'es',
    themeSystem: 'bootstrap',
    contentHeight: 300,
            height: 550,
    headerToolbar: {
      left: 'dayGridMonth,timeGridWeek,timeGridDay',
      center: 'title',
      right: 'today,prevYear,prev,next,nextYear'
    },
    buttonText:{
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Agenda'
    },
    dateClick: this.handleDateClick.bind(this),
    events: this.fullDate,
    eventTextColor: '#fff',
  };

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }  

  someMethod() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }
  
 

  cargarDatos(){
    this.vencimientoService.getVencimientoViewByContrato(this.contratoActivo.id).subscribe(data => {
      data.forEach(element => {
        var newDate;
        if(element.txt_nombreSeccion=='Garantia'){
          newDate = {
            title: "Finaliza " + element.txt_nombreSeccion +": " + element.tipoGarantia,
            date: this.datePipe.transform(element.fechaFinGarantia, "yyyy-MM-dd"),
            backgroundColor: "#00a65a",
            textcolor: '#fff',
            
          }
          data = data.filter( x => x.id!=element.id);
          this.fullDate.push(newDate);
        }

        if(element.txt_nombreSeccion=='Pago'){
          newDate = {
            title: element.txt_nombreSeccion + " "+element.tipoPago+ " tiene hasta hoy para cancelarse",
            date: this.datePipe.transform(element.fechaTentativaPago, "yyyy-MM-dd"),
            backgroundColor: "#f39c12",
          }
          data = data.filter( x => x.id!=element.id);
          this.fullDate.push(newDate);
        }

        if(element.txt_nombreSeccion=='Entregable'){
          newDate = {
            title: "Fecha Limite de este "+element.txt_nombreSeccion + " "+element.tipoEntregable,
            date: this.datePipe.transform(element.fechaEntregable, "yyyy-MM-dd"),
            backgroundColor: 'coral',
          }
          data = data.filter( x => x.id!=element.id);
          this.fullDate.push(newDate);          
        }
        
        if(element.txt_nombreSeccion=='Contrato'){
          newDate = {
            title: "Finaliza "+element.txt_nombreSeccion + ":"+element.txt_codigoContrato,
            date: this.datePipe.transform(element.fechaFinContrato, "yyyy-MM-dd"),
            backgroundColor: "#00c0ef",
            // color: 'yellow',   // an option!
            // textColor: 'black'
          }
          data = data.filter( x => x.id!=element.id);
          this.fullDate.push(newDate);
        }
      });
      
    }, error => console.log("Error: " + error));
  }

  return(){
    this.router.navigate([`/Contrato/${this.contratoActivo.id}/Vencimientos`]);
  }

}
