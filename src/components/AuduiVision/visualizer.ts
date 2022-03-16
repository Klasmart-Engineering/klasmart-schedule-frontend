interface VisualizerProps {
  draw: any;
  size: any;
  volume: any;
}
export default class Visualizer {
  source: any;
  count: number;
  ac: AudioContext;
  size: any;
  gainNode: GainNode;
  analyser: AnalyserNode;
  rafId: number;
  draw: any;
  constructor({ draw, size, volume }: VisualizerProps) {
    this.source = null;
    this.count = 0;
    this.ac = new window.AudioContext();
    this.draw = draw;
    this.size = size;
    this.rafId = 0;

    this.gainNode = this.ac.createGain();
    this.gainNode.gain.value = volume;
    this.gainNode.connect(this.ac.destination);
    this.analyser = this.ac.createAnalyser();
    this.analyser.fftSize = this.size * 2;
    this.analyser.connect(this.gainNode);
  }

  load = (url: string | URL, callback: { (arrayBuffer: any): void; (arg0: any): void }) => {
    const xhr = new XMLHttpRequest();
    xhr.abort();
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      callback(xhr.response);
    };
    xhr.send();
  };

  play = (src: string | URL | ArrayBuffer, start: number) => {
    const n = ++this.count;
    this.source && this.source.stop();
    const decodeCallback = (buffer: AudioBuffer | null) => {
      if (n !== this.count) return;
      const bufferSource: AudioBufferSourceNode = this.ac.createBufferSource();
      // AudioBuffer数据赋值给buffer属性
      bufferSource.buffer = buffer;
      bufferSource.connect(this.analyser);
      bufferSource.loop = true;
      bufferSource.start(this.ac.currentTime, start, (buffer?.duration as number) - start)
      this.source = bufferSource;
      this.visualize();
    };
    if (src instanceof ArrayBuffer) {
      this.ac.decodeAudioData(src, decodeCallback);
    } else {
      this.load(src, (arrayBuffer) => {
        this.ac.decodeAudioData(arrayBuffer, decodeCallback);
      });
    }
  };

  updateVolume = (vol: number) => {
    this.gainNode.gain.value = vol;
  };

  visualize = () => {
    // 用于存放音频数据的数组，长度是fftsize的一半
    const arr = new Uint8Array(this.analyser.frequencyBinCount);
    const raf = window.requestAnimationFrame;
    const fn = () => {
      // 将音频频域数据复制到传入的Uint8Array数组
      this.analyser.getByteFrequencyData(arr);
      this.draw(arr); //频域作为参数传入绘制函数draw
      this.rafId = raf(fn);
    };
    fn();
  };

  pause = () => {
    this.ac.suspend();
    window.cancelAnimationFrame(this.rafId);
  };

  resume = () => {
    this.ac.resume();
    this.visualize();
  };

  stop = () => {
    this.ac.close();
    window.cancelAnimationFrame(this.rafId);
  };
}
