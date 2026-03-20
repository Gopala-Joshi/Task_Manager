import { NextResponse } from "next/server";

type Task = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "completed";
  created_at: string;
};

let tasks: Task[] = [];

// GET all tasks
export async function GET() {
  return NextResponse.json(tasks);
}

// CREATE task
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.title || body.title.trim() === "") {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const newTask: Task = {
    id: Date.now(),
    title: body.title,
    description: body.description || "",
    status: "pending",
    created_at: new Date().toISOString(),
  };

  tasks.push(newTask);

  return NextResponse.json(newTask);
}

// UPDATE task (toggle or edit)
export async function PUT(req: Request) {
  const body = await req.json();

  tasks = tasks.map((task) =>
    task.id === body.id ? { ...task, ...body } : task
  );

  return NextResponse.json({ success: true });
}

// DELETE task
export async function DELETE(req: Request) {
  const body = await req.json();

  tasks = tasks.filter((task) => task.id !== body.id);

  return NextResponse.json({ success: true });
}