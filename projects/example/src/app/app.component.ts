import { Component, OnInit } from '@angular/core';
import { ImageResize } from 'projects/agencycoda/mia-quill-image-resize/src/public-api';
import { IframeResize } from 'projects/agencycoda/mia-quill-iframe-resize/src/public-api';

import Quill from 'quill';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'example';

  modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['image', 'link', 'video'],
    ],
    imageResize: {},
    iframeResize: {}
  }

  ngOnInit(): void {
    Quill.register('modules/imageResize', ImageResize);
    Quill.register('modules/iframeResize', IframeResize);
  }
}
