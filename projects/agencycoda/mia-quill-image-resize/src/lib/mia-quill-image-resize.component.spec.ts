import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiaQuillImageResizeComponent } from './mia-quill-image-resize.component';

describe('MiaQuillImageResizeComponent', () => {
  let component: MiaQuillImageResizeComponent;
  let fixture: ComponentFixture<MiaQuillImageResizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiaQuillImageResizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiaQuillImageResizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
