import React, { useState, useRef, useEffect } from 'react';
import {
  Monitor,
  Maximize2,
  Minimize2,
  Terminal,
  Code2,
  Video,
  VideoOff,
  Flame,
  Lightbulb,
  Rocket,
  ThumbsUp,
  Brain,
  Share2,
  Eye,
  Settings2,
  Disc,
  Play,
  Pause
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
}

export const ScreenShareView: React.FC<{
  currentUserName: string;
  roomTopic: string;
}> = ({ currentUserName, roomTopic }) => {
  const [activeStream, setActiveStream] = useState<'aviral' | 'ajay' | 'user'>('aviral');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLaserPointer, setIsLaserPointer] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [userStream, setUserStream] = useState<MediaStream | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Stop user media stream on unmount
  useEffect(() => {
    return () => {
      if (userStream) {
        userStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [userStream]);

  // Request actual screen sharing from browser
  const handleStartRealScreenShare = async () => {
    if (isLiveStreaming && userStream) {
      userStream.getTracks().forEach((t) => t.stop());
      setUserStream(null);
      setIsLiveStreaming(false);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setUserStream(stream);
        setIsLiveStreaming(true);
        setActiveStream('user');
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        stream.getVideoTracks()[0].onended = () => {
          setIsLiveStreaming(false);
          setUserStream(null);
        };
      } else {
        // Fallback simulation
        setIsLiveStreaming(!isLiveStreaming);
        setActiveStream('user');
      }
    } catch (err) {
      // Permission denied or cancelled; graceful simulated mode
      setIsLiveStreaming(!isLiveStreaming);
      setActiveStream('user');
    }
  };

  const handleTriggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = 30 + Math.random() * 40; // 30% to 70% width
    setReactions((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2400);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLaserPointer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLaserPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full bg-[#070a10] border border-[#1a2333] rounded-card overflow-hidden relative select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Top Stream Control Bar */}
      <div className="h-13 bg-[#0d121d] border-b border-[#182030] px-3 sm:px-4 py-2 flex items-center justify-between flex-wrap gap-2 z-20">
        {/* Stream Source Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#111724] p-1 rounded-inner border border-[#1b2538]">
          <button
            onClick={() => setActiveStream('aviral')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeStream === 'aviral'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Aviral's VS Code</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </button>

          <button
            onClick={() => setActiveStream('ajay')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeStream === 'ajay'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Ajay's Terminal</span>
          </button>

          <button
            onClick={() => setActiveStream('user')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeStream === 'user'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>My Screen</span>
            {isLiveStreaming && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping ml-1" />
            )}
          </button>
        </div>

        {/* Presenter Metadata & Quality */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-[#131b2c] border border-[#1f2d44] text-[11px] text-teal-300">
            1080p • 60 FPS
          </span>
          <span className="text-[11px] text-slate-500">Latency: 14ms</span>
        </div>

        {/* Action Buttons: Laser, Share Screen, Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLaserPointer(!isLaserPointer)}
            className={`p-1.5 sm:px-2 sm:py-1 rounded-inner text-xs flex items-center gap-1.5 border transition-colors ${
              isLaserPointer
                ? 'bg-rose-950/80 text-rose-300 border-rose-600/70'
                : 'bg-[#111724] border-[#1b2538] text-slate-400 hover:text-white'
            }`}
            title="Toggle Laser Pointer Annotation"
          >
            <Disc className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Laser Pointer</span>
          </button>

          <button
            onClick={handleStartRealScreenShare}
            className={`px-3 py-1 rounded-inner text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isLiveStreaming
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-teal-500 hover:bg-teal-400 text-[#070b13]'
            }`}
          >
            {isLiveStreaming ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
            <span>{isLiveStreaming ? 'Stop Sharing' : 'Share Screen'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-inner bg-[#111724] border border-[#1b2538] text-slate-400 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Stream Display Area */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setLaserPos(null)}
        className="relative flex-1 bg-[#090d16] flex items-center justify-center overflow-hidden p-3 sm:p-5"
      >
        {/* Floating Laser Indicator */}
        {isLaserPointer && laserPos && (
          <div
            style={{ left: `${laserPos.x}px`, top: `${laserPos.y}px` }}
            className="absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-4 h-4 rounded-full bg-rose-500/80 shadow-[0_0_15px_#f43f5e] animate-ping" />
            <div className="w-2.5 h-2.5 rounded-full bg-rose-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}

        {/* Floating Reactions Waterfall */}
        {reactions.map((r) => (
          <div
            key={r.id}
            style={{ left: `${r.x}%` }}
            className="absolute bottom-6 z-40 text-2xl animate-[floatUp_2.2s_ease-out_forwards] pointer-events-none select-none"
          >
            {r.emoji}
          </div>
        ))}

        {/* STREAM CONTENT 1: Aviral's VS Code */}
        {activeStream === 'aviral' && (
          <div className="w-full max-w-4xl h-full bg-[#0c101a] border border-[#182236] rounded-lg shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
            {/* Editor Tab Bar */}
            <div className="h-8 bg-[#101524] border-b border-[#182030] px-3 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 inline-block" />
                <div className="ml-3 px-3 py-1 bg-[#0c101a] text-teal-300 border-t border-teal-500 rounded-t flex items-center gap-1.5 font-semibold">
                  <span>hash_join_optimizer.py</span>
                  <span className="text-[9px] text-slate-500">M</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                <span>UTF-8</span>
                <span>Python 3.12</span>
                <span className="text-teal-400 font-semibold">Aviral Maurya (Presenter)</span>
              </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-4 overflow-y-auto leading-relaxed text-slate-300 bg-[#0a0e17]">
              <div className="text-slate-600 mb-2"># GuildUp SQL Labyrinth - Dynamic Query Plan Optimizer</div>
              <div><span className="text-purple-400">from</span> dataclasses <span className="text-purple-400">import</span> dataclass</div>
              <div><span className="text-purple-400">from</span> typing <span className="text-purple-400">import</span> List, Dict, Any, Optional</div>
              <div className="my-2" />
              <div><span className="text-amber-400">@dataclass</span></div>
              <div><span className="text-blue-400">class</span> <span className="text-teal-300 font-bold">QueryPlanNode</span>:</div>
              <div className="pl-6">operation: <span className="text-cyan-300">str</span>  <span className="text-slate-500"># "HASH JOIN" | "INDEX SCAN" | "SEQ SCAN"</span></div>
              <div className="pl-6">estimated_cost: <span className="text-cyan-300">float</span></div>
              <div className="pl-6">rows_produced: <span className="text-cyan-300">int</span></div>
              <div className="my-2" />
              <div><span className="text-blue-400">def</span> <span className="text-teal-300 font-bold">optimize_join_order</span>(relations: List[<span className="text-cyan-300">dict</span>]) -&gt; <span className="text-teal-300">QueryPlanNode</span>:</div>
              <div className="pl-6 text-slate-500">"""Evaluates cheapest join permutation to avoid Cartesian explosion"""</div>
              <div className="pl-6">sorted_tables = sorted(relations, key=<span className="text-purple-400">lambda</span> r: r[<span className="text-emerald-400">'cardinality'</span>])</div>
              <div className="pl-6"><span className="text-purple-400">if</span> <span className="text-cyan-300">len</span>(sorted_tables) &lt;= 1:</div>
              <div className="pl-12"><span className="text-purple-400">return</span> QueryPlanNode(operation=<span className="text-emerald-400">"INDEX SCAN"</span>, estimated_cost=1.2, rows_produced=100)</div>
              <div className="pl-6">hash_table = {}</div>
              <div className="pl-6 text-slate-500"># Phase 2: Build Hash Table in Memory (O(N) vs Nested Loop O(N*M))</div>
              <div className="pl-6"><span className="text-purple-400">for</span> row <span className="text-purple-400">in</span> sorted_tables[0][<span className="text-emerald-400">'rows'</span>]:</div>
              <div className="pl-12">hash_table[row[<span className="text-emerald-400">'foreign_key'</span>]] = row</div>
              <div className="pl-6 text-teal-400 flex items-center">
                <span>&gt;&gt; Cursor active on line 24</span>
                <span className="w-1.5 h-4 bg-teal-400 ml-1 animate-pulse" />
              </div>
            </div>

            {/* Simulated Live Terminal */}
            <div className="h-28 bg-[#070a12] border-t border-[#182030] p-3 text-[11px] overflow-y-auto">
              <div className="text-slate-500 mb-1 flex items-center justify-between">
                <span>TERMINAL - zsh (Python venv)</span>
                <span className="text-emerald-400 flex items-center gap-1 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Tests Passing (14/14)
                </span>
              </div>
              <div className="text-teal-400">$ pytest tests/test_joins.py --benchmark</div>
              <div className="text-slate-400">tests/test_joins.py::test_hash_join_perf <span className="text-emerald-400 font-bold">PASSED [0.04s]</span></div>
              <div className="text-slate-400">tests/test_joins.py::test_b_tree_indexing <span className="text-emerald-400 font-bold">PASSED [0.02s]</span></div>
              <div className="text-slate-500 mt-1">=== 14 passed in 0.38s - Query latency reduced by 74% ===</div>
            </div>
          </div>
        )}

        {/* STREAM CONTENT 2: Ajay's DevOps Terminal */}
        {activeStream === 'ajay' && (
          <div className="w-full max-w-4xl h-full bg-[#080b12] border border-[#1b2538] rounded-lg shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
            <div className="h-8 bg-[#0f1422] border-b border-[#182030] px-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-amber-400 font-semibold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                Ajay Gurjar • DevOps & Docker CI/CD Terminal
              </span>
              <span className="text-slate-500">git branch: feature/query-cache</span>
            </div>
            <div className="flex-1 p-4 bg-[#06080e] text-slate-300 leading-relaxed overflow-y-auto">
              <div className="text-amber-300">$ git rebase -i HEAD~3</div>
              <div className="text-slate-400">Rebasing (3/3): squash commit e4a91c "Add Redis read-through query cache"</div>
              <div className="text-emerald-400">Successfully rebased and updated refs/heads/feature/query-cache.</div>
              <div className="my-2" />
              <div className="text-amber-300">$ docker-compose up --build -d</div>
              <div className="text-slate-400">Building query_engine...</div>
              <div className="text-slate-400">Step 1/6 : FROM postgres:16-alpine</div>
              <div className="text-slate-400">Step 2/6 : COPY schema.sql /docker-entrypoint-initdb.d/</div>
              <div className="text-emerald-400">✔ Network guildup_internal  Created</div>
              <div className="text-emerald-400">✔ Container guildup_postgres  Started (Port 5432)</div>
              <div className="text-emerald-400">✔ Container redis_cache       Started (Port 6379)</div>
              <div className="my-2" />
              <div className="text-teal-400">$ ./scripts/benchmark_cluster.sh</div>
              <div className="text-slate-300">Throughput: 14,820 req/sec | 99th percentile: 3.1ms</div>
              <div className="text-teal-400 animate-pulse mt-2">&gt; Ajay is compiling query caching telemetry...</div>
            </div>
          </div>
        )}

        {/* STREAM CONTENT 3: My Screen (Live capture or Presenter scratchpad) */}
        {activeStream === 'user' && (
          <div className="w-full max-w-4xl h-full bg-[#0c101a] border border-[#1b2538] rounded-lg shadow-2xl flex flex-col overflow-hidden font-mono text-xs">
            {isLiveStreaming && userStream ? (
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded text-rose-400 border border-rose-500/40 text-[11px] font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Broadcasting Your Screen Live</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center p-8 text-center bg-[#090d16]">
                <div className="w-14 h-14 rounded-2xl bg-[#111726] border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 shadow-lg">
                  <Monitor className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Share Your Screen with the Chamber</h3>
                <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">
                  Stream your code editor, terminal, browser, or slides with low latency directly to all room participants.
                </p>
                <button
                  onClick={handleStartRealScreenShare}
                  className="px-5 py-2.5 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Start Live Screen Share</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Floating Quick Reaction Toolbar */}
        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 bg-[#0c111c]/90 border border-[#1b2538] p-1.5 rounded-full shadow-2xl backdrop-blur-md">
          <button
            onClick={() => handleTriggerReaction('🔥')}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-base transition-transform hover:scale-125"
            title="Fire"
          >
            🔥
          </button>
          <button
            onClick={() => handleTriggerReaction('💡')}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-base transition-transform hover:scale-125"
            title="Great Idea"
          >
            💡
          </button>
          <button
            onClick={() => handleTriggerReaction('🚀')}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-base transition-transform hover:scale-125"
            title="Rocket"
          >
            🚀
          </button>
          <button
            onClick={() => handleTriggerReaction('👏')}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-base transition-transform hover:scale-125"
            title="Clap"
          >
            👏
          </button>
          <button
            onClick={() => handleTriggerReaction('🧠')}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-base transition-transform hover:scale-125"
            title="Big Brain"
          >
            🧠
          </button>
        </div>
      </div>
    </div>
  );
};
