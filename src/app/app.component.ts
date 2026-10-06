import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements AfterViewInit {
  multiSelectionResult = 'Väntar på val...';
  skillSelectionResult = 'Väntar på val...';
  selectedOccupationId = '';
  selectedInputIds = '';
  contextSummary = 'Ingen yrkeskontext vald';
  popularSummary = 'Välj ett yrke för att visa rekommenderade kompetenser.';
  showPopular = false;

  @ViewChild('multiSelect') multiSelectBox!: ElementRef<any>;

  ngAfterViewInit(): void {
    setTimeout(() => console.log('Yrkesväljaren (flerval) är redo.'), 1000);
  }

  handleMultiSelection(event: any): void {
    this.multiSelectionResult = JSON.stringify(event.detail, null, 2);
    this.setOccupationContext(event.detail);
  }

  handleSkillSelection(event: any): void {
    this.skillSelectionResult = JSON.stringify(event.detail, null, 2);
  }

  private setOccupationContext(selection: any): void {
    const contexts = (Array.isArray(selection) ? selection : [selection])
      .map((item) => this.toKvContext(item))
      .filter((context): context is { id: string; label: string } => !!context?.id)
      .filter((context, index, list) => list.findIndex((candidate) => candidate.id === context.id) === index)
      .slice(0, 5);

    const first = contexts[0];
    const extraIds = contexts.slice(1).map((context) => context.id).slice(0, 4);

    this.selectedOccupationId = first?.id ?? '';
    this.selectedInputIds = extraIds.join(',');
    this.showPopular = contexts.length === 1;

    if (contexts.length === 0) {
      this.contextSummary = 'Ingen yrkeskontext vald';
      this.popularSummary = 'Välj ett yrke för att visa rekommenderade kompetenser.';
      return;
    }

    this.contextSummary = contexts
      .map((context, index) => `${index + 1}. ${context.label || 'Yrkeskontext'} (${context.id})`)
      .join('\n');

    this.popularSummary = this.showPopular
      ? 'Ett yrke valt: KV visar rekommenderade kompetenser för yrket.'
      : 'Flera yrken valda: rekommenderade kompetenser är avstängda eftersom inget yrke är viktigare än de andra. Yrkena används som sökkontext.';
  }

  private toKvContext(item: any): { id: string; label: string } | null {
    if (!item) return null;

    const type = item?.type ?? '';
    const occupationNameId = item?.occupation_name?.id ?? item?.occupationName?.id ?? item?.occupationId ?? '';
    const occupationNameLabel = item?.occupation_name?.preferred_label ?? item?.occupationName?.preferred_label ?? item?.occupationLabel ?? '';
    const conceptId = item?.['taxonomy/id'] ?? item?.conceptId ?? item?.id ?? '';
    const ssykLevel4Id = item?.ssyk_level_4_id ?? item?.ssykLevel4Id ?? item?.ssyk ?? '';
    const label = item?.['taxonomy/preferred-label'] ?? item?.preferred_label ?? item?.preferredLabel ?? item?.label ?? '';

    const id = type === 'JobTitle'
      ? this.resolveKvContextId(occupationNameId, ssykLevel4Id)
      : this.resolveKvContextId(conceptId, ssykLevel4Id);

    if (!id) return null;

    return {
      id,
      label: type === 'JobTitle' ? occupationNameLabel || label : label,
    };
  }

  private resolveKvContextId(conceptId: string, ssykLevel4Id: string): string {
    const kvBase = (window as any).__kvBase;
    if (conceptId && kvBase?.occupationToSsyk4?.[conceptId]) return conceptId;
    if (ssykLevel4Id && kvBase?.ssyk4ToSsyk3?.[ssykLevel4Id]) return ssykLevel4Id;
    return conceptId || ssykLevel4Id || '';
  }

  setPreselected(): void {
    if (this.multiSelectBox.nativeElement && 'setValuesByLabels' in this.multiSelectBox.nativeElement) {
      this.multiSelectBox.nativeElement.setValuesByLabels(['Läkare', 'Sjuksköterska']);
    }
  }

  clearSelection(): void {
    if (this.multiSelectBox.nativeElement && 'clearMultiSelection' in this.multiSelectBox.nativeElement) {
      this.multiSelectBox.nativeElement.clearMultiSelection();
    }
    this.setOccupationContext([]);
    this.multiSelectionResult = 'Väntar på val...';
    this.skillSelectionResult = 'Väntar på val...';
  }
}
