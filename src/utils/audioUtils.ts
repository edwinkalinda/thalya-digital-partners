
export function createBlob(pcmData: Float32Array, sampleRate: number = 16000): Blob {
  const buffer = new ArrayBuffer(pcmData.length * 2);
  const view = new DataView(buffer);
  
  // Convert float32 to int16
  for (let i = 0; i < pcmData.length; i++) {
    const sample = Math.max(-1, Math.min(1, pcmData[i]));
    view.setInt16(i * 2, sample * 0x7FFF, true);
  }
  
  return new Blob([buffer], { type: 'audio/pcm' });
}

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(audioContext: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(
      arrayBuffer,
      (audioBuffer) => resolve(audioBuffer),
      (error) => reject(error)
    );
  });
}

export function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s * 0x7FFF, true);
  }
  
  return buffer;
}
