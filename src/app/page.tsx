"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Task = {
  id: number;
  title: string;
  status: "pending" | "completed";
};

export default function Home() {
  const boardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "pending">("all");

  const loadTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    loadTasks();

    const move = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;

      if (boardRef.current) {
        gsap.to(boardRef.current, {
          x, y, rotateX: -y * 0.8, rotateY: x * 0.8, duration: 0.6, ease: "power2.out"
        });
      }

      if (cursorRef.current) {
        gsap.set(cursorRef.current, { x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    
    // Create task object
    const newTask: Task = { id: Date.now(), title: input, status: "pending" };
    
    // Optimistic Update: Update UI instantly
    setTasks(prev => [newTask, ...prev]); 
    const val = input;
    setInput("");

    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: val }),
      });
      loadTasks(); // Sync with server
    } catch (e) {
      console.error("Failed to sync task", e);
    }
  };

  const toggleTask = (task: Task) => {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    
    fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, status: newStatus }),
    });
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const visibleTasks = filter === "all" ? tasks : tasks.filter(t => t.status === "pending");

  return (
    <main className="min-h-screen bg-[#dcdbd7] flex flex-col items-center justify-center cursor-none overflow-hidden font-sans">
      
      {/* PENCIL CURSOR - pointer-events-none is CRITICAL here */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 pointer-events-none z-[100]" 
        style={{ transform: "translate(-2px, -22px)" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" className="scale-y-[-1] rotate-[10deg]">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
        </svg>
      </div>

      {/* THE BOARD */}
      <div ref={boardRef} className="relative w-[420px] h-[600px] bg-[#1a1a1a] rounded-xl shadow-[0_60px_100px_-20px_rgba(0,0,0,0.6)] flex flex-col items-center pt-14" style={{ transformStyle: 'preserve-3d' }}>
        
        <div className="absolute top-6 w-36 h-2 bg-[#333] rounded-full z-20" />
        <div className="absolute top-8 w-44 h-8 bg-gradient-to-b from-[#444] to-[#222] rounded shadow-lg z-10" />

        {/* PAPER STACK */}
        <div className="relative w-[88%] h-[82%] mt-4 bg-white shadow-2xl p-12 flex flex-col">
          <div className="absolute inset-0 bg-white translate-x-1.5 translate-y-1.5 rotate-[0.8deg] -z-10 shadow-md border border-gray-100" />
          <div className="absolute inset-0 bg-white -translate-x-1.5 translate-y-1 -rotate-[1deg] -z-20 shadow-md border border-gray-100" />

          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Write here..."
            className="w-full bg-transparent border-b-2 border-gray-100 pb-3 mb-8 outline-none text-xl font-bold text-black placeholder:text-gray-200 focus:border-black relative z-20 cursor-none"
          />

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 relative z-10">
            {visibleTasks.map((task) => (
              <div key={task.id} className="group flex items-center justify-between">
                <div className="relative flex-1 py-1">
                  <span
                    onClick={() => toggleTask(task)}
                    className={`text-lg font-semibold transition-all block cursor-none ${task.status === "completed" ? "text-gray-300 italic" : "text-gray-800"}`}
                  >
                    {task.title}
                  </span>
                  {task.status === "completed" && (
                    <div className="absolute left-0 top-1/2 h-[2px] bg-black/60 w-full animate-scratch" />
                  )}
                </div>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-500 hover:text-white transition-all ml-4 cursor-none"
                >
                  <span className="text-xs font-black">X</span>
                </button>
              </div>
            ))}
          </div>

          {/* VIEW ALL TOGGLE */}
          <div className="pt-6 border-t border-gray-100 flex justify-between items-center mt-auto">
             <button 
                onClick={() => setFilter(filter === "all" ? "pending" : "all")}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors cursor-none"
             >
                {filter === "all" ? "Showing All" : "Hide Done"}
             </button>
             <span className="text-[10px] font-bold text-gray-200 uppercase">{tasks.length} Items</span>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center select-none pointer-events-none">
        <h1 className="text-[84px] font-[900] leading-[0.75] tracking-tighter text-black uppercase">
          Write it.<br />
          <span className="opacity-5">Finish it.</span>
        </h1>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes scratch { from { width: 0; } to { width: 100%; } }
        .animate-scratch { animation: scratch 0.25s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
      `}</style>
    </main>
  );
}