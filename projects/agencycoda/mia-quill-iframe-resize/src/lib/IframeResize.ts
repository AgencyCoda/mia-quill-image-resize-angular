import { assign, merge } from 'lodash';
import * as Quill from 'quill';
import { DefaultOptions, IDefaultOptions } from './DefaultOptions';
import { DisplaySize } from './modules/DisplaySize';
import { Resize } from './modules/Resize';

type KnownModule = DisplaySize | Resize;
const knownModules: any = { DisplaySize, Resize };

// Quill.d.ts from official repository doesn't contain all elements available from the quill instance. The missing properties are defined here:
export interface IQuillInstance {
    root: HTMLElement|any;
    container: HTMLElement;

    editor: any; // Editor
    emitter: any; // Emitter
    history: any; // History
    keyboard: Quill.KeyboardStatic;
    options: {
        bounds: Quill.BoundsStatic,
        container: HTMLElement,
        modules: Object,
        placeholder: string,
        readonly: boolean,
        scrollingContainer: HTMLElement,
        strict: boolean,
        theme: (quill: IQuillInstance, options: IDefaultOptions) => void
    };
    scroll: any; // Scroll
    scrollingContainer: HTMLElement;
    selection: any; // Selection,
    theme: any; // Current Theme for Quill.Editor SnowTheme

    setSelection(index: number, length: number, source?: Quill.Sources): void;
    setSelection(range: Quill.RangeStatic | any, source?: Quill.Sources): void;
}

interface IImageResizeListeners {
    onRootClick: (event: MouseEvent) => void;
    onKeyUp: (event: KeyboardEvent) => void;
}
/**
 * Enables Image Resizing on image elements in a Quill.Editor
 *
 * @export
 * @class ImageResize
 */
export class IframeResize {
    private _options: IDefaultOptions; // Options for current module, see DefaultOptions for a full list of available options
    private instance: IQuillInstance; // Instance of the quill editor, to setup listeners and retrieving data from the editor (e.g. image)
    private currentSelectedVideo?: EventTarget | Element | any; // The image activated / clicked

    private currentOverlay?: HTMLElement|any; // Selection overlay, for highlighting a selected image

    private modules: any[] | any; // Internal modules enabled

    private listeners: IImageResizeListeners; // Listeners for click&key events. Used for storing functions, rather than creating duplicates for each call

    constructor(quill: IQuillInstance|Quill.Quill|any, options: IDefaultOptions) {
        this.instance = quill;
        // Merge default options, overwrite with any passed in options
        this._options = merge({}, DefaultOptions, options);

        this.listeners = {
            onRootClick: this.onRootClick(),
            onKeyUp: this.onKeyUp()
        };

        let self = this;
        quill.on('text-change', function() {
            const videos = self.instance.root.querySelectorAll('iframe');
            for (let i = 0; i <videos.length; ++i) {
                assign(videos[i].style, {
                    'pointer-events': 'none'
                });
                if(videos[i].style.width == undefined || videos[i].style.width == ''){
                    videos[i].style.width = '300px';
                }
                if(videos[i].style.height == undefined || videos[i].style.height == ''){
                    videos[i].style.height = '150px';
                }
            }
        });

        // Disable native image resize in firefox
        document.execCommand('enableObjectResizing', false, 'false');

        this.instance.root.addEventListener('click', this.listeners.onRootClick, false);
        this.instance.root.parentElement.style.position = this.instance.root.parentElement.style.position || 'relative';

        this.modules = [];
    }

    /**
     * Re-initialize all internal modules, to active them
     *
     * @private
     *
     * @memberof ImageResize
     */
    private initModules(): void {
        let self = this;
        this.destroyModules();

        if (this._options.modules){
            //this.modules = this._options.modules;
            let optionsModule: Array<any> = this._options.modules as Array<any>;
            this.modules = optionsModule.map(
                function (mclass: string | KnownModule | any): void {
                    return new (knownModules[mclass] || mclass)(self);
                }
            );
        }

        this.modules.forEach(function (module: KnownModule): void {
            module.onCreate();
        });
        this.onUpdate();
    }

    private destroyModules(): void {
        this.modules.forEach(function (module: KnownModule): void {
            module.onDestroy();
        });
        this.modules = [];
    }

    /**
     * Event Handler to run when an element is clicked inside the Quill editor
     * Checks if the selected element is an image, and creates an overlay of the selected element
     *
     * @private
     * @returns {(evt: Event) => void}
     *
     * @memberof ImageResize
     */
    private onRootClick(): (evt: Event) => void {
        let self = this;

        return function (event: Event|any): void {
            if (event.target === self.instance.root) {
                const videos = self.instance.root.querySelectorAll('iframe');
                for (let i = 0; i <videos.length; ++i) {
                    /*assign(videos[i].style, {
                        width: '300px',
                        height: '150px',
                        'pointer-events': 'none'
                    });*/
                    const rect = videos[i].getBoundingClientRect()
                    if (event.clientX < rect.x) {
                        continue
                    }
                    if (event.clientX > rect.right) {
                        continue
                    }
                    if (event.clientY < rect.y) {
                        continue
                    }
                    if (event.clientY > rect.bottom) {
                        continue
                    }
                    if (videos[i] && videos[i].tagName && videos[i].tagName.toUpperCase() === 'IFRAME') {
                        if (self.currentSelectedVideo === videos[i]) {
                          // we are already focused on this video
                          return
                        }
                        if (self.currentSelectedVideo) {
                          // we were just focused on another video
                          self.hideSelection()
                        }
                        // clicked on an video inside the editor
                        self.showSelection(videos[i])
                      } else if (self.currentSelectedVideo) {
                        // clicked on a non video
                        self.hideSelection()
                      }
                }
            }
        };
    }

    /**
     * Hide the active overlay of active image
     *
     * @private
     * @returns
     *
     * @memberof ImageResize
     */
    private hideSelection(): void {
        if (!this.currentSelectedVideo)
            return;

        this.instance.root.parentNode.removeChild(this.currentOverlay);
        this.currentOverlay = null;

        document.removeEventListener('keyup', this.listeners.onKeyUp);
        this.instance.root.removeEventListener('input', this.listeners.onKeyUp);

        this.userSelectValue = '';

        this.destroyModules();
        this.currentSelectedVideo = null;
    }

    /**
     * SHow the overlay of the image clicked
     *
     * @private
     * @param {HTMLElement} element
     *
     * @memberof ImageResize
     */
    private showSelection(element: HTMLElement): void {
        this.currentSelectedVideo = element;

        if (this.currentOverlay)
            this.hideSelection();

        this.instance.setSelection(null);
        this.userSelectValue = 'none';

        document.addEventListener('keyup', this.listeners.onKeyUp, true);
        this.instance.root.addEventListener('input', this.listeners.onKeyUp, true);

        this.createOverlayElement();
        this.instance.root.parentNode.appendChild(this.currentOverlay);

        this.reposition();
        this.initModules();
    }

    private createOverlayElement(): HTMLElement {
        this.currentOverlay = document.createElement('div');
        assign(this.currentOverlay.style, this._options.overlayStyles);

        return this.currentOverlay;
    }

    /**
     * Repositions the overlay, to follow the bound of the selected image
     *
     * @private
     * @returns
     *
     * @memberof ImageResize
     */
    private reposition(): void {
        if (!this.currentOverlay || !this.currentSelectedVideo)
            return;

        let parent = this.instance.root.parentNode;
        let imgRect = (<Element>this.currentSelectedVideo).getBoundingClientRect();
        let containerRect = parent.getBoundingClientRect();

        let repositionData = {
            left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
            top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
            width: `${imgRect.width}px`,
            height: `${imgRect.height}px`,
        };

        assign(this.currentOverlay.style, repositionData);
    }

    /**
     * Updates each internal module
     *
     * @memberof ImageResize
     */
    public onUpdate(): void {
        this.reposition();

        this.modules.forEach(function (module: KnownModule): void {
            module.onUpdate();
        });
    }

    private set userSelectValue(value: string) {
        let self = this;
        ['userSelect', 'mozUserSelect', 'webkitUserSelect', 'msUserSelect'].forEach(function (key: string|any): void {
            self.instance.root.style[key] = value;
            document.documentElement.style[key] = value;
        });
    }

    /**
     * Key Handler, for removing an image when DELETE or BACKSPACE is pressed
     *
     * @private
     * @returns {(event: KeyboardEvent) => void}
     *
     * @memberof ImageResize
     */
    private onKeyUp(): (event: KeyboardEvent) => void {
        let self = this;
        const KEYCODE_BACKSPACE = 8;
        const KEYCODE_DELETE = 46;

        return function (event: KeyboardEvent): void {
            if (self.currentSelectedVideo) {
                if (event.keyCode === KEYCODE_DELETE || event.keyCode === KEYCODE_BACKSPACE)
                    (<any>Quill).find(self.currentSelectedVideo).deleteAt(0);
            }

        };
    }

    public get overlay(): HTMLElement {
        return this.currentOverlay;
    }

    public get iframe(): Element | EventTarget | any {
        return this.currentSelectedVideo;
    }

    public get options(): IDefaultOptions {
        return this._options;
    }
}
