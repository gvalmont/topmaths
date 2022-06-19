import { TestBed } from '@angular/core/testing';

import { OutilsService } from './outils.service';

describe('OutilsService', () => {
  let service: OutilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
