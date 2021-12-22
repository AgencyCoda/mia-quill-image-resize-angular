import { IDefaultOptions } from '../DefaultOptions';
import { IframeResize } from '../IframeResize';

export interface IBaseModule {
    onCreate(): void;
    onDestroy(): void;
    onUpdate(): void;
}

/**
 * Base Module class to assign and pass option variables to other internal modules of ImageResize
 *
 * @export
 * @abstract
 * @class BaseModule
 * @implements {IBaseModule}
 */
export abstract class BaseModule implements IBaseModule {
    protected overlay: HTMLElement;
    protected iframe: HTMLIFrameElement;
    protected options: IDefaultOptions;
    protected iframeResize: IframeResize;

    public constructor(iframeResize: IframeResize) {
        this.overlay = iframeResize.overlay;
        this.iframe = <HTMLIFrameElement>iframeResize.iframe;
        this.options = iframeResize.options;
        this.iframeResize = iframeResize;
    }

    abstract onCreate(): void;
    abstract onDestroy(): void;
    abstract onUpdate(): void;
}
