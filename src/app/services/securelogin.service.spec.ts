import { TestBed } from '@angular/core/testing';

import { SecureloginService } from './securelogin.service';

describe('SecureloginService', () => {
  let service: SecureloginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecureloginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
