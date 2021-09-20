import { ADSR } from "./joll_Adsr.js";
import { Ambience } from "./joll_Ambience.js";
import Utils from "./joll_Utils.js";
import { BeatScheduler } from './joll_BeatScheduler.js';
import { BufferLoader } from "./joll_BufferLoader.js";
import { Button } from './joll_Button.js';
import { Component } from "./joll_Component.js";
import { CompressorComponent } from "./joll_CompressorComponent.js";
import { getAudioContext } from "./joll_context.js";
import { GainComponent } from "./joll_GainComponent.js";
import { SCHEDULE_AHEAD } from "./joll_globals.js";
import { RisingNoise } from "./joll_RisingNoise.js";
import { SliderLabel } from "./joll_SliderLabel.js";
import { Slider } from './joll_Slider.js';
import { SlotMachine } from "./joll_SlotMachine.js";
import { TempoTrack } from './joll_TempoTrack.js';
import { Transport } from "./joll_Transport.js"
// import { WhiteNoiseProcessor } from "./white-noise-processor.js";
import { DrumMachineComponent } from "./drums/joll_DrumMachineComponent.js"
import { DrumMachineTrack } from "./drums/joll_DrumMachineTrack.js";
import { DrumSampler } from "./drums/joll_DrumSampler.js";
import { DrumSynth } from "./drums/joll_DrumSynth.js";
import ScrollBox from "./joll_ScrollBox.js";
// import { AudioWorkletProcessor } from "./worklet-typescript-fix.js";
// import { registerProcessor } from "./worklet-typescript-fix.js";
import { NAME } from "./joll_globals.js";

var mouseposx;
var mouseposy;

(() => 
{
    window.addEventListener ( 
        'mousemove', 
        function (event) 
        {
            mouseposx = event.clientX, 
            mouseposy = event.clientY
        })
})

export default {
    ADSR,
    Ambience,
    Utils,
    BeatScheduler,
    BufferLoader,
    Button,
    Component,
    CompressorComponent,
    getAudioContext,
    GainComponent,
    SCHEDULE_AHEAD,
    RisingNoise,
    SliderLabel,
    Slider,
    ScrollBox,
    SlotMachine,
    TempoTrack,
    Transport,
    // WhiteNoiseProcessor,
    DrumMachineComponent,
    DrumMachineTrack,
    DrumSampler,
    DrumSynth,
    mouseposx,
    mouseposy,
    NAME,
}

