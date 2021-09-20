

export class mEventEmitter
{
    _events: Object;

    constructor () 
    {
        this._events = {};
    }

    on (name: string, listener: Function)
    {
        if (!this._events[name])
        {
            this._events[name] = [];
        }

        this._events[name].push(listener);
    }

    removeListener (name: string, listenerToRemove: Function) 
    {
        if (!this._events[name]) 
        {
            throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
        }
    
        const filterListeners = (listener: Function): boolean => 
        { 
            return listener !== listenerToRemove;
        }
    
        this._events[name] = this._events[name].filter(filterListeners);
    }

    emit <T> (name: string, data: T): void 
    {
        if (!this._events[name]) 
        {
            throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`);
        }
    
        const fireCallbacks = (callback: Function): void => 
        {
            callback(data);
        };
    
        this._events[name].forEach(fireCallbacks);
    }

} 

export default mEventEmitter;