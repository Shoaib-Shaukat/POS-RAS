import { TestBed } from '@angular/core/testing';

import { GvarService } from './gvar.service';

describe('GvarService', () => {
  let service: GvarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GvarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
