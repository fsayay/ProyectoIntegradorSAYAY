import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService, ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService, PdfViewerComponent } from '@syncfusion/ej2-angular-pdfviewer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pdf-loader',
  templateUrl: './pdf-loader.component.html',
  styleUrls: ['./pdf-loader.component.css'],
  providers: [LinkAnnotationService, BookmarkViewService, MagnificationService, 
    ThumbnailViewService, ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService]

})
export class PdfLoaderComponent implements OnInit {

  document: string;
  fileName: string;

  @Input() filePath;
  @ViewChild('pdfViewer') public pdfviewerControl : PdfViewerComponent;

  public service =  environment.apiURL +'pdfviewer';
  
  constructor() { }

  ngOnInit(): void {
    this.document = this.getFilePath(this.filePath);    
  }

  getFilePath(filePath: string) {
    const tempFileName = filePath.split('/');
    const nameFile = tempFileName[tempFileName.length - 1];
    return nameFile;
  }

}
