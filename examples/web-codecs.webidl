[Exposed=(Window,DedicatedWorker), SecureContext]
interface AudioDecoder : EventTarget {
  constructor(AudioDecoderInit init);

  readonly attribute CodecState state;
  readonly attribute unsigned long decodeQueueSize;
  attribute EventHandler ondequeue;

  undefined configure(AudioDecoderConfig config);
  undefined decode(EncodedAudioChunk chunk);
  Promise<undefined> flush();
  undefined reset();
  undefined close();

  static Promise<AudioDecoderSupport> isConfigSupported(AudioDecoderConfig config);
};

dictionary AudioDecoderInit {
  required AudioDataOutputCallback output;
  required WebCodecsErrorCallback error;
};

callback AudioDataOutputCallback = undefined(AudioData output);

[Exposed=(Window,DedicatedWorker), SecureContext]
interface VideoDecoder : EventTarget {
  constructor(VideoDecoderInit init);

  readonly attribute CodecState state;
  readonly attribute unsigned long decodeQueueSize;
  attribute EventHandler ondequeue;

  undefined configure(VideoDecoderConfig config);
  undefined decode(EncodedVideoChunk chunk);
  Promise<undefined> flush();
  undefined reset();
  undefined close();

  static Promise<VideoDecoderSupport> isConfigSupported(VideoDecoderConfig config);
};

dictionary VideoDecoderInit {
  required VideoFrameOutputCallback output;
  required WebCodecsErrorCallback error;
};

callback VideoFrameOutputCallback = undefined(VideoFrame output);

[Exposed=(Window,DedicatedWorker), SecureContext]
interface AudioEncoder : EventTarget {
  constructor(AudioEncoderInit init);

  readonly attribute CodecState state;
  readonly attribute unsigned long encodeQueueSize;
  attribute EventHandler ondequeue;

  undefined configure(AudioEncoderConfig config);
  undefined encode(AudioData data);
  Promise<undefined> flush();
  undefined reset();
  undefined close();

  static Promise<AudioEncoderSupport> isConfigSupported(AudioEncoderConfig config);
};

dictionary AudioEncoderInit {
  required EncodedAudioChunkOutputCallback output;
  required WebCodecsErrorCallback error;
};

callback EncodedAudioChunkOutputCallback =
    undefined (EncodedAudioChunk output,
               optional EncodedAudioChunkMetadata metadata = {});

dictionary EncodedAudioChunkMetadata {
  AudioDecoderConfig decoderConfig;
};

[Exposed=(Window,DedicatedWorker), SecureContext]
interface VideoEncoder : EventTarget {
  constructor(VideoEncoderInit init);

  readonly attribute CodecState state;
  readonly attribute unsigned long encodeQueueSize;
  attribute EventHandler ondequeue;

  undefined configure(VideoEncoderConfig config);
  undefined encode(VideoFrame frame, optional VideoEncoderEncodeOptions options = {});
  Promise<undefined> flush();
  undefined reset();
  undefined close();

  static Promise<VideoEncoderSupport> isConfigSupported(VideoEncoderConfig config);
};

dictionary VideoEncoderInit {
  required EncodedVideoChunkOutputCallback output;
  required WebCodecsErrorCallback error;
};

callback EncodedVideoChunkOutputCallback =
    undefined (EncodedVideoChunk chunk,
               optional EncodedVideoChunkMetadata metadata = {});

dictionary EncodedVideoChunkMetadata {
  VideoDecoderConfig decoderConfig;
  SvcOutputMetadata svc;
  BufferSource alphaSideData;
};

dictionary SvcOutputMetadata {
  unsigned long temporalLayerId;
};

dictionary AudioDecoderSupport {
  boolean supported;
  AudioDecoderConfig config;
};

dictionary VideoDecoderSupport {
  boolean supported;
  VideoDecoderConfig config;
};

dictionary AudioEncoderSupport {
  boolean supported;
  AudioEncoderConfig config;
};

dictionary VideoEncoderSupport {
  boolean supported;
  VideoEncoderConfig config;
};

dictionary AudioDecoderConfig {
  required DOMString codec;
  [EnforceRange] required unsigned long sampleRate;
  [EnforceRange] required unsigned long numberOfChannels;
  AllowSharedBufferSource description;
};

dictionary VideoDecoderConfig {
  required DOMString codec;
  AllowSharedBufferSource description;
  [EnforceRange] unsigned long codedWidth;
  [EnforceRange] unsigned long codedHeight;
  [EnforceRange] unsigned long displayAspectWidth;
  [EnforceRange] unsigned long displayAspectHeight;
  VideoColorSpaceInit colorSpace;
  HardwareAcceleration hardwareAcceleration = "no-preference";
  boolean optimizeForLatency;
  double rotation = 0;
  boolean flip = false;
};

dictionary AudioEncoderConfig {
  required DOMString codec;
  [EnforceRange] required unsigned long sampleRate;
  [EnforceRange] required unsigned long numberOfChannels;
  [EnforceRange] unsigned long long bitrate;
  BitrateMode bitrateMode = "variable";
};

dictionary VideoEncoderConfig {
  required DOMString codec;
  [EnforceRange] required unsigned long width;
  [EnforceRange] required unsigned long height;
  [EnforceRange] unsigned long displayWidth;
  [EnforceRange] unsigned long displayHeight;
  [EnforceRange] unsigned long long bitrate;
  double framerate;
  HardwareAcceleration hardwareAcceleration = "no-preference";
  AlphaOption alpha = "discard";
  DOMString scalabilityMode;
  VideoEncoderBitrateMode bitrateMode = "variable";
  LatencyMode latencyMode = "quality";
  DOMString contentHint;
};

enum HardwareAcceleration {
  "no-preference",
  "prefer-hardware",
  "prefer-software",
};

enum AlphaOption {
  "keep",
  "discard",
};

enum LatencyMode {
  "quality",
  "realtime"
};

dictionary VideoEncoderEncodeOptions {
  boolean keyFrame = false;
};

enum VideoEncoderBitrateMode {
  "constant",
  "variable",
  "quantizer"
};

enum CodecState {
  "unconfigured",
  "configured",
  "closed"
};

callback WebCodecsErrorCallback = undefined(DOMException error);

[Exposed=(Window,DedicatedWorker), Serializable]
interface EncodedAudioChunk {
  constructor(EncodedAudioChunkInit init);
  readonly attribute EncodedAudioChunkType type;
  readonly attribute long long timestamp;          // microseconds
  readonly attribute unsigned long long? duration; // microseconds
  readonly attribute unsigned long byteLength;

  undefined copyTo(AllowSharedBufferSource destination);
};

dictionary EncodedAudioChunkInit {
  required EncodedAudioChunkType type;
  [EnforceRange] required long long timestamp;    // microseconds
  [EnforceRange] unsigned long long duration;     // microseconds
  required AllowSharedBufferSource data;
  sequence<ArrayBuffer> transfer = [];
};

enum EncodedAudioChunkType {
    "key",
    "delta",
};

[Exposed=(Window,DedicatedWorker), Serializable]
interface EncodedVideoChunk {
  constructor(EncodedVideoChunkInit init);
  readonly attribute EncodedVideoChunkType type;
  readonly attribute long long timestamp;             // microseconds
  readonly attribute unsigned long long? duration;    // microseconds
  readonly attribute unsigned long byteLength;

  undefined copyTo(AllowSharedBufferSource destination);
};

dictionary EncodedVideoChunkInit {
  required EncodedVideoChunkType type;
  [EnforceRange] required long long timestamp;        // microseconds
  [EnforceRange] unsigned long long duration;         // microseconds
  required AllowSharedBufferSource data;
  sequence<ArrayBuffer> transfer = [];
};

enum EncodedVideoChunkType {
    "key",
    "delta",
};

[Exposed=(Window,DedicatedWorker), Serializable, Transferable]
interface AudioData {
  constructor(AudioDataInit init);

  readonly attribute AudioSampleFormat? format;
  readonly attribute float sampleRate;
  readonly attribute unsigned long numberOfFrames;
  readonly attribute unsigned long numberOfChannels;
  readonly attribute unsigned long long duration;  // microseconds
  readonly attribute long long timestamp;          // microseconds

  unsigned long allocationSize(AudioDataCopyToOptions options);
  undefined copyTo(AllowSharedBufferSource destination, AudioDataCopyToOptions options);
  AudioData clone();
  undefined close();
};

dictionary AudioDataInit {
  required AudioSampleFormat format;
  required float sampleRate;
  [EnforceRange] required unsigned long numberOfFrames;
  [EnforceRange] required unsigned long numberOfChannels;
  [EnforceRange] required long long timestamp;  // microseconds
  required BufferSource data;
  sequence<ArrayBuffer> transfer = [];
};

dictionary AudioDataCopyToOptions {
  [EnforceRange] required unsigned long planeIndex;
  [EnforceRange] unsigned long frameOffset = 0;
  [EnforceRange] unsigned long frameCount;
  AudioSampleFormat format;
};

enum AudioSampleFormat {
  "u8",
  "s16",
  "s32",
  "f32",
  "u8-planar",
  "s16-planar",
  "s32-planar",
  "f32-planar",
};

[Exposed=(Window,DedicatedWorker), Serializable, Transferable]
interface VideoFrame {
  constructor(CanvasImageSource image, optional VideoFrameInit init = {});
  constructor(AllowSharedBufferSource data, VideoFrameBufferInit init);

  readonly attribute VideoPixelFormat? format;
  readonly attribute unsigned long codedWidth;
  readonly attribute unsigned long codedHeight;
  readonly attribute DOMRectReadOnly? codedRect;
  readonly attribute DOMRectReadOnly? visibleRect;
  readonly attribute double rotation;
  readonly attribute boolean flip;
  readonly attribute unsigned long displayWidth;
  readonly attribute unsigned long displayHeight;
  readonly attribute unsigned long long? duration;  // microseconds
  readonly attribute long long timestamp;           // microseconds
  readonly attribute VideoColorSpace colorSpace;

  VideoFrameMetadata metadata();

  unsigned long allocationSize(
      optional VideoFrameCopyToOptions options = {});
  Promise<sequence<PlaneLayout>> copyTo(
      AllowSharedBufferSource destination,
      optional VideoFrameCopyToOptions options = {});
  VideoFrame clone();
  undefined close();
};

dictionary VideoFrameInit {
  unsigned long long duration;  // microseconds
  long long timestamp;          // microseconds
  AlphaOption alpha = "keep";

  // Default matches image. May be used to efficiently crop. Will trigger
  // new computation of displayWidth and displayHeight using image's pixel
  // aspect ratio unless an explicit displayWidth and displayHeight are given.
  DOMRectInit visibleRect;

  double rotation = 0;
  boolean flip = false;

  // Default matches image unless visibleRect is provided.
  [EnforceRange] unsigned long displayWidth;
  [EnforceRange] unsigned long displayHeight;

  VideoFrameMetadata metadata;
};

dictionary VideoFrameBufferInit {
  required VideoPixelFormat format;
  required [EnforceRange] unsigned long codedWidth;
  required [EnforceRange] unsigned long codedHeight;
  required [EnforceRange] long long timestamp;  // microseconds
  [EnforceRange] unsigned long long duration;  // microseconds

  // Default layout is tightly-packed.
  sequence<PlaneLayout> layout;

  // Default visible rect is coded size positioned at (0,0)
  DOMRectInit visibleRect;

  double rotation = 0;
  boolean flip = false;

  // Default display dimensions match visibleRect.
  [EnforceRange] unsigned long displayWidth;
  [EnforceRange] unsigned long displayHeight;

  VideoColorSpaceInit colorSpace;

  sequence<ArrayBuffer> transfer = [];

  VideoFrameMetadata metadata;
};

dictionary VideoFrameMetadata {
  // Possible members are recorded in the VideoFrame Metadata Registry.
};

dictionary VideoFrameCopyToOptions {
  DOMRectInit rect;
  sequence<PlaneLayout> layout;
  VideoPixelFormat format;
  PredefinedColorSpace colorSpace;
};

dictionary PlaneLayout {
  [EnforceRange] required unsigned long offset;
  [EnforceRange] required unsigned long stride;
};

enum VideoPixelFormat {
  // 4:2:0 Y, U, V
  "I420",
  "I420P10",
  "I420P12",
  // 4:2:0 Y, U, V, A
  "I420A",
  "I420AP10",
  "I420AP12",
  // 4:2:2 Y, U, V
  "I422",
  "I422P10",
  "I422P12",
  // 4:2:2 Y, U, V, A
  "I422A",
  "I422AP10",
  "I422AP12",
  // 4:4:4 Y, U, V
  "I444",
  "I444P10",
  "I444P12",
  // 4:4:4 Y, U, V, A
  "I444A",
  "I444AP10",
  "I444AP12",
  // 4:2:0 Y, UV
  "NV12",
  // 4:4:4 RGBA
  "RGBA",
  // 4:4:4 RGBX (opaque)
  "RGBX",
  // 4:4:4 BGRA
  "BGRA",
  // 4:4:4 BGRX (opaque)
  "BGRX",
};

[Exposed=(Window,DedicatedWorker)]
interface VideoColorSpace {
  constructor(optional VideoColorSpaceInit init = {});

  readonly attribute VideoColorPrimaries? primaries;
  readonly attribute VideoTransferCharacteristics? transfer;
  readonly attribute VideoMatrixCoefficients? matrix;
  readonly attribute boolean? fullRange;

  [Default] VideoColorSpaceInit toJSON();
};

dictionary VideoColorSpaceInit {
  VideoColorPrimaries? primaries = null;
  VideoTransferCharacteristics? transfer = null;
  VideoMatrixCoefficients? matrix = null;
  boolean? fullRange = null;
};

enum VideoColorPrimaries {
  "bt709",
  "bt470bg",
  "smpte170m",
  "bt2020",
  "smpte432",
};

enum VideoTransferCharacteristics {
  "bt709",
  "smpte170m",
  "iec61966-2-1",
  "linear",
  "pq",
  "hlg",
};

enum VideoMatrixCoefficients {
  "rgb",
  "bt709",
  "bt470bg",
  "smpte170m",
  "bt2020-ncl",
};

[Exposed=(Window,DedicatedWorker), SecureContext]
interface ImageDecoder {
  constructor(ImageDecoderInit init);

  readonly attribute DOMString type;
  readonly attribute boolean complete;
  readonly attribute Promise<undefined> completed;
  readonly attribute ImageTrackList tracks;

  Promise<ImageDecodeResult> decode(optional ImageDecodeOptions options = {});
  undefined reset();
  undefined close();

  static Promise<boolean> isTypeSupported(DOMString type);
};


typedef (AllowSharedBufferSource or ReadableStream) ImageBufferSource;
dictionary ImageDecoderInit {
  required DOMString type;
  required ImageBufferSource data;
  ColorSpaceConversion colorSpaceConversion = "default";
  [EnforceRange] unsigned long desiredWidth;
  [EnforceRange] unsigned long desiredHeight;
  boolean preferAnimation;
  sequence<ArrayBuffer> transfer = [];
};


dictionary ImageDecodeOptions {
  [EnforceRange] unsigned long frameIndex = 0;
  boolean completeFramesOnly = true;
};


dictionary ImageDecodeResult {
  required VideoFrame image;
  required boolean complete;
};


[Exposed=(Window,DedicatedWorker)]
interface ImageTrackList {
  getter ImageTrack (unsigned long index);

  readonly attribute Promise<undefined> ready;
  readonly attribute unsigned long length;
  readonly attribute long selectedIndex;
  readonly attribute ImageTrack? selectedTrack;
};


[Exposed=(Window,DedicatedWorker)]
interface ImageTrack {
  readonly attribute boolean animated;
  readonly attribute unsigned long frameCount;
  readonly attribute unrestricted float repetitionCount;
  attribute boolean selected;
};
