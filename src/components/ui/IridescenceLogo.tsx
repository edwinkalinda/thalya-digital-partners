import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  
  // Orb-like chromatic effect with blue/purple tones
  vec3 col = vec3(
    cos(uv.x * d * 1.6) * 0.5 + 0.4,
    cos(uv.y * a * 1.4) * 0.45 + 0.5,
    cos((uv.x + uv.y) * (d + a) * 1.2) * 0.6 + 0.7
  );
  
  // Iridescent shifts with orb-like colors
  float phase = sin(d * 0.5) * 0.5 + 0.5;
  vec3 iridescent = vec3(
    0.3 + 0.4 * cos(phase * 6.28 + 0.0),
    0.4 + 0.35 * cos(phase * 6.28 + 2.09),
    0.7 + 0.3 * cos(phase * 6.28 + 4.18)
  );
  
  // Enhanced blending for more vibrant effect
  col = mix(col * uColor, iridescent, 0.65);
  
  // Subtle metallic accents
  float grey = (col.r + col.g + col.b) * 0.33;
  vec3 greyAccent = vec3(0.55, 0.57, 0.65);
  col = mix(col, greyAccent, grey * 0.2);
  
  // Minimal desaturation to keep vibrancy
  float luminance = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(luminance), 0.08);
  
  gl_FragColor = vec4(col, 1.0);
}
`;

interface IridescenceLogoProps {
  size?: number;
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

export default function IridescenceLogo({
  size = 80,
  color = [0.4, 0.6, 0.9], // Orb-like blue/purple tones
  speed = 1.6, // Slightly faster like the orb
  amplitude = 0.3, // More reactive
  mouseReact = true
}: IridescenceLogoProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer();
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    let program: Program;

    function resize() {
      const scale = 1;
      renderer.setSize(size * scale, size * scale);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height
        );
      }
    }
    window.addEventListener("resize", resize, false);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
          ),
        },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number;

    function update(t: number) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
      program.uniforms.uMouse.value[0] = x;
      program.uniforms.uMouse.value[1] = y;
    }
    if (mouseReact) {
      ctn.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (mouseReact) {
        ctn.removeEventListener("mousemove", handleMouseMove);
      }
      if (ctn.contains(gl.canvas)) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, speed, amplitude, mouseReact, size]);

  return (
    <div
      ref={ctnDom}
      className="inline-block rounded-lg overflow-hidden"
      style={{ width: size, height: size }}
    />
  );
}
