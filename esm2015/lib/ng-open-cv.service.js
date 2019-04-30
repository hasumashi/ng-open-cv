/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as i0 from "@angular/core";
/** @type {?} */
export const OPEN_CV_CONFIGURATION = new InjectionToken('Angular OpenCV Configuration Object');
export class NgOpenCVService {
    /**
     * @param {?} options
     */
    constructor(options) {
        this.src = null;
        this.dstC1 = null;
        this.dstC3 = null;
        this.dstC4 = null;
        this.isReady = new BehaviorSubject({
            ready: false,
            error: false,
            loading: true
        });
        this.isReady$ = this.isReady.asObservable();
        this.OPENCV_URL = 'opencv.js';
        this.DEFAULT_OPTIONS = {
            scriptUrl: 'assets/opencv/asm/3.4/opencv.js',
            wasmBinaryFile: 'wasm/3.4/opencv_js.wasm',
            usingWasm: false,
            locateFile: this.locateFile.bind(this),
            onRuntimeInitialized: () => { }
        };
        this.setScriptUrl(options.scriptUrl);
        /** @type {?} */
        const opts = Object.assign({}, this.DEFAULT_OPTIONS, { options });
        this.loadOpenCv(opts);
    }
    /**
     * @param {?} path
     * @param {?} scriptDirectory
     * @return {?}
     */
    locateFile(path, scriptDirectory) {
        if (path === 'opencv_js.wasm') {
            return scriptDirectory + '/wasm/' + path;
        }
        else {
            return scriptDirectory + path;
        }
    }
    /**
     * @param {?} url
     * @return {?}
     */
    setScriptUrl(url) {
        this.OPENCV_URL = url;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    loadOpenCv(options) {
        this.isReady.next({
            ready: false,
            error: false,
            loading: true
        });
        window['Module'] = Object.assign({}, options);
        /** @type {?} */
        const script = document.createElement('script');
        script.setAttribute('async', '');
        script.setAttribute('type', 'text/javascript');
        script.addEventListener('load', () => {
            /** @type {?} */
            const onRuntimeInitializedCallback = () => {
                if (options.onRuntimeInitialized) {
                    options.onRuntimeInitialized();
                }
                this.isReady.next({
                    ready: true,
                    error: false,
                    loading: false
                });
            };
            cv.onRuntimeInitialized = onRuntimeInitializedCallback;
        });
        script.addEventListener('error', () => {
            /** @type {?} */
            const err = this.printError('Failed to load ' + this.OPENCV_URL);
            this.isReady.next({
                ready: false,
                error: true,
                loading: false
            });
            this.isReady.error(err);
        });
        script.src = this.OPENCV_URL;
        /** @type {?} */
        const node = document.getElementsByTagName('script')[0];
        if (node) {
            node.parentNode.insertBefore(script, node);
        }
        else {
            document.head.appendChild(script);
        }
    }
    /**
     * @param {?} path
     * @param {?} url
     * @return {?}
     */
    createFileFromUrl(path, url) {
        /** @type {?} */
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        return new Observable(observer => {
            const { next, error: catchError, complete } = observer;
            request.onload = ev => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        /** @type {?} */
                        const data = new Uint8Array(request.response);
                        cv.FS_createDataFile('/', path, data, true, false, false);
                        observer.next();
                        observer.complete();
                    }
                    else {
                        this.printError('Failed to load ' + url + ' status: ' + request.status);
                        observer.error();
                    }
                }
            };
            request.send();
        });
    }
    /**
     * @param {?} imageUrl
     * @param {?} canvasId
     * @return {?}
     */
    loadImageToCanvas(imageUrl, canvasId) {
        return Observable.create(observer => {
            /** @type {?} */
            const canvas = /** @type {?} */ (document.getElementById(canvasId));
            /** @type {?} */
            const ctx = canvas.getContext('2d');
            /** @type {?} */
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                observer.next();
                observer.complete();
            };
            img.src = imageUrl;
        });
    }
    /**
     * @param {?} imageUrl
     * @param {?} canvas
     * @return {?}
     */
    loadImageToHTMLCanvas(imageUrl, canvas) {
        return Observable.create(observer => {
            /** @type {?} */
            const ctx = canvas.getContext('2d');
            /** @type {?} */
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                observer.next();
                observer.complete();
            };
            img.src = imageUrl;
        });
    }
    /**
     * @return {?}
     */
    clearError() {
        this.errorOutput.innerHTML = '';
    }
    /**
     * @param {?} err
     * @return {?}
     */
    printError(err) {
        if (typeof err === 'undefined') {
            err = '';
        }
        else if (typeof err === 'number') {
            if (!isNaN(err)) {
                if (typeof cv !== 'undefined') {
                    err = 'Exception: ' + cv.exceptionFromPtr(err).msg;
                }
            }
        }
        else if (typeof err === 'string') {
            /** @type {?} */
            const ptr = Number(err.split(' ')[0]);
            if (!isNaN(ptr)) {
                if (typeof cv !== 'undefined') {
                    err = 'Exception: ' + cv.exceptionFromPtr(ptr).msg;
                }
            }
        }
        else if (err instanceof Error) {
            err = err.stack.replace(/\n/g, '<br>');
        }
        throw new Error(err);
    }
    /**
     * @param {?} scriptId
     * @param {?} textAreaId
     * @return {?}
     */
    loadCode(scriptId, textAreaId) {
        /** @type {?} */
        const scriptNode = /** @type {?} */ (document.getElementById(scriptId));
        /** @type {?} */
        const textArea = /** @type {?} */ (document.getElementById(textAreaId));
        if (scriptNode.type !== 'text/code-snippet') {
            throw Error('Unknown code snippet type');
        }
        textArea.value = scriptNode.text.replace(/^\n/, '');
    }
    /**
     * @param {?} fileInputId
     * @param {?} canvasId
     * @return {?}
     */
    addFileInputHandler(fileInputId, canvasId) {
        /** @type {?} */
        const inputElement = document.getElementById(fileInputId);
        inputElement.addEventListener('change', e => {
            /** @type {?} */
            const files = e.target['files'];
            if (files.length > 0) {
                /** @type {?} */
                const imgUrl = URL.createObjectURL(files[0]);
                this.loadImageToCanvas(imgUrl, canvasId);
            }
        }, false);
    }
    /**
     * @return {?}
     */
    onVideoCanPlay() {
        if (this.onCameraStartedCallback) {
            this.onCameraStartedCallback(this.stream, this.video);
        }
    }
    /**
     * @param {?} resolution
     * @param {?} callback
     * @param {?} videoId
     * @return {?}
     */
    startCamera(resolution, callback, videoId) {
        /** @type {?} */
        const constraints = {
            qvga: { width: { exact: 320 }, height: { exact: 240 } },
            vga: { width: { exact: 640 }, height: { exact: 480 } }
        };
        /** @type {?} */
        let video = /** @type {?} */ (document.getElementById(videoId));
        if (!video) {
            video = document.createElement('video');
        }
        /** @type {?} */
        let videoConstraint = constraints[resolution];
        if (!videoConstraint) {
            videoConstraint = true;
        }
        navigator.mediaDevices
            .getUserMedia({ video: videoConstraint, audio: false })
            .then(stream => {
            video.srcObject = stream;
            video.play();
            this.video = video;
            this.stream = stream;
            this.onCameraStartedCallback = callback;
            video.addEventListener('canplay', this.onVideoCanPlay.bind(this), false);
        })
            .catch(err => {
            this.printError('Camera Error: ' + err.name + ' ' + err.message);
        });
    }
    /**
     * @return {?}
     */
    stopCamera() {
        if (this.video) {
            this.video.pause();
            this.video.srcObject = null;
            this.video.removeEventListener('canplay', this.onVideoCanPlay.bind(this));
        }
        if (this.stream) {
            this.stream.getVideoTracks()[0].stop();
        }
    }
    /**
     * @param {?} src
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    getContours(src, width, height) {
        cv.cvtColor(src, this.dstC1, cv.COLOR_RGBA2GRAY);
        cv.threshold(this.dstC1, this.dstC4, 120, 200, cv.THRESH_BINARY);
        /** @type {?} */
        const contours = new cv.MatVector();
        /** @type {?} */
        const hierarchy = new cv.Mat();
        cv.findContours(this.dstC4, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE, {
            x: 0,
            y: 0
        });
        this.dstC3.delete();
        this.dstC3 = cv.Mat.ones(height, width, cv.CV_8UC3);
        for (let i = 0; i < contours.size(); ++i) {
            /** @type {?} */
            const color = new cv.Scalar(0, 255, 0);
            cv.drawContours(this.dstC3, contours, i, color, 1, cv.LINE_8, hierarchy);
        }
        contours.delete();
        hierarchy.delete();
        return this.dstC3;
    }
}
NgOpenCVService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NgOpenCVService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [OPEN_CV_CONFIGURATION,] }] }
];
/** @nocollapse */ NgOpenCVService.ngInjectableDef = i0.defineInjectable({ factory: function NgOpenCVService_Factory() { return new NgOpenCVService(i0.inject(OPEN_CV_CONFIGURATION)); }, token: NgOpenCVService, providedIn: "root" });
if (false) {
    /** @type {?} */
    NgOpenCVService.prototype.errorOutput;
    /** @type {?} */
    NgOpenCVService.prototype.src;
    /** @type {?} */
    NgOpenCVService.prototype.dstC1;
    /** @type {?} */
    NgOpenCVService.prototype.dstC3;
    /** @type {?} */
    NgOpenCVService.prototype.dstC4;
    /** @type {?} */
    NgOpenCVService.prototype.stream;
    /** @type {?} */
    NgOpenCVService.prototype.video;
    /** @type {?} */
    NgOpenCVService.prototype.isReady;
    /** @type {?} */
    NgOpenCVService.prototype.isReady$;
    /** @type {?} */
    NgOpenCVService.prototype.onCameraStartedCallback;
    /** @type {?} */
    NgOpenCVService.prototype.OPENCV_URL;
    /** @type {?} */
    NgOpenCVService.prototype.DEFAULT_OPTIONS;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctb3Blbi1jdi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctb3Blbi1jdi8iLCJzb3VyY2VzIjpbImxpYi9uZy1vcGVuLWN2LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7O0FBU25ELGFBQWEscUJBQXFCLEdBQUcsSUFBSSxjQUFjLENBQWdCLHFDQUFxQyxDQUFDLENBQUM7QUFLOUcsTUFBTTs7OztJQXlCSixZQUEyQyxPQUFzQjttQkF2QjNELElBQUk7cUJBQ0YsSUFBSTtxQkFDSixJQUFJO3FCQUNKLElBQUk7dUJBSU0sSUFBSSxlQUFlLENBQW1CO1lBQ3RELEtBQUssRUFBRSxLQUFLO1lBQ1osS0FBSyxFQUFFLEtBQUs7WUFDWixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUM7d0JBQ3VDLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFOzBCQUV2RCxXQUFXOytCQUNOO1lBQ2hCLFNBQVMsRUFBRSxpQ0FBaUM7WUFDNUMsY0FBYyxFQUFFLHlCQUF5QjtZQUN6QyxTQUFTLEVBQUUsS0FBSztZQUNoQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3RDLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxJQUFHO1NBQy9CO1FBR0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O1FBQ3JDLE1BQU0sSUFBSSxxQkFBUSxJQUFJLENBQUMsZUFBZSxJQUFFLE9BQU8sSUFBRztRQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZCOzs7Ozs7SUFFTyxVQUFVLENBQUMsSUFBSSxFQUFFLGVBQWU7UUFDdEMsSUFBSSxJQUFJ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QyxPQUFPLENBQUMsQ0FBQztRQUNwRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFOztZQUN4QyxNQUFNLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDMUU7UUFDRCxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEIsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjs7O1lBbFFGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7Ozs0Q0EwQmMsTUFBTSxTQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0aW9uVG9rZW4gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBPcGVuQ1ZMb2FkUmVzdWx0LCBPcGVuQ1ZPcHRpb25zIH0gZnJvbSAnLi9uZy1vcGVuLWN2Lm1vZGVscyc7XG5cbi8qXG5Bbmd1bGFyIG1vZGlmaWZpY2F0aW9uIG9mIHRoZSBPcGVuQ1YgdXRpbHMgc2NyaXB0IGZvdW5kIGF0IGh0dHBzOi8vZG9jcy5vcGVuY3Yub3JnL21hc3Rlci91dGlscy5qc1xuKi9cbmRlY2xhcmUgdmFyIGN2OiBhbnk7XG5cbmV4cG9ydCBjb25zdCBPUEVOX0NWX0NPTkZJR1VSQVRJT04gPSBuZXcgSW5qZWN0aW9uVG9rZW48T3BlbkNWT3B0aW9ucz4oJ0FuZ3VsYXIgT3BlbkNWIENvbmZpZ3VyYXRpb24gT2JqZWN0Jyk7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE5nT3BlbkNWU2VydmljZSB7XG4gIGVycm9yT3V0cHV0OiBIVE1MRWxlbWVudDtcbiAgc3JjID0gbnVsbDtcbiAgZHN0QzEgPSBudWxsO1xuICBkc3RDMyA9IG51bGw7XG4gIGRzdEM0ID0gbnVsbDtcblxuICBzdHJlYW06IGFueTtcbiAgdmlkZW86IGFueTtcbiAgcHJpdmF0ZSBpc1JlYWR5ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxPcGVuQ1ZMb2FkUmVzdWx0Pih7XG4gICAgcmVhZHk6IGZhbHNlLFxuICAgIGVycm9yOiBmYWxzZSxcbiAgICBsb2FkaW5nOiB0cnVlXG4gIH0pO1xuICBpc1JlYWR5JDogT2JzZXJ2YWJsZTxPcGVuQ1ZMb2FkUmVzdWx0PiA9IHRoaXMuaXNSZWFkeS5hc09ic2VydmFibGUoKTtcbiAgb25DYW1lcmFTdGFydGVkQ2FsbGJhY2s6IChhLCBiKSA9PiB2b2lkO1xuICBPUEVOQ1ZfVVJMID0gJ29wZW5jdi5qcyc7XG4gIERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBzY3JpcHRVcmw6ICdhc3NldHMvb3BlbmN2L2FzbS8zLjQvb3BlbmN2LmpzJyxcbiAgICB3YXNtQmluYXJ5RmlsZTogJ3dhc20vMy40L29wZW5jdl9qcy53YXNtJyxcbiAgICB1c2luZ1dhc206IGZhbHNlLFxuICAgIGxvY2F0ZUZpbGU6IHRoaXMubG9jYXRlRmlsZS5iaW5kKHRoaXMpLFxuICAgIG9uUnVudGltZUluaXRpYWxpemVkOiAoKSA9PiB7fVxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoT1BFTl9DVl9DT05GSUdVUkFUSU9OKSBvcHRpb25zOiBPcGVuQ1ZPcHRpb25zKSB7XG4gICAgdGhpcy5zZXRTY3JpcHRVcmwob3B0aW9ucy5zY3JpcHRVcmwpO1xuICAgIGNvbnN0IG9wdHMgPSB7IC4uLnRoaXMuREVGQVVMVF9PUFRJT05TLCBvcHRpb25zIH07XG4gICAgdGhpcy5sb2FkT3BlbkN2KG9wdHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2NhdGVGaWxlKHBhdGgsIHNjcmlwdERpcmVjdG9yeSk6IHN0cmluZyB7XG4gICAgaWYgKHBhdGggPT09ICdvcGVuY3ZfanMud2FzbScpIHtcbiAgICAgIHJldHVybiBzY3JpcHREaXJlY3RvcnkgKyAnL3dhc20vJyArIHBhdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzY3JpcHREaXJlY3RvcnkgKyBwYXRoO1xuICAgIH1cbiAgfVxuXG4gIHNldFNjcmlwdFVybCh1cmw6IHN0cmluZykge1xuICAgIHRoaXMuT1BFTkNWX1VSTCA9IHVybDtcbiAgfVxuXG4gIGxvYWRPcGVuQ3Yob3B0aW9uczogT3BlbkNWT3B0aW9ucykge1xuICAgIHRoaXMuaXNSZWFkeS5uZXh0KHtcbiAgICAgIHJlYWR5OiBmYWxzZSxcbiAgICAgIGVycm9yOiBmYWxzZSxcbiAgICAgIGxvYWRpbmc6IHRydWVcbiAgICB9KTtcbiAgICB3aW5kb3dbJ01vZHVsZSddID0geyAuLi5vcHRpb25zIH07XG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnYXN5bmMnLCAnJyk7XG4gICAgc2NyaXB0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uUnVudGltZUluaXRpYWxpemVkQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgIGlmIChvcHRpb25zLm9uUnVudGltZUluaXRpYWxpemVkKSB7XG4gICAgICAgICAgb3B0aW9ucy5vblJ1bnRpbWVJbml0aWFsaXplZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNSZWFkeS5uZXh0KHtcbiAgICAgICAgICByZWFkeTogdHJ1ZSxcbiAgICAgICAgICBlcnJvcjogZmFsc2UsXG4gICAgICAgICAgbG9hZGluZzogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgY3Yub25SdW50aW1lSW5pdGlhbGl6ZWQgPSBvblJ1bnRpbWVJbml0aWFsaXplZENhbGxiYWNrO1xuICAgIH0pO1xuICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGVyciA9IHRoaXMucHJpbnRFcnJvcignRmFpbGVkIHRvIGxvYWQgJyArIHRoaXMuT1BFTkNWX1VSTCk7XG4gICAgICB0aGlzLmlzUmVhZHkubmV4dCh7XG4gICAgICAgIHJlYWR5OiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHRoaXMuaXNSZWFkeS5lcnJvcihlcnIpO1xuICAgIH0pO1xuICAgIHNjcmlwdC5zcmMgPSB0aGlzLk9QRU5DVl9VUkw7XG4gICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICBpZiAobm9kZSkge1xuICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzY3JpcHQsIG5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlRmlsZUZyb21VcmwocGF0aCwgdXJsKSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICByZXF1ZXN0LnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIGNvbnN0IHsgbmV4dCwgZXJyb3I6IGNhdGNoRXJyb3IsIGNvbXBsZXRlIH0gPSBvYnNlcnZlcjtcbiAgICAgIHJlcXVlc3Qub25sb2FkID0gZXYgPT4ge1xuICAgICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgVWludDhBcnJheShyZXF1ZXN0LnJlc3BvbnNlKTtcbiAgICAgICAgICAgIGN2LkZTX2NyZWF0ZURhdGFGaWxlKCcvJywgcGF0aCwgZGF0YSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQoKTtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJpbnRFcnJvcignRmFpbGVkIHRvIGxvYWQgJyArIHVybCArICcgc3RhdHVzOiAnICsgcmVxdWVzdC5zdGF0dXMpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWRJbWFnZVRvQ2FudmFzKGltYWdlVXJsLCBjYW52YXNJZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5jcmVhdGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgY29uc3QgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYW52YXNJZCk7XG4gICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1nLmNyb3NzT3JpZ2luID0gJ2Fub255bW91cyc7XG4gICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBjYW52YXMud2lkdGggPSBpbWcud2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfTtcbiAgICAgIGltZy5zcmMgPSBpbWFnZVVybDtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWRJbWFnZVRvSFRNTENhbnZhcyhpbWFnZVVybDogc3RyaW5nLCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZS5jcmVhdGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIGltZy5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgY2FudmFzLndpZHRoID0gaW1nLndpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaW1nLmhlaWdodDtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XG4gICAgICAgIG9ic2VydmVyLm5leHQoKTtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH07XG4gICAgICBpbWcuc3JjID0gaW1hZ2VVcmw7XG4gICAgfSk7XG4gIH1cblxuICBjbGVhckVycm9yKCkge1xuICAgIHRoaXMuZXJyb3JPdXRwdXQuaW5uZXJIVE1MID0gJyc7XG4gIH1cblxuICBwcmludEVycm9yKGVycikge1xuICAgIGlmICh0eXBlb2YgZXJyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgZXJyID0gJyc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXJyID09PSAnbnVtYmVyJykge1xuICAgICAgaWYgKCFpc05hTihlcnIpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY3YgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgZXJyID0gJ0V4Y2VwdGlvbjogJyArIGN2LmV4Y2VwdGlvbkZyb21QdHIoZXJyKS5tc2c7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlcnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBwdHIgPSBOdW1iZXIoZXJyLnNwbGl0KCcgJylbMF0pO1xuICAgICAgaWYgKCFpc05hTihwdHIpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY3YgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgZXJyID0gJ0V4Y2VwdGlvbjogJyArIGN2LmV4Y2VwdGlvbkZyb21QdHIocHRyKS5tc2c7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICBlcnIgPSBlcnIuc3RhY2sucmVwbGFjZSgvXFxuL2csICc8YnI+Jyk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICB9XG5cbiAgbG9hZENvZGUoc2NyaXB0SWQsIHRleHRBcmVhSWQpIHtcbiAgICBjb25zdCBzY3JpcHROb2RlID0gPEhUTUxTY3JpcHRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNjcmlwdElkKTtcbiAgICBjb25zdCB0ZXh0QXJlYSA9IDxIVE1MVGV4dEFyZWFFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRleHRBcmVhSWQpO1xuICAgIGlmIChzY3JpcHROb2RlLnR5cGUgIT09ICd0ZXh0L2NvZGUtc25pcHBldCcpIHtcbiAgICAgIHRocm93IEVycm9yKCdVbmtub3duIGNvZGUgc25pcHBldCB0eXBlJyk7XG4gICAgfVxuICAgIHRleHRBcmVhLnZhbHVlID0gc2NyaXB0Tm9kZS50ZXh0LnJlcGxhY2UoL15cXG4vLCAnJyk7XG4gIH1cblxuICBhZGRGaWxlSW5wdXRIYW5kbGVyKGZpbGVJbnB1dElkLCBjYW52YXNJZCkge1xuICAgIGNvbnN0IGlucHV0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZpbGVJbnB1dElkKTtcbiAgICBpbnB1dEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjaGFuZ2UnLFxuICAgICAgZSA9PiB7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gZS50YXJnZXRbJ2ZpbGVzJ107XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgaW1nVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlc1swXSk7XG4gICAgICAgICAgdGhpcy5sb2FkSW1hZ2VUb0NhbnZhcyhpbWdVcmwsIGNhbnZhc0lkKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIG9uVmlkZW9DYW5QbGF5KCkge1xuICAgIGlmICh0aGlzLm9uQ2FtZXJhU3RhcnRlZENhbGxiYWNrKSB7XG4gICAgICB0aGlzLm9uQ2FtZXJhU3RhcnRlZENhbGxiYWNrKHRoaXMuc3RyZWFtLCB0aGlzLnZpZGVvKTtcbiAgICB9XG4gIH1cblxuICBzdGFydENhbWVyYShyZXNvbHV0aW9uLCBjYWxsYmFjaywgdmlkZW9JZCkge1xuICAgIGNvbnN0IGNvbnN0cmFpbnRzID0ge1xuICAgICAgcXZnYTogeyB3aWR0aDogeyBleGFjdDogMzIwIH0sIGhlaWdodDogeyBleGFjdDogMjQwIH0gfSxcbiAgICAgIHZnYTogeyB3aWR0aDogeyBleGFjdDogNjQwIH0sIGhlaWdodDogeyBleGFjdDogNDgwIH0gfVxuICAgIH07XG4gICAgbGV0IHZpZGVvID0gPEhUTUxWaWRlb0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodmlkZW9JZCk7XG4gICAgaWYgKCF2aWRlbykge1xuICAgICAgdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgIH1cblxuICAgIGxldCB2aWRlb0NvbnN0cmFpbnQgPSBjb25zdHJhaW50c1tyZXNvbHV0aW9uXTtcbiAgICBpZiAoIXZpZGVvQ29uc3RyYWludCkge1xuICAgICAgdmlkZW9Db25zdHJhaW50ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXG4gICAgICAuZ2V0VXNlck1lZGlhKHsgdmlkZW86IHZpZGVvQ29uc3RyYWludCwgYXVkaW86IGZhbHNlIH0pXG4gICAgICAudGhlbihzdHJlYW0gPT4ge1xuICAgICAgICB2aWRlby5zcmNPYmplY3QgPSBzdHJlYW07XG4gICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgdGhpcy52aWRlbyA9IHZpZGVvO1xuICAgICAgICB0aGlzLnN0cmVhbSA9IHN0cmVhbTtcbiAgICAgICAgdGhpcy5vbkNhbWVyYVN0YXJ0ZWRDYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdjYW5wbGF5JywgdGhpcy5vblZpZGVvQ2FuUGxheS5iaW5kKHRoaXMpLCBmYWxzZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIHRoaXMucHJpbnRFcnJvcignQ2FtZXJhIEVycm9yOiAnICsgZXJyLm5hbWUgKyAnICcgKyBlcnIubWVzc2FnZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHN0b3BDYW1lcmEoKSB7XG4gICAgaWYgKHRoaXMudmlkZW8pIHtcbiAgICAgIHRoaXMudmlkZW8ucGF1c2UoKTtcbiAgICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0ID0gbnVsbDtcbiAgICAgIHRoaXMudmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2FucGxheScsIHRoaXMub25WaWRlb0NhblBsYXkuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnN0cmVhbSkge1xuICAgICAgdGhpcy5zdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXS5zdG9wKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29udG91cnMoc3JjLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgY3YuY3Z0Q29sb3Ioc3JjLCB0aGlzLmRzdEMxLCBjdi5DT0xPUl9SR0JBMkdSQVkpO1xuICAgIGN2LnRocmVzaG9sZCh0aGlzLmRzdEMxLCB0aGlzLmRzdEM0LCAxMjAsIDIwMCwgY3YuVEhSRVNIX0JJTkFSWSk7XG4gICAgY29uc3QgY29udG91cnMgPSBuZXcgY3YuTWF0VmVjdG9yKCk7XG4gICAgY29uc3QgaGllcmFyY2h5ID0gbmV3IGN2Lk1hdCgpO1xuICAgIGN2LmZpbmRDb250b3Vycyh0aGlzLmRzdEM0LCBjb250b3VycywgaGllcmFyY2h5LCBjdi5SRVRSX0NDT01QLCBjdi5DSEFJTl9BUFBST1hfU0lNUExFLCB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH0pO1xuICAgIHRoaXMuZHN0QzMuZGVsZXRlKCk7XG4gICAgdGhpcy5kc3RDMyA9IGN2Lk1hdC5vbmVzKGhlaWdodCwgd2lkdGgsIGN2LkNWXzhVQzMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udG91cnMuc2l6ZSgpOyArK2kpIHtcbiAgICAgIGNvbnN0IGNvbG9yID0gbmV3IGN2LlNjYWxhcigwLCAyNTUsIDApO1xuICAgICAgY3YuZHJhd0NvbnRvdXJzKHRoaXMuZHN0QzMsIGNvbnRvdXJzLCBpLCBjb2xvciwgMSwgY3YuTElORV84LCBoaWVyYXJjaHkpO1xuICAgIH1cbiAgICBjb250b3Vycy5kZWxldGUoKTtcbiAgICBoaWVyYXJjaHkuZGVsZXRlKCk7XG4gICAgcmV0dXJuIHRoaXMuZHN0QzM7XG4gIH1cbn1cbiJdfQ==