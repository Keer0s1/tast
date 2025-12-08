// src/components/TaskManasger.jsx
import { useEffect, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

import List from "./List";
import AddTaskForm from "./AddTaskForm";

function TaskManager(){
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [availableTags, setAvailableTags] = useState([]);

  // load tasks + tags from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tasks_v1") || "null");
      if (saved && Array.isArray(saved)) setTasks(saved);
      const tagsSaved = JSON.parse(localStorage.getItem("tags_v1") || "null");
      if (tagsSaved && Array.isArray(tagsSaved)) setAvailableTags(tagsSaved);
    } catch (e) {
      console.warn("load error", e);
    }
  }, []);

  // save tasks
  useEffect(() => {
    try {
      localStorage.setItem("tasks_v1", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // save tags
  useEffect(() => {
    try {
      localStorage.setItem("tags_v1", JSON.stringify(availableTags));
    } catch {}
  }, [availableTags]);

  const addTask = ({ text, date, tags = [] }) => {
    const newTask = {
      id: uuidv4(),
      text,
      date: date || null,
      tags,
      done: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    if (tags.length) registerTags(tags);
  };

  const removeTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleDone = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (updates.tags && updates.tags.length) registerTags(updates.tags);
  };

  const registerTags = (tags) => {
    setAvailableTags(prev => {
      const set = new Set(prev);
      tags.forEach(t => set.add(t));
      return Array.from(set);
    });
  };

  const clearAll = () => {
    if (!confirm("Clear all tasks?")) return;
    setTasks([]);
  };

  // filtered list
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return tasks;
    return tasks.filter(t =>
      t.text.toLowerCase().includes(s) ||
      (t.tags || []).some(tag => tag.toLowerCase().includes(s)) ||
      (t.date || "").includes(s)
    );
  }, [tasks, search]);

  // sort: upcoming first, then others, done at bottom
  const sorted = useMemo(() => {
    return [...filtered].sort((a,b) => {
      // done last
      if (a.done !== b.done) return a.done ? 1 : -1;
      // tasks with date earlier first
      if (a.date && b.date) return new Date(a.date) - new Date(b.date);
      if (a.date && !b.date) return -1;
      if (!a.date && b.date) return 1;
      // fallback by createdAt
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [filtered]);

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Task manager</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="Search tasks or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="button ghost" onClick={clearAll}>Clear</button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <AddTaskForm addTask={addTask} registerTags={registerTags} availableTags={availableTags} />
      </div>

      <div style={{ marginTop: 16 }}>
        {sorted.length > 0 ? (
          <List
            list={sorted}
            removeTask={removeTask}
            toggleDone={toggleDone}
            updateTask={updateTask}
            availableTags={availableTags}
          />
        ) : (
          <div style={{ padding: 12, color: "var(--muted)" }}>
            No tasks found.
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div className="meta">Tags:</div>
        {availableTags.length ? availableTags.map(t => <span key={t} className="tag">#{t}</span>) : <div className="meta">— none —</div>}
      </div>
    </div>
  );
}
export default TaskManager;
