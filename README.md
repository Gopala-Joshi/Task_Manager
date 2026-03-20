# Clipboard Task Manager

A visually interactive task management web application built with Next.js, featuring a clipboard-inspired UI, smooth animations, and full CRUD functionality.

---

## Overview

This project reimagines a task manager as a physical clipboard experience. Tasks are written directly onto a paper-like surface, completed with a scratch effect, and managed through an intuitive and minimal interface.

The focus is on blending functionality with design, creating a system that feels tactile and immersive rather than purely digital.

---

## Features

* Create tasks using a minimal input interface
* View tasks rendered directly on a clipboard-style layout
* Mark tasks as completed with a scratch animation
* Delete tasks with hover-based interaction
* Smooth parallax movement based on cursor position
* Custom pencil-style cursor
* Scrollable task list for handling multiple items
* Real-time UI updates

---

## Tech Stack

Frontend:

* Next.js (App Router)
* TypeScript
* Tailwind CSS

Animations:

* GSAP (GreenSock Animation Platform)

Backend:

* Next.js API Routes

---

## API Endpoints

GET /api/tasks
Fetch all tasks

POST /api/tasks
Create a new task

Request body:
{
"title": "Task title"
}

PUT /api/tasks
Update task status

Request body:
{
"id": number,
"status": "pending" | "completed"
}

DELETE /api/tasks
Delete a task

Request body:
{
"id": number
}

---

## Data Model

Each task follows this structure:

{
"id": number,
"title": string,
"status": "pending" | "completed"
}

---

## Key Design Concepts

* Clipboard Metaphor: Tasks are displayed as if written on paper
* Physical Interaction: Completion uses a scratch animation instead of a checkbox
* Minimal UI: Reduced clutter to focus on interaction
* Motion Design: Subtle parallax and cursor movement enhance depth
* Cursor as Tool: Custom cursor replaces default pointer for a more immersive experience

---

## Setup Instructions

1. Install dependencies:
   npm install

2. Run development server:
   npm run dev

3. Open in browser:
   http://localhost:3000

---

## Deployment

Live Application:
https://task-manager-five-delta-35.vercel.app

GitHub Repository:
https://github.com/Gopala-Joshi/Task_Manager

---

## Notes

* Data is stored in memory (temporary storage)
* Data resets on server restart
* Designed as a functional and design-focused project

---

## Future Improvements

* Persistent database integration
* Sound feedback for interactions

---
