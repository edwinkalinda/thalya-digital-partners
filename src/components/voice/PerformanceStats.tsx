
import { Clock } from "lucide-react";
import { LatencyStats } from "@/types/voice";

interface PerformanceStatsProps {
  latencyStats: LatencyStats | null;
}

export const PerformanceStats = ({ latencyStats }: PerformanceStatsProps) => {
  if (!latencyStats) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
      <h3 className="font-semibold text-green-800 mb-2 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        ⚡ Performances Gemini Pro
      </h3>
      <div className="grid grid-cols-4 gap-4 text-sm">
        {latencyStats.stt && (
          <div className="text-center">
            <div className="font-bold text-orange-600">{latencyStats.stt}ms</div>
            <div className="text-gray-600">STT</div>
          </div>
        )}
        {latencyStats.ai && (
          <div className="text-center">
            <div className="font-bold text-blue-600">{latencyStats.ai}ms</div>
            <div className="text-gray-600">Gemini</div>
          </div>
        )}
        {latencyStats.tts && (
          <div className="text-center">
            <div className="font-bold text-purple-600">{latencyStats.tts}ms</div>
            <div className="text-gray-600">TTS</div>
          </div>
        )}
        <div className="text-center">
          <div className={`font-bold ${latencyStats.total < 200 ? 'text-green-600' : latencyStats.total < 500 ? 'text-orange-600' : 'text-red-600'}`}>
            {latencyStats.total}ms
          </div>
          <div className="text-gray-600">Total</div>
        </div>
      </div>
    </div>
  );
};
