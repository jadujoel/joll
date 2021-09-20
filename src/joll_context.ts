
export function getAudioContext (): AudioContext
{
    const context = window.AudioContext || window["webkitAudioContext"];
    const contextExists = (context !== null && context !== undefined);

    if (contextExists) 
    { 
        console.log("AudioContext exists.")
    } 
    else 
    { 
        console.warn("Web Audio API is not supported."); 
    }
    return new context()
}