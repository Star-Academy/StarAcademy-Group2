import { TestBed } from '@angular/core/testing';

import { SearchNodesService } from './search-nodes.service';

describe('SearchNodesService', () => {
  let service: SearchNodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchNodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
