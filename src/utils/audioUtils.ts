
// Utility functions for audio processing
export const createBlob = (data: ArrayBuffer, type: string = 'audio/wav'): Blob => {
  return new Blob([data], { type });
};

export const decode = (base64String: string): ArrayBuffer => {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const decodeAudioData = async (audioContext: AudioContext, arrayBuffer: ArrayBuffer): Promise<AudioBuffer> => {
  return await audioContext.decodeAudioData(arrayBuffer);
};

export const floatTo16BitPCM = (float32Array: Float32Array): ArrayBuffer => {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return buffer;
};
