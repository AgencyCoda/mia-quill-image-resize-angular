import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiaQuillIframeResizeComponent } from './mia-quill-iframe-resize.component';

describe('MiaQuillIframeResizeComponent', () => {
  let component: MiaQuillIframeResizeComponent;
  let fixture: ComponentFixture<MiaQuillIframeResizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiaQuillIframeResizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiaQuillIframeResizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
