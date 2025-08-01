enum AudioContextState {
    "suspended",
    "running",
    "closed",
    "interrupted"
};

enum AudioContextRenderSizeCategory {
    "default",
    "hardware"
};

callback DecodeErrorCallback = undefined (DOMException error);

callback DecodeSuccessCallback = undefined (AudioBuffer decodedData);

[Exposed=Window]
interface BaseAudioContext : EventTarget {
    readonly attribute AudioDestinationNode destination;
    readonly attribute float sampleRate;
    readonly attribute double currentTime;
    readonly attribute AudioListener listener;
    readonly attribute AudioContextState state;
    readonly attribute unsigned long renderQuantumSize;
    [SameObject, SecureContext]
    readonly attribute AudioWorklet audioWorklet;
    attribute EventHandler onstatechange;

    AnalyserNode createAnalyser ();
    BiquadFilterNode createBiquadFilter ();
    AudioBuffer createBuffer (unsigned long numberOfChannels,
                                unsigned long length,
                                float sampleRate);
    AudioBufferSourceNode createBufferSource ();
    ChannelMergerNode createChannelMerger (optional unsigned long numberOfInputs = 6);
    ChannelSplitterNode createChannelSplitter (
        optional unsigned long numberOfOutputs = 6);
    ConstantSourceNode createConstantSource ();
    ConvolverNode createConvolver ();
    DelayNode createDelay (optional double maxDelayTime = 1.0);
    DynamicsCompressorNode createDynamicsCompressor ();
    GainNode createGain ();
    IIRFilterNode createIIRFilter (sequence<double> feedforward,
                                    sequence<double> feedback);
    OscillatorNode createOscillator ();
    PannerNode createPanner ();
    PeriodicWave createPeriodicWave (sequence<float> real,
                                        sequence<float> imag,
                                        optional PeriodicWaveConstraints constraints = {});
    ScriptProcessorNode createScriptProcessor(
        optional unsigned long bufferSize = 0,
        optional unsigned long numberOfInputChannels = 2,
        optional unsigned long numberOfOutputChannels = 2);
    StereoPannerNode createStereoPanner ();
    WaveShaperNode createWaveShaper ();

    Promise<AudioBuffer> decodeAudioData (
        ArrayBuffer audioData,
        optional DecodeSuccessCallback? successCallback,
        optional DecodeErrorCallback? errorCallback);
};

enum AudioContextLatencyCategory {
        "balanced",
        "interactive",
        "playback"
};

enum AudioSinkType {
    "none"
};

[Exposed=Window]
interface AudioContext : BaseAudioContext {
    constructor (optional AudioContextOptions contextOptions = {});
    readonly attribute double baseLatency;
    readonly attribute double outputLatency;
    [SecureContext] readonly attribute (DOMString or AudioSinkInfo) sinkId;
    attribute EventHandler onsinkchange;
    attribute EventHandler onerror;
    AudioTimestamp getOutputTimestamp ();
    Promise<undefined> resume ();
    Promise<undefined> suspend ();
    Promise<undefined> close ();
    [SecureContext] Promise<undefined> setSinkId ((DOMString or AudioSinkOptions) sinkId);
    MediaElementAudioSourceNode createMediaElementSource (HTMLMediaElement mediaElement);
    MediaStreamAudioSourceNode createMediaStreamSource (MediaStream mediaStream);
    MediaStreamTrackAudioSourceNode createMediaStreamTrackSource (
        MediaStreamTrack mediaStreamTrack);
    MediaStreamAudioDestinationNode createMediaStreamDestination ();
};

dictionary AudioContextOptions {
    (AudioContextLatencyCategory or double) latencyHint = "interactive";
    float sampleRate;
    (DOMString or AudioSinkOptions) sinkId;
    (AudioContextRenderSizeCategory or unsigned long) renderSizeHint = "default";
};

dictionary AudioSinkOptions {
    required AudioSinkType type;
};

[Exposed=Window]
interface AudioSinkInfo {
    readonly attribute AudioSinkType type;
};

dictionary AudioTimestamp {
    double contextTime;
    DOMHighResTimeStamp performanceTime;
};

[Exposed=Window]
interface OfflineAudioContext : BaseAudioContext {
    constructor(OfflineAudioContextOptions contextOptions);
    constructor(unsigned long numberOfChannels, unsigned long length, float sampleRate);
    Promise<AudioBuffer> startRendering();
    Promise<undefined> resume();
    Promise<undefined> suspend(double suspendTime);
    readonly attribute unsigned long length;
    attribute EventHandler oncomplete;
};

dictionary OfflineAudioContextOptions {
    unsigned long numberOfChannels = 1;
    required unsigned long length;
    required float sampleRate;
    (AudioContextRenderSizeCategory or unsigned long) renderSizeHint = "default";
};

[Exposed=Window]
interface OfflineAudioCompletionEvent : Event {
    constructor (DOMString type, OfflineAudioCompletionEventInit eventInitDict);
    readonly attribute AudioBuffer renderedBuffer;
};

dictionary OfflineAudioCompletionEventInit : EventInit {
    required AudioBuffer renderedBuffer;
};

[Exposed=Window]
interface AudioBuffer {
    constructor (AudioBufferOptions options);
    readonly attribute float sampleRate;
    readonly attribute unsigned long length;
    readonly attribute double duration;
    readonly attribute unsigned long numberOfChannels;
    Float32Array getChannelData (unsigned long channel);
    undefined copyFromChannel (Float32Array destination,
                               unsigned long channelNumber,
                               optional unsigned long bufferOffset = 0);
    undefined copyToChannel (Float32Array source,
                             unsigned long channelNumber,
                             optional unsigned long bufferOffset = 0);
};

dictionary AudioBufferOptions {
    unsigned long numberOfChannels = 1;
    required unsigned long length;
    required float sampleRate;
};

[Exposed=Window]
interface AudioNode : EventTarget {
    AudioNode connect (AudioNode destinationNode,
                       optional unsigned long output = 0,
                       optional unsigned long input = 0);
    undefined connect (AudioParam destinationParam, optional unsigned long output = 0);
    undefined disconnect ();
    undefined disconnect (unsigned long output);
    undefined disconnect (AudioNode destinationNode);
    undefined disconnect (AudioNode destinationNode, unsigned long output);
    undefined disconnect (AudioNode destinationNode,
                          unsigned long output,
                          unsigned long input);
    undefined disconnect (AudioParam destinationParam);
    undefined disconnect (AudioParam destinationParam, unsigned long output);
    readonly attribute BaseAudioContext context;
    readonly attribute unsigned long numberOfInputs;
    readonly attribute unsigned long numberOfOutputs;
    attribute unsigned long channelCount;
    attribute ChannelCountMode channelCountMode;
    attribute ChannelInterpretation channelInterpretation;
};

enum ChannelCountMode {
    "max",
    "clamped-max",
    "explicit"
};

enum ChannelInterpretation {
    "speakers",
    "discrete"
};

dictionary AudioNodeOptions {
    unsigned long channelCount;
    ChannelCountMode channelCountMode;
    ChannelInterpretation channelInterpretation;
};

enum AutomationRate {
    "a-rate",
    "k-rate"
};

[Exposed=Window]
interface AudioParam {
    attribute float value;
    attribute AutomationRate automationRate;
    readonly attribute float defaultValue;
    readonly attribute float minValue;
    readonly attribute float maxValue;
    AudioParam setValueAtTime (float value, double startTime);
    AudioParam linearRampToValueAtTime (float value, double endTime);
    AudioParam exponentialRampToValueAtTime (float value, double endTime);
    AudioParam setTargetAtTime (float target, double startTime, float timeConstant);
    AudioParam setValueCurveAtTime (sequence<float> values,
                                    double startTime,
                                    double duration);
    AudioParam cancelScheduledValues (double cancelTime);
    AudioParam cancelAndHoldAtTime (double cancelTime);
};

[Exposed=Window]
interface AudioScheduledSourceNode : AudioNode {
    attribute EventHandler onended;
    undefined start(optional double when = 0);
    undefined stop(optional double when = 0);
};

[Exposed=Window]
interface AnalyserNode : AudioNode {
    constructor (BaseAudioContext context, optional AnalyserOptions options = {});
    undefined getFloatFrequencyData (Float32Array array);
    undefined getByteFrequencyData (Uint8Array array);
    undefined getFloatTimeDomainData (Float32Array array);
    undefined getByteTimeDomainData (Uint8Array array);
    attribute unsigned long fftSize;
    readonly attribute unsigned long frequencyBinCount;
    attribute double minDecibels;
    attribute double maxDecibels;
    attribute double smoothingTimeConstant;
};

dictionary AnalyserOptions : AudioNodeOptions {
    unsigned long fftSize = 2048;
    double maxDecibels = -30;
    double minDecibels = -100;
    double smoothingTimeConstant = 0.8;
};

[Exposed=Window]
interface AudioBufferSourceNode : AudioScheduledSourceNode {
    constructor (BaseAudioContext context,
                 optional AudioBufferSourceOptions options = {});
    attribute AudioBuffer? buffer;
    readonly attribute AudioParam playbackRate;
    readonly attribute AudioParam detune;
    attribute boolean loop;
    attribute double loopStart;
    attribute double loopEnd;
    undefined start (optional double when = 0,
                     optional double offset,
                     optional double duration);
};

dictionary AudioBufferSourceOptions {
    AudioBuffer? buffer;
    float detune = 0;
    boolean loop = false;
    double loopEnd = 0;
    double loopStart = 0;
    float playbackRate = 1;
};

[Exposed=Window]
interface AudioDestinationNode : AudioNode {
    readonly attribute unsigned long maxChannelCount;
};

[Exposed=Window]
interface AudioListener {
    readonly attribute AudioParam positionX;
    readonly attribute AudioParam positionY;
    readonly attribute AudioParam positionZ;
    readonly attribute AudioParam forwardX;
    readonly attribute AudioParam forwardY;
    readonly attribute AudioParam forwardZ;
    readonly attribute AudioParam upX;
    readonly attribute AudioParam upY;
    readonly attribute AudioParam upZ;
    undefined setPosition (float x, float y, float z);
    undefined setOrientation (float x, float y, float z, float xUp, float yUp, float zUp);
};

[Exposed=Window]
interface AudioProcessingEvent : Event {
    constructor (DOMString type, AudioProcessingEventInit eventInitDict);
    readonly attribute double playbackTime;
    readonly attribute AudioBuffer inputBuffer;
    readonly attribute AudioBuffer outputBuffer;
};

dictionary AudioProcessingEventInit : EventInit {
    required double playbackTime;
    required AudioBuffer inputBuffer;
    required AudioBuffer outputBuffer;
};

enum BiquadFilterType {
    "lowpass",
    "highpass",
    "bandpass",
    "lowshelf",
    "highshelf",
    "peaking",
    "notch",
    "allpass"
};

[Exposed=Window]
interface BiquadFilterNode : AudioNode {
    constructor (BaseAudioContext context, optional BiquadFilterOptions options = {});
    attribute BiquadFilterType type;
    readonly attribute AudioParam frequency;
    readonly attribute AudioParam detune;
    readonly attribute AudioParam Q;
    readonly attribute AudioParam gain;
    undefined getFrequencyResponse (Float32Array frequencyHz,
                                    Float32Array magResponse,
                                    Float32Array phaseResponse);
};

dictionary BiquadFilterOptions : AudioNodeOptions {
    BiquadFilterType type = "lowpass";
    float Q = 1;
    float detune = 0;
    float frequency = 350;
    float gain = 0;
};

[Exposed=Window]
interface ChannelMergerNode : AudioNode {
    constructor (BaseAudioContext context, optional ChannelMergerOptions options = {});
};

dictionary ChannelMergerOptions : AudioNodeOptions {
    unsigned long numberOfInputs = 6;
};

[Exposed=Window]
interface ChannelSplitterNode : AudioNode {
    constructor (BaseAudioContext context, optional ChannelSplitterOptions options = {});
};

dictionary ChannelSplitterOptions : AudioNodeOptions {
    unsigned long numberOfOutputs = 6;
};

[Exposed=Window]
interface ConstantSourceNode : AudioScheduledSourceNode {
    constructor (BaseAudioContext context, optional ConstantSourceOptions options = {});
    readonly attribute AudioParam offset;
};

dictionary ConstantSourceOptions {
    float offset = 1;
};

[Exposed=Window]
interface ConvolverNode : AudioNode {
    constructor (BaseAudioContext context, optional ConvolverOptions options = {});
    attribute AudioBuffer? buffer;
    attribute boolean normalize;
};

dictionary ConvolverOptions : AudioNodeOptions {
    AudioBuffer? buffer;
    boolean disableNormalization = false;
};

[Exposed=Window]
interface DelayNode : AudioNode {
    constructor (BaseAudioContext context, optional DelayOptions options = {});
    readonly attribute AudioParam delayTime;
};

dictionary DelayOptions : AudioNodeOptions {
    double maxDelayTime = 1;
    double delayTime = 0;
};

[Exposed=Window]
interface DynamicsCompressorNode : AudioNode {
    constructor (BaseAudioContext context,
                 optional DynamicsCompressorOptions options = {});
    readonly attribute AudioParam threshold;
    readonly attribute AudioParam knee;
    readonly attribute AudioParam ratio;
    readonly attribute float reduction;
    readonly attribute AudioParam attack;
    readonly attribute AudioParam release;
};

dictionary DynamicsCompressorOptions : AudioNodeOptions {
    float attack = 0.003;
    float knee = 30;
    float ratio = 12;
    float release = 0.25;
    float threshold = -24;
};

[Exposed=Window]
interface GainNode : AudioNode {
    constructor (BaseAudioContext context, optional GainOptions options = {});
    readonly attribute AudioParam gain;
};

dictionary GainOptions : AudioNodeOptions {
    float gain = 1.0;
};

[Exposed=Window]
interface IIRFilterNode : AudioNode {
    constructor (BaseAudioContext context, IIRFilterOptions options);
    undefined getFrequencyResponse (Float32Array frequencyHz,
                                    Float32Array magResponse,
                                    Float32Array phaseResponse);
};

dictionary IIRFilterOptions : AudioNodeOptions {
    required sequence<double> feedforward;
    required sequence<double> feedback;
};

[Exposed=Window]
interface MediaElementAudioSourceNode : AudioNode {
    constructor (AudioContext context, MediaElementAudioSourceOptions options);
    [SameObject] readonly attribute HTMLMediaElement mediaElement;
};

dictionary MediaElementAudioSourceOptions {
    required HTMLMediaElement mediaElement;
};

[Exposed=Window]
interface MediaStreamAudioDestinationNode : AudioNode {
    constructor (AudioContext context, optional AudioNodeOptions options = {});
    readonly attribute MediaStream stream;
};

[Exposed=Window]
interface MediaStreamAudioSourceNode : AudioNode {
    constructor (AudioContext context, MediaStreamAudioSourceOptions options);
    [SameObject] readonly attribute MediaStream mediaStream;
};

dictionary MediaStreamAudioSourceOptions {
    required MediaStream mediaStream;
};

[Exposed=Window]
interface MediaStreamTrackAudioSourceNode : AudioNode {
    constructor (AudioContext context, MediaStreamTrackAudioSourceOptions options);
};

dictionary MediaStreamTrackAudioSourceOptions {
    required MediaStreamTrack mediaStreamTrack;
};

enum OscillatorType {
    "sine",
    "square",
    "sawtooth",
    "triangle",
    "custom"
};

[Exposed=Window]
interface OscillatorNode : AudioScheduledSourceNode {
    constructor (BaseAudioContext context, optional OscillatorOptions options = {});
    attribute OscillatorType type;
    readonly attribute AudioParam frequency;
    readonly attribute AudioParam detune;
    undefined setPeriodicWave (PeriodicWave periodicWave);
};

dictionary OscillatorOptions : AudioNodeOptions {
    OscillatorType type = "sine";
    float frequency = 440;
    float detune = 0;
    PeriodicWave periodicWave;
};

enum PanningModelType {
        "equalpower",
        "HRTF"
};

enum DistanceModelType {
    "linear",
    "inverse",
    "exponential"
};

[Exposed=Window]
interface PannerNode : AudioNode {
    constructor (BaseAudioContext context, optional PannerOptions options = {});
    attribute PanningModelType panningModel;
    readonly attribute AudioParam positionX;
    readonly attribute AudioParam positionY;
    readonly attribute AudioParam positionZ;
    readonly attribute AudioParam orientationX;
    readonly attribute AudioParam orientationY;
    readonly attribute AudioParam orientationZ;
    attribute DistanceModelType distanceModel;
    attribute double refDistance;
    attribute double maxDistance;
    attribute double rolloffFactor;
    attribute double coneInnerAngle;
    attribute double coneOuterAngle;
    attribute double coneOuterGain;
    undefined setPosition (float x, float y, float z);
    undefined setOrientation (float x, float y, float z);
};

dictionary PannerOptions : AudioNodeOptions {
    PanningModelType panningModel = "equalpower";
    DistanceModelType distanceModel = "inverse";
    float positionX = 0;
    float positionY = 0;
    float positionZ = 0;
    float orientationX = 1;
    float orientationY = 0;
    float orientationZ = 0;
    double refDistance = 1;
    double maxDistance = 10000;
    double rolloffFactor = 1;
    double coneInnerAngle = 360;
    double coneOuterAngle = 360;
    double coneOuterGain = 0;
};

[Exposed=Window]
interface PeriodicWave {
    constructor (BaseAudioContext context, optional PeriodicWaveOptions options = {});
};

dictionary PeriodicWaveConstraints {
    boolean disableNormalization = false;
};

dictionary PeriodicWaveOptions : PeriodicWaveConstraints {
    sequence<float> real;
    sequence<float> imag;
};

[Exposed=Window]
interface ScriptProcessorNode : AudioNode {
    attribute EventHandler onaudioprocess;
    readonly attribute long bufferSize;
};

[Exposed=Window]
interface StereoPannerNode : AudioNode {
    constructor (BaseAudioContext context, optional StereoPannerOptions options = {});
    readonly attribute AudioParam pan;
};

dictionary StereoPannerOptions : AudioNodeOptions {
    float pan = 0;
};

enum OverSampleType {
    "none",
    "2x",
    "4x"
};

[Exposed=Window]
interface WaveShaperNode : AudioNode {
    constructor (BaseAudioContext context, optional WaveShaperOptions options = {});
    attribute Float32Array? curve;
    attribute OverSampleType oversample;
};

dictionary WaveShaperOptions : AudioNodeOptions {
    sequence<float> curve;
    OverSampleType oversample = "none";
};

[Exposed=Window, SecureContext]
interface AudioWorklet : Worklet {
  readonly attribute MessagePort port;
};

callback AudioWorkletProcessorConstructor = AudioWorkletProcessor (object options);

[Global=(Worklet, AudioWorklet), Exposed=AudioWorklet]
interface AudioWorkletGlobalScope : WorkletGlobalScope {
    undefined registerProcessor (DOMString name,
                                               AudioWorkletProcessorConstructor processorCtor);
    readonly attribute unsigned long long currentFrame;
    readonly attribute double currentTime;
    readonly attribute float sampleRate;
    readonly attribute unsigned long renderQuantumSize;
    readonly attribute MessagePort port;
};

[Exposed=Window]
interface AudioParamMap {
    readonly maplike<DOMString, AudioParam>;
};

[Exposed=Window, SecureContext]
interface AudioWorkletNode : AudioNode {
    constructor (BaseAudioContext context, DOMString name,
               optional AudioWorkletNodeOptions options = {});
    readonly attribute AudioParamMap parameters;
    readonly attribute MessagePort port;
    attribute EventHandler onprocessorerror;
};

dictionary AudioWorkletNodeOptions : AudioNodeOptions {
    unsigned long numberOfInputs = 1;
    unsigned long numberOfOutputs = 1;
    sequence<unsigned long> outputChannelCount;
    record<DOMString, double> parameterData;
    object processorOptions;
};

[Exposed=AudioWorklet]
interface AudioWorkletProcessor {
    constructor ();
    readonly attribute MessagePort port;
};

callback AudioWorkletProcessCallback =
  boolean (FrozenArray<FrozenArray<Float32Array>> inputs,
           FrozenArray<FrozenArray<Float32Array>> outputs,
           object parameters);

dictionary AudioParamDescriptor {
    required DOMString name;
    float defaultValue = 0;
    float minValue = -3.4028235e38;
    float maxValue = 3.4028235e38;
    AutomationRate automationRate = "a-rate";
};
