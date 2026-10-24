import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  Eraser,
  Square,
  Circle,
  Type,
  Trash2,
  Download,
  RotateCcw,
  RotateCw,
  Plus,
  StickyNote,
  Highlighter,
  Minus,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface StickyNoteItem {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

export const Whiteboard: React.FC<{ roomTopic: string }> = ({ roomTopic }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Drawing tools & settings
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser' | 'rect' | 'circle' | 'line'>('pen');
  const [strokeColor, setStrokeColor] = useState<string>('#14b8a6');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Sticky notes
  const [stickyNotes, setStickyNotes] = useState<StickyNoteItem[]>([
    {
      id: 'sn-1',
      x: 60,
      y: 60,
      text: '📌 Focus Goal: SQL Query Plan & Index Scan vs Hash Join',
      color: 'bg-amber-950/80 border-amber-600/60 text-amber-200'
    },
    {
      id: 'sn-2',
      x: 380,
      y: 70,
      text: '💡 Rule: Foreign keys need B-Tree index to dodge O(N) full scans!',
      color: 'bg-teal-950/80 border-teal-600/60 text-teal-200'
    }
  ]);

  const colors = [
    { label: 'Study Teal', value: '#14b8a6' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Electric Blue', value: '#3b82f6' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'Rose', value: '#f43f5e' },
    { label: 'Purple Accent', value: '#a855f7' },
    { label: 'White', value: '#ffffff' },
    { label: 'Slate', value: '#94a3b8' }
  ];

  // Initialize and resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Save previous content if any
      let prevImg: ImageData | null = null;
      if (canvas.width > 0 && canvas.height > 0) {
        try {
          prevImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch {
          // ignore
        }
      }

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      // Restore or draw initial grid/blueprint
      if (prevImg) {
        ctx.putImageData(prevImg, 0, 0);
      } else {
        drawInitialBlueprint(ctx, rect.width, rect.height);
        saveState();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const drawInitialBlueprint = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Subtle background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Starter architectural schema box for database / algorithm
    ctx.save();
    ctx.strokeStyle = '#14b8a6';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 220, 220, 130);

    ctx.fillStyle = '#14b8a6';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('TABLE: users (Primary)', 115, 245);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('• id: UUID (PK)', 115, 275);
    ctx.fillText('• name: VARCHAR(64)', 115, 295);
    ctx.fillText('• level: INT [Index]', 115, 315);
    ctx.fillText('• party_id: UUID (FK)', 115, 335);

    // Connected Box (Quests)
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(480, 220, 240, 130);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('TABLE: quest_logs (Foreign)', 495, 245);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('• id: UUID (PK)', 495, 275);
    ctx.fillText('• user_id: UUID (FK)', 495, 295);
    ctx.fillText('• quest_id: VARCHAR(32)', 495, 315);
    ctx.fillText('• status: COMPLETED', 495, 335);

    // Connector Arrow
    ctx.beginPath();
    ctx.strokeStyle = '#a855f7';
    ctx.setLineDash([4, 4]);
    ctx.moveTo(320, 285);
    ctx.lineTo(480, 285);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#c084fc';
    ctx.font = '10px monospace';
    ctx.fillText('1-to-Many JOIN (Hash)', 340, 275);
    ctx.restore();
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), imgData]);
      setHistoryIndex((prev) => prev + 1);
    } catch {
      // ignore
    }
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextIndex = historyIndex - 1;
    ctx.putImageData(history[nextIndex], 0, 0);
    setHistoryIndex(nextIndex);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextIndex = historyIndex + 1;
    ctx.putImageData(history[nextIndex], 0, 0);
    setHistoryIndex(nextIndex);
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);
    setIsDrawing(true);
    setStartPos(coords);

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    if (tool === 'eraser') {
      ctx.strokeStyle = '#0a0d14'; // background color
      ctx.lineWidth = lineWidth * 4;
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = strokeColor + '55'; // 33% alpha
      ctx.lineWidth = lineWidth * 3;
    } else {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);

    if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const stopDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !startPos) return;

    const coords = getCanvasCoordinates(e);

    if (tool === 'rect') {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(startPos.x, startPos.y, coords.x - startPos.x, coords.y - startPos.y);
    } else if (tool === 'circle') {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      const radius = Math.hypot(coords.x - startPos.x, coords.y - startPos.y);
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'line') {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }

    setStartPos(null);
    saveState();
  };

  const handleClearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      drawInitialBlueprint(ctx, rect.width, rect.height);
    }
    saveState();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `GuildUp-Whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleAddSticky = () => {
    const newNote: StickyNoteItem = {
      id: `sn-${Date.now()}`,
      x: 120 + Math.random() * 200,
      y: 120 + Math.random() * 150,
      text: 'New study note...',
      color: 'bg-indigo-950/80 border-indigo-500/60 text-indigo-200'
    };
    setStickyNotes((prev) => [...prev, newNote]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] relative select-none overflow-hidden rounded-card border border-[#1a2333]">
      {/* Whiteboard Top Toolbar */}
      <div className="h-13 bg-[#0d121d] border-b border-[#182030] px-3 sm:px-4 py-2 flex items-center justify-between flex-wrap gap-2 z-20">
        {/* Tool Selector */}
        <div className="flex items-center gap-1 bg-[#111724] p-1 rounded-inner border border-[#1b2538]">
          <button
            onClick={() => setTool('pen')}
            className={`p-1.5 rounded transition-colors ${
              tool === 'pen' ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Pen Tool"
          >
            <PenTool className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTool('highlighter')}
            className={`p-1.5 rounded transition-colors ${
              tool === 'highlighter' ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Highlighter"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-1.5 rounded transition-colors ${
              tool === 'eraser' ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Eraser"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-[#1f2d44] mx-1" />
          <button
            onClick={() => setTool('rect')}
            className={`p-1.5 rounded transition-colors ${
              tool === 'rect' ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Rectangle"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-1.5 rounded transition-colors ${
              tool === 'circle' ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Circle"
          >
            <Circle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTool('line')}
            className={`p-1.5 rounded transition-colors ${
              tool === 'line' ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Line Connector"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5 bg-[#111724] px-2 py-1 rounded-inner border border-[#1b2538]">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setStrokeColor(c.value);
                if (tool === 'eraser') setTool('pen');
              }}
              style={{ backgroundColor: c.value }}
              className={`w-4 h-4 rounded-full transition-transform ${
                strokeColor === c.value ? 'scale-125 ring-2 ring-white/80 ring-offset-1 ring-offset-[#111724]' : 'opacity-80 hover:opacity-100 hover:scale-110'
              }`}
              title={c.label}
            />
          ))}
        </div>

        {/* Stroke Width Slider */}
        <div className="hidden md:flex items-center gap-2 bg-[#111724] px-2 py-1 rounded-inner border border-[#1b2538] text-[11px] text-slate-400 font-mono">
          <span>{lineWidth}px</span>
          <input
            type="range"
            min={1}
            max={18}
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-16 accent-teal-400 cursor-pointer h-1 bg-[#1a2538] rounded"
          />
        </div>

        {/* Board Actions (Sticky note, Undo, Redo, Download, Clear) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleAddSticky}
            className="flex items-center gap-1 px-2.5 py-1 rounded-inner bg-[#141d2d] hover:bg-[#1a253a] border border-amber-500/30 text-amber-300 text-xs font-medium transition-colors"
            title="Add Sticky Note"
          >
            <StickyNote className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">+ Sticky Note</span>
          </button>
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-inner bg-[#111724] border border-[#1b2538] text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-inner bg-[#111724] border border-[#1b2538] text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-inner bg-[#111724] border border-[#1b2538] text-slate-400 hover:text-teal-300 transition-colors"
            title="Export Board as PNG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClearBoard}
            className="p-1.5 rounded-inner bg-[#111724] border border-[#1b2538] text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear Board Canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div ref={containerRef} className="relative flex-1 w-full h-full cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          className="absolute inset-0 z-10 touch-none"
        />

        {/* Floating Draggable-like Sticky Notes */}
        {stickyNotes.map((note) => (
          <div
            key={note.id}
            style={{ left: `${note.x}px`, top: `${note.y}px` }}
            className={`absolute z-20 w-52 p-3 rounded-lg border shadow-xl backdrop-blur-md cursor-grab active:cursor-grabbing ${note.color} transition-all`}
          >
            <div className="flex items-center justify-between mb-1 pb-1 border-b border-white/10 text-[10px] font-mono opacity-70">
              <span>RUNE NOTE</span>
              <button
                onClick={() => setStickyNotes((prev) => prev.filter((n) => n.id !== note.id))}
                className="hover:text-rose-400 transition-colors"
              >
                ×
              </button>
            </div>
            <textarea
              value={note.text}
              onChange={(e) => {
                const val = e.target.value;
                setStickyNotes((prev) =>
                  prev.map((n) => (n.id === note.id ? { ...n, text: val } : n))
                );
              }}
              className="w-full bg-transparent border-none resize-none text-xs leading-relaxed focus:outline-none placeholder-white/40"
              rows={3}
            />
          </div>
        ))}

        {/* Bottom Collaboration Indicator Badge */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c1018]/90 border border-teal-500/30 text-[11px] font-mono text-teal-300 backdrop-blur-sm pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>Real-Time Multi-Rune Canvas • {roomTopic}</span>
        </div>
      </div>
    </div>
  );
};
