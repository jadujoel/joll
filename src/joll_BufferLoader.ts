export class BufferLoader 
{
    private context: AudioContext;
    urlList: Array<string>;
    onload: Function;
    bufferList: Array<AudioBuffer>;
    loadCount: number;

    constructor (context: AudioContext, urlList?: Array<string>, callback?: Function) 
    {
        this.context = context;
        this.urlList = urlList || [];
        this.onload = callback || function () {};
        this.bufferList = new Array();
        this.loadCount = 0;
    }

    setOnload (func: Function): void { this.onload = func; }

    loadBuffer (url: string, index: number): void 
    {
        console.log("Loading buffer")
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
    
        var loader = this;
    
        request.onload = function () 
        {
            // loader = this
            loader.context.decodeAudioData(
                request.response,
                function (buffer: AudioBuffer) 
                {
                    if (!buffer) 
                    {
                        alert('error decoding file data: ' + url);
                        return;
                    }
                    loader.bufferList[index] = buffer;
                    
                    if (++loader.loadCount == loader.urlList.length) 
                    {
                        loader.onload(loader.bufferList);
                    }
                }    
            );
        }
    
        request.onerror = function () { alert('BufferLoader: XHR error'); }
        request.send();
    }
    
    load (): void 
    {
        console.log("Function BufferLoader Load")
        for (var i = 0; i < this.urlList.length; ++i) {
            this.loadBuffer(this.urlList[i], i);
        }
    }

    addSample (url: string): void 
    {
        this.urlList.push(url);
        this.loadBuffer(url, this.urlList.length - 1);
    }

    getLastBuffer (): AudioBuffer { return this.bufferList[this.bufferList.length - 1]; }

    getFirstBuffer (): AudioBuffer { return this.bufferList[0]; }

    getBuffer (idx: number): AudioBuffer { return this.bufferList[idx]; }

    getBufferFromPath (path: string): AudioBuffer 
    {
        console.log(`GetBufferFromPath: ${this.urlList.indexOf(path)}`)
        return this.bufferList[this.urlList.indexOf(path)];
    }
}

export default BufferLoader;