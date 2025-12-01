import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements AfterViewInit {
  // Strängar för att visa resultatet i template
  singleSelectionResult = 'Väntar på val...';
  multiSelectionResult = 'Väntar på val...';

  // Få en referens till flervals-komponenten för att kunna anropa metoder på den
  @ViewChild('multiSelect') multiSelectBox!: ElementRef<any>;

  ngAfterViewInit(): void {
    // Komponenten behöver initieras innan vi kan interagera med den programmatiskt.
    // Vi använder en liten timeout för att säkerställa att den är redo.
    // I en mer komplex applikation kan man använda mer robusta metoder.
    setTimeout(() => {
      console.log('Yrkesväljaren (flerval) är redo.');
    }, 1000);
  }

  // Hanterar val från enkelvals-komponenten
  handleSelection(event: any): void {
    this.singleSelectionResult = JSON.stringify(event.detail, null, 2);
  }

  // Hanterar val från flervals-komponenten
  handleMultiSelection(event: any): void {
    this.multiSelectionResult = JSON.stringify(event.detail, null, 2);
  }

  // Exempel på programmatisk värdesättning
  setPreselected(): void {
    // Kontrollera att komponenten är redo och har metoden setValuesByLabels
    if (this.multiSelectBox.nativeElement && 'setValuesByLabels' in this.multiSelectBox.nativeElement) {
      this.multiSelectBox.nativeElement.setValuesByLabels(['Läkare', 'Sjuksköterska']);
    } else {
      console.error('Metoden setValuesByLabels är inte tillgänglig.');
    }
  }

  // Exempel på att rensa val
  clearSelection(): void {
    if (this.multiSelectBox.nativeElement && 'clearMultiSelection' in this.multiSelectBox.nativeElement) {
      this.multiSelectBox.nativeElement.clearMultiSelection();
    } else {
      console.error('Metoden clearMultiSelection är inte tillgänglig.');
    }
  }

  // --- Playground / Alla features ---
  @ViewChild('playgroundSelect') playgroundSelect!: ElementRef<any>;

  // Properties
  pgLabel = 'Playground Yrkesväljare';
  pgLabelDescription = 'Testa alla inställningar här';
  pgPlaceholder = 'Sök yrke...';
  pgEnableMultiple = true;
  pgRequireSelection = false;
  pgShowSearchIcon = true;
  pgMinLength = 3;
  pgMaxResults = 10;
  pgErrorMessage = '';
  
  // Logs
  pgLogs: string[] = [];

  // Event handlers
  handlePgSelection(event: any): void {
    this.log(`Selection: ${JSON.stringify(event.detail)}`);
  }

  handlePgStatusChange(event: any): void {
    this.log(`StatusChange: ${JSON.stringify(event.detail)}`);
  }

  handlePgDataLoadFailed(event: any): void {
    this.log(`DataLoadFailed: ${JSON.stringify(event.detail)}`);
  }

  handlePgValidationChange(event: any): void {
    this.log(`ValidationChange: ${JSON.stringify(event.detail)}`);
  }

  // Methods
  async pgValidate(): Promise<void> {
    if (this.playgroundSelect?.nativeElement) {
      const isValid = await this.playgroundSelect.nativeElement.validate();
      this.log(`Validate() result: ${isValid}`);
    }
  }

  async pgSetValueById(id: string): Promise<void> {
    if (this.playgroundSelect?.nativeElement) {
      await this.playgroundSelect.nativeElement.setValue(id);
      this.log(`setValue('${id}') called`);
    }
  }

  async pgClear(): Promise<void> {
    if (this.playgroundSelect?.nativeElement) {
      await this.playgroundSelect.nativeElement.clearMultiSelection();
      this.log('clearMultiSelection() called');
    }
  }

  private log(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.pgLogs.unshift(`[${timestamp}] ${message}`);
    if (this.pgLogs.length > 20) this.pgLogs.pop();
  }
}
