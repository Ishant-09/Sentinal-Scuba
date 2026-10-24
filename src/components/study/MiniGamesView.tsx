import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Brain,
  Zap,
  Keyboard,
  Timer,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  Award,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

type GameType = 'trivia' | 'memory' | 'typing' | 'reaction';

export const MiniGamesView: React.FC<{
  onRewardXp?: (amount: number, reason: string) => void;
}> = ({ onRewardXp }) => {
  const [activeGame, setActiveGame] = useState<GameType>('trivia');

  return (
    <div className="flex flex-col h-full bg-[#070a10] border border-[#1a2333] rounded-card overflow-hidden">
      {/* Game Selector Header */}
      <div className="bg-[#0c1018] border-b border-[#182030] px-3 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Chamber Breaktime Arcade</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-semibold">
                XP Enabled
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Unwind your mind, sharpen reflexes, and gain streak XP between study intervals</p>
          </div>
        </div>

        {/* Game Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#101524] p-1 rounded-inner border border-[#1a2335]">
          <button
            onClick={() => setActiveGame('trivia')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${
              activeGame === 'trivia'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Syntax Trivia</span>
          </button>

          <button
            onClick={() => setActiveGame('memory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${
              activeGame === 'memory'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Memory Matrix</span>
          </button>

          <button
            onClick={() => setActiveGame('typing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${
              activeGame === 'typing'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Speed Coder</span>
          </button>

          <button
            onClick={() => setActiveGame('reaction')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${
              activeGame === 'reaction'
                ? 'bg-teal-500 text-[#070b13] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Reflex Chamber</span>
          </button>
        </div>
      </div>

      {/* Game Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
        {activeGame === 'trivia' && <TriviaGame onRewardXp={onRewardXp} />}
        {activeGame === 'memory' && <MemoryGame onRewardXp={onRewardXp} />}
        {activeGame === 'typing' && <TypingGame onRewardXp={onRewardXp} />}
        {activeGame === 'reaction' && <ReactionGame onRewardXp={onRewardXp} />}
      </div>
    </div>
  );
};

/* =========================================================================
   1. SYNTAX TRIVIA GAME
   ========================================================================= */
const TRIVIA_QUESTIONS = [
  {
    q: 'In Python, what is the average time complexity of checking membership `x in s` if `s` is a `set`?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
    correct: 0,
    explanation: 'Sets in Python are implemented as hash tables, giving average O(1) constant-time lookups.'
  },
  {
    q: 'Which SQL clause is evaluated BEFORE the SELECT statement according to logical query processing?',
    options: ['WHERE', 'ORDER BY', 'LIMIT', 'SELECT DISTINCT'],
    correct: 0,
    explanation: 'The order of execution is: FROM -> ON -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.'
  },
  {
    q: 'In Git, what does `git merge --squash feature-branch` do?',
    options: [
      'Deletes the feature branch immediately',
      'Combines all feature commits into a single staged change on the target branch',
      'Creates a 3-way octagonal merge commit',
      'Reverts all changes made in the feature branch'
    ],
    correct: 1,
    explanation: '`--squash` takes all individual work commits and consolidates them into a single clean commit on the target branch.'
  },
  {
    q: 'What is the worst-case time complexity of QuickSort when a naive pivot is picked on an already sorted array?',
    options: ['O(N log N)', 'O(N)', 'O(N²)', 'O(2^N)'],
    correct: 2,
    explanation: 'Without random pivot selection or median-of-three, partitioning degrades to O(N²) quadratic time.'
  },
  {
    q: 'In relational databases, which index structure is optimal for range queries like `WHERE age BETWEEN 20 AND 30`?',
    options: ['Hash Index', 'B-Tree / B+ Tree', 'Bloom Filter', 'Bitset Index'],
    correct: 1,
    explanation: 'B+ Trees keep leaf nodes linked in sequential sorted order, making range scans lightning fast.'
  }
];

const TriviaGame: React.FC<{ onRewardXp?: (amt: number, r: string) => void }> = ({ onRewardXp }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(15);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (isGameOver || selectedOpt !== null) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          handleSelectOption(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIdx, selectedOpt, isGameOver]);

  const handleSelectOption = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    const q = TRIVIA_QUESTIONS[currentIdx];
    if (idx === q.correct) {
      setScore((s) => s + 100 + streak * 20);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < TRIVIA_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setTimer(15);
    } else {
      setIsGameOver(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onRewardXp?.(score + 150, 'Mastering Syntax Trivia Quiz');
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setStreak(0);
    setTimer(15);
    setIsGameOver(false);
  };

  const q = TRIVIA_QUESTIONS[currentIdx];

  if (isGameOver) {
    return (
      <div className="max-w-md w-full bg-[#0d121e] border border-[#1b2538] rounded-xl p-6 text-center shadow-2xl">
        <Trophy className="w-12 h-12 text-teal-400 mx-auto mb-3 animate-bounce" />
        <h3 className="text-lg font-bold text-white mb-1">Trivia Trial Complete!</h3>
        <p className="text-xs text-slate-400 mb-4">You tested your computer science and coding theory.</p>
        <div className="bg-[#111726] border border-[#1b2538] rounded-lg p-4 mb-5">
          <div className="text-2xl font-mono font-bold text-teal-300">{score} PTS</div>
          <div className="text-[11px] text-teal-400 font-mono mt-1">+150 Bonus Guild XP Awarded!</div>
        </div>
        <button
          onClick={handleRestart}
          className="w-full py-2.5 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Another Round</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl w-full bg-[#0d121e] border border-[#1b2538] rounded-xl p-6 shadow-2xl space-y-5">
      {/* Question Header & Timer */}
      <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-teal-400 font-semibold">
            Round {currentIdx + 1} of {TRIVIA_QUESTIONS.length}
          </span>
          {streak > 1 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              {streak}x Streak!
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-slate-300">{score} pts</div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#131b2c] border border-[#1e2a40] text-xs font-mono text-teal-300">
            <Timer className="w-3.5 h-3.5" />
            <span>{timer}s</span>
          </div>
        </div>
      </div>

      {/* Question Title */}
      <h3 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">{q.q}</h3>

      {/* Answer Options */}
      <div className="space-y-2.5">
        {q.options.map((opt, idx) => {
          let btnClass = 'bg-[#111726] border-[#1b2538] text-slate-300 hover:border-teal-500/50 hover:bg-[#141d30]';
          if (selectedOpt !== null) {
            if (idx === q.correct) {
              btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
            } else if (idx === selectedOpt) {
              btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
            } else {
              btnClass = 'bg-[#0f1422] border-[#182030] text-slate-500 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={selectedOpt !== null}
              className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${btnClass}`}
            >
              <span>{opt}</span>
              {selectedOpt !== null && idx === q.correct && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              {selectedOpt !== null && idx === selectedOpt && idx !== q.correct && (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation & Next Button */}
      {selectedOpt !== null && (
        <div className="pt-2 animate-in fade-in duration-200 space-y-3">
          <p className="text-xs text-slate-400 bg-[#0f1524] p-3 rounded border border-[#1b2538] leading-relaxed">
            <span className="font-semibold text-teal-300">Explanation: </span>
            {q.explanation}
          </p>
          <button
            onClick={handleNextQuestion}
            className="w-full py-2.5 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>{currentIdx < TRIVIA_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   2. MEMORY MATRIX (SYNTAX & RUNES FLIP CARDS)
   ========================================================================= */
interface MemoryCard {
  id: number;
  label: string;
  symbol: string;
  category: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const BASE_CARDS = [
  { symbol: '🐍', label: 'Python 3', category: 'Language' },
  { symbol: '🗄️', label: 'SQL Index', category: 'Database' },
  { symbol: '🌿', label: 'Git Rebase', category: 'DevOps' },
  { symbol: '⚡', label: 'Big-O O(1)', category: 'Algorithms' },
  { symbol: '📘', label: 'TypeScript', category: 'Frontend' },
  { symbol: '🐳', label: 'Docker Pod', category: 'Containers' },
  { symbol: '🌲', label: 'AVL Tree', category: 'Data Structure' },
  { symbol: '🔄', label: 'Recursion', category: 'Concepts' }
];

const MemoryGame: React.FC<{ onRewardXp?: (amt: number, r: string) => void }> = ({ onRewardXp }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const deck: MemoryCard[] = [];
    let id = 0;
    // Duplicate 8 cards to make 16 cards
    BASE_CARDS.forEach((card) => {
      deck.push({ id: id++, ...card, isFlipped: false, isMatched: false });
      deck.push({ id: id++, ...card, isFlipped: false, isMatched: false });
    });
    // Shuffle
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = nextFlipped;
      if (newCards[first].label === newCards[second].label) {
        // Match!
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);

        if (newCards.every((c) => c.isMatched)) {
          setIsWon(true);
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          onRewardXp?.(200, 'Clearing Memory Matrix in under ' + (moves + 1) + ' moves');
        }
      } else {
        // Mismatch - flip back after delay
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === first || i === second ? { ...c, isFlipped: false } : c))
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="max-w-md w-full bg-[#0d121e] border border-[#1b2538] rounded-xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#182030]">
        <div>
          <span className="text-xs font-bold text-white">Memory Matrix Flip</span>
          <p className="text-[10px] text-slate-400">Match the pairs of computer science concepts</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-teal-300">Moves: {moves}</span>
          <button
            onClick={initGame}
            className="p-1 rounded bg-[#111726] border border-[#1b2538] text-slate-400 hover:text-white"
            title="Reset Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isWon ? (
        <div className="text-center py-6 space-y-3">
          <Award className="w-12 h-12 text-teal-400 mx-auto animate-bounce" />
          <h3 className="text-base font-bold text-white">Neural Matrix Solved!</h3>
          <p className="text-xs text-slate-400">Cleared in {moves} moves • +200 XP gained</p>
          <button
            onClick={initGame}
            className="px-5 py-2 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-xs"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2.5">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-20 rounded-lg border flex flex-col items-center justify-center p-1 transition-all transform ${
                card.isFlipped || card.isMatched
                  ? 'bg-[#121c2e] border-teal-500/60 scale-100 shadow-md'
                  : 'bg-[#0f1422] border-[#182030] hover:border-slate-500 hover:bg-[#121929]'
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                <>
                  <span className="text-2xl mb-1">{card.symbol}</span>
                  <span className="text-[9px] font-mono text-slate-200 text-center truncate max-w-full font-semibold">
                    {card.label}
                  </span>
                </>
              ) : (
                <span className="text-sm font-mono text-slate-600">?</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. SPEED CODER (TYPING SPRINT)
   ========================================================================= */
const CODE_SNIPPETS = [
  'def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n    return -1',
  'SELECT users.name, COUNT(quests.id) AS completed\nFROM users\nJOIN quests ON users.id = quests.user_id\nWHERE quests.status = "done"\nGROUP BY users.name;',
  'git checkout -b feature/dynamic-joins\ngit add src/engine/query_plan.py\ngit commit -m "feat: optimize join order with hash table"\ngit push origin feature/dynamic-joins'
];

const TypingGame: React.FC<{ onRewardXp?: (amt: number, r: string) => void }> = ({ onRewardXp }) => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const targetSnippet = CODE_SNIPPETS[snippetIndex];

  useEffect(() => {
    resetGame();
  }, [snippetIndex]);

  const resetGame = () => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setUserInput(val);

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetSnippet[i]) correct++;
    }
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);

    // Calculate WPM
    if (startTime) {
      const minutes = (Date.now() - startTime) / 60000;
      if (minutes > 0) {
        const words = val.length / 5;
        setWpm(Math.round(words / minutes));
      }
    }

    // Check completion
    if (val === targetSnippet) {
      setIsFinished(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onRewardXp?.(180, 'Speed Coder Typing Sprint (WPM: ' + wpm + ')');
    }
  };

  return (
    <div className="max-w-xl w-full bg-[#0d121e] border border-[#1b2538] rounded-xl p-5 sm:p-6 shadow-2xl space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-[#182030] font-sans">
        <div>
          <span className="text-xs font-bold text-white">Speed Coder Sprint</span>
          <p className="text-[10px] text-slate-400">Type real production syntax as fast and accurately as possible</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-teal-400 font-bold">{wpm} WPM</span>
          <span className="text-xs font-mono text-slate-400">{accuracy}% Acc</span>
          <button
            onClick={() => setSnippetIndex((s) => (s + 1) % CODE_SNIPPETS.length)}
            className="text-xs px-2 py-0.5 rounded bg-[#111726] border border-[#1b2538] text-slate-300 hover:text-white"
          >
            Next Snippet
          </button>
        </div>
      </div>

      {/* Target Snippet Display with character styling */}
      <div className="p-4 bg-[#090d16] border border-[#182236] rounded-lg text-xs leading-relaxed overflow-x-auto whitespace-pre font-mono">
        {targetSnippet.split('').map((char, i) => {
          let color = 'text-slate-500';
          if (i < userInput.length) {
            color = userInput[i] === char ? 'text-teal-300 bg-teal-950/60 font-bold' : 'text-rose-400 bg-rose-950/60';
          }
          return (
            <span key={i} className={color}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Typing Input */}
      {!isFinished ? (
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleChange}
          placeholder="Click here and start typing the code above..."
          rows={5}
          className="w-full bg-[#090d16] border border-[#1b2538] focus:border-teal-500 rounded-lg p-3 text-xs text-slate-200 resize-none focus:outline-none placeholder-slate-600"
        />
      ) : (
        <div className="p-4 bg-teal-950/40 border border-teal-500/40 rounded-lg text-center space-y-2">
          <div className="text-sm font-bold text-teal-300">Sprint Concluded!</div>
          <div className="text-xs text-slate-300">
            Final Speed: <span className="font-bold text-white">{wpm} WPM</span> • Accuracy: <span className="font-bold text-white">{accuracy}%</span>
          </div>
          <button
            onClick={resetGame}
            className="px-4 py-1.5 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-xs"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   4. REFLEX CHAMBER (REACTION TIME TEST)
   ========================================================================= */
const ReactionGame: React.FC<{ onRewardXp?: (amt: number, r: string) => void }> = ({ onRewardXp }) => {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const timerTimeoutRef = useRef<any>(null);

  const handleStart = () => {
    setGameState('waiting');
    setReactionTime(null);
    const delay = 1500 + Math.random() * 3000; // 1.5s - 4.5s
    timerTimeoutRef.current = setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClickBox = () => {
    if (gameState === 'waiting') {
      clearTimeout(timerTimeoutRef.current);
      setGameState('idle');
      alert('Too early! Wait until the box turns glowing green.');
    } else if (gameState === 'ready') {
      const elapsed = Date.now() - startTime;
      setReactionTime(elapsed);
      setGameState('result');
      if (!bestTime || elapsed < bestTime) {
        setBestTime(elapsed);
      }
      if (elapsed < 250) {
        confetti({ particleCount: 70, spread: 60 });
        onRewardXp?.(100, `Lightning reaction speed (${elapsed}ms)`);
      }
    }
  };

  return (
    <div className="max-w-md w-full bg-[#0d121e] border border-[#1b2538] rounded-xl p-6 shadow-2xl space-y-4 text-center">
      <div className="pb-3 border-b border-[#182030] text-left">
        <span className="text-xs font-bold text-white">Reflex Chamber</span>
        <p className="text-[10px] text-slate-400">Click as fast as possible when the box flashes green</p>
      </div>

      <div
        onClick={gameState === 'idle' ? handleStart : handleClickBox}
        className={`h-48 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all select-none ${
          gameState === 'idle'
            ? 'bg-[#111726] border-[#1b2538] hover:bg-[#141d30]'
            : gameState === 'waiting'
            ? 'bg-rose-950/70 border-rose-600/80'
            : gameState === 'ready'
            ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.5)]'
            : 'bg-[#111726] border-[#1b2538]'
        }`}
      >
        {gameState === 'idle' && (
          <div className="space-y-1">
            <Zap className="w-8 h-8 text-teal-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-white">Click to Begin Test</div>
            <div className="text-[11px] text-slate-400">Wait for the screen to turn green</div>
          </div>
        )}
        {gameState === 'waiting' && (
          <div className="space-y-1">
            <div className="text-base font-bold text-rose-200 animate-pulse">Wait for green...</div>
            <div className="text-[11px] text-rose-300/70">Do not click yet!</div>
          </div>
        )}
        {gameState === 'ready' && (
          <div className="text-xl font-bold text-slate-950 font-mono tracking-wider animate-bounce">
            CLICK NOW!
          </div>
        )}
        {gameState === 'result' && (
          <div className="space-y-1">
            <div className="text-3xl font-bold font-mono text-teal-300">{reactionTime} ms</div>
            <div className="text-xs text-slate-300">
              {reactionTime! < 200
                ? '⚡ Godlike Neural Reflexes!'
                : reactionTime! < 280
                ? '🚀 Top-tier Developer Reaction'
                : '🧘 Steady & Focused'}
            </div>
          </div>
        )}
      </div>

      {gameState === 'result' && (
        <button
          onClick={handleStart}
          className="w-full py-2.5 rounded-inner bg-teal-500 hover:bg-teal-400 text-[#070b13] font-bold text-xs flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Test Again</span>
        </button>
      )}

      {bestTime && (
        <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-[#182030]">
          Best Record: <span className="text-teal-300 font-bold">{bestTime} ms</span>
        </div>
      )}
    </div>
  );
};
