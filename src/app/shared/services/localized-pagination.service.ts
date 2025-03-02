import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LocalizationService } from '../../core/services/localization.service';

@Injectable()
export class LocalizedPaginationService extends MatPaginatorIntl {
  public override itemsPerPageLabel: string = '';
  public override nextPageLabel: string = '';
  public override previousPageLabel: string = '';
  public override firstPageLabel: string = '';
  public override lastPageLabel: string = '';

  constructor(private localizationService: LocalizationService) {
    super();

    localizationService.getLocalizedText('table.pagination.items-per-page').then((value) => {      
      this.itemsPerPageLabel = value;
    });
    localizationService.getLocalizedText('table.pagination.next-page').then((value) => {
      this.nextPageLabel = value;
    });
    localizationService.getLocalizedText('table.pagination.previous-page').then((value) => {
      this.previousPageLabel = value;
    });
    localizationService.getLocalizedText('table.pagination.first-page').then((value) => {
      this.firstPageLabel = value;
    });
    localizationService.getLocalizedText('table.pagination.last-page').then((value) => {
      this.lastPageLabel = value;
    });
  }

  public override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, length);
    return `${start} - ${end} / ${length}`;
  };
}
