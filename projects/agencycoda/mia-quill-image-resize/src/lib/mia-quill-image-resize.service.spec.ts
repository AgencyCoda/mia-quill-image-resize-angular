import { TestBed } from '@angular/core/testing';

import { MiaQuillImageResizeService } from './mia-quill-image-resize.service';

describe('MiaQuillImageResizeService', () => {
  let service: MiaQuillImageResizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiaQuillImageResizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
