"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Task = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  created_at: string;
};

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  // Load tasks
  const loadTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    const init = async () => {
      await loadTasks();
    };
    init();

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Add task
  const addTask = async () => {
    if (!input.trim()) return;

    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: input }),
    });

    setInput("");
    loadTasks();
  };

  // Toggle task
  const toggleTask = async (task: Task) => {
    await fetch("/api/tasks", {
      method: "PUT",
      body: JSON.stringify({
        id: task.id,
        status: task.status === "pending" ? "completed" : "pending",
      }),
    });

    loadTasks();
  };

  // Delete task
  const deleteTask = async (id: number) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    loadTasks();
  };

  return (
    <main className="relative min-h-screen cursor-none">

      {/* Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: "white",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f3ef] via-[#f2efe9] to-[#eae7df]" />

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">

        {/* HERO */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-10">
            <div
              ref={cardRef}
              className="w-40 h-60 bg-[#dcd7cc] rounded-lg shadow-xl"
            />
          </div>

          <h1 className="text-[64px] md:text-[80px] leading-[1] font-semibold tracking-tight">
            Clarity in motion.
          </h1>

          <p className="mt-4 text-[#6b6b6b]">
            A focused system to manage tasks without noise.
          </p>
        </div>

        {/* INPUT */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="w-full text-2xl bg-transparent border-b border-[#ddd] pb-3 mb-10 outline-none placeholder:text-[#aaa]"
        />

        {/* TASK LIST */}
        <div className="space-y-5">
          {tasks.map((task) => (
            <div key={task.id} className="flex justify-between group">
              
              <span
                onClick={() => toggleTask(task)}
                className={`cursor-pointer text-xl transition ${
                  task.status === "completed"
                    ? "line-through text-[#aaa]"
                    : "text-[#1a1a1a]"
                }`}
              >
                {task.title}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-sm text-[#999]"
              >
                delete
              </button>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}