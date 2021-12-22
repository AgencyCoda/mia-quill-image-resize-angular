import { TestBed } from '@angular/core/testing';

import { MiaQuillIframeResizeService } from './mia-quill-iframe-resize.service';

describe('MiaQuillIframeResizeService', () => {
  let service: MiaQuillIframeResizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiaQuillIframeResizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
