'use client';
import { useEffect, useRef, useState } from 'react';
import { Volume2, X } from 'lucide-react';

const VIDEO_SOURCES = [
  'https://videos.pexels.com/video-files/4608280/4608280-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/4608280/4608280-uhd_2560_1440_25fps.mp4'
];

const lines = [
  'Гроші — найдешевший спосіб перевірити людей на вірність.',
  'Зрада приходить обличчям того, з ким ділив хліб.',
  'На дні видно головне: руку того, хто залишився.',
  'Тримайся за нього. Все інше — пил на вітрі.'
];

export function IntroGate() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [line, setLine] = useState(0);

  useEffect(() => {
    setVisible(sessionStorage.getItem('hobotnia-intro-seen') !== '1');
  }, []);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    let frame = 0;
    let disposed = false;
    let renderer: import('three').WebGLRenderer | undefined;
    let removeResize: (() => void) | undefined;

    import('three').then((THREE) => {
      if (!canvasRef.current || disposed) return;
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x05070c, 8, 28);
      const camera = new THREE.PerspectiveCamera(42, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 100);
      camera.position.set(0, 1.1, 12);
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight, false);
      const light = new THREE.DirectionalLight(0x82ffe6, 2.8);
      light.position.set(2, 4, 8);
      scene.add(light, new THREE.AmbientLight(0x375066, 1.6));
      const group = new THREE.Group();
      const letters = 'ХОБОТНЯ'.split('');
      letters.forEach((letter, index) => {
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = 512;
        textureCanvas.height = 512;
        const context = textureCanvas.getContext('2d')!;
        context.fillStyle = '#0b1018';
        context.fillRect(0, 0, 512, 512);
        context.fillStyle = '#76f7df';
        context.font = '900 310px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.shadowColor = '#ffffff';
        context.shadowBlur = 28;
        context.fillText(letter, 256, 272);
        const texture = new THREE.CanvasTexture(textureCanvas);
        const material = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.55, roughness: 0.22, emissive: 0x123b37, emissiveIntensity: 0.9 });
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.55, 0.36), material);
        mesh.position.x = (index - (letters.length - 1) / 2) * 1.18;
        mesh.rotation.y = (index - 3) * 0.12;
        group.add(mesh);
      });
      scene.add(group);

      const resize = () => {
        if (!canvasRef.current) return;
        camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight, false);
      };
      window.addEventListener('resize', resize);
      removeResize = () => window.removeEventListener('resize', resize);
      const animate = () => {
        if (disposed) return;
        frame += 0.012;
        group.rotation.y = Math.sin(frame) * 0.18;
        group.rotation.x = Math.cos(frame * 0.7) * 0.06;
        group.position.y = Math.sin(frame * 1.8) * 0.18;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();
    });

    return () => {
      disposed = true;
      removeResize?.();
      renderer?.dispose();
    };
  }, [visible]);

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(() => setLine((value) => Math.min(value + 1, lines.length - 1)), 2200);
    return () => window.clearInterval(timer);
  }, [started]);

  const begin = async () => {
    setStarted(true);
    await videoRef.current?.play().catch(() => undefined);
    const AudioContextCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioContextCtor();
    const bass = context.createOscillator();
    const pulse = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    bass.type = 'sawtooth';
    bass.frequency.value = 52;
    pulse.type = 'square';
    pulse.frequency.value = 104;
    filter.type = 'lowpass';
    filter.frequency.value = 480;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.4);
    bass.connect(filter);
    pulse.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    bass.start();
    pulse.start();
    audioRef.current = context;
  };

  const enter = () => {
    sessionStorage.setItem('hobotnia-intro-seen', '1');
    audioRef.current?.close();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black text-white">
      <video ref={videoRef} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${started ? 'opacity-55' : 'opacity-20'}`} muted loop playsInline preload="metadata">
        {VIDEO_SOURCES.map((src) => <source key={src} src={src} type="video/mp4" />)}
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(118,247,223,0.16),rgba(0,0,0,0.88)_62%)]" />
      <canvas ref={canvasRef} className="absolute left-1/2 top-[12vh] h-[28vh] w-[min(980px,96vw)] -translate-x-1/2" />
      <div className="relative z-10 flex min-h-screen flex-col justify-end px-5 pb-8 sm:px-10 sm:pb-12">
        <div className="max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-brand">Хоботня відкривається</p>
          <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">{started ? lines[line] : 'Перед входом — короткий тест на вірність.'}</h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">Інтро запускає відео швидкості, 3D-назву та темний саундтрек після натискання.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {!started && <button onClick={begin} className="inline-flex items-center gap-2 bg-brand px-5 py-3 font-bold text-ink"><Volume2 size={18} /> Запустити інтро</button>}
            {started && <button onClick={enter} className="bg-brand px-5 py-3 font-bold text-ink">Увійти на сайт</button>}
            <button onClick={enter} className="inline-flex items-center gap-2 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"><X size={18} /> Пропустити</button>
          </div>
        </div>
      </div>
    </div>
  );
}
