
import { useState } from "react";
import './style.css';

function List({ list, removeTask, toggleDone, updateTask, availableTags }) {
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTags, setEditTags] = useState("");

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditDate(task.date || "");
    setEditTags((task.tags || []).join(", "));
  };

  const saveEdit = (id) => {
    const tags = editTags.split(",").map(t => t.trim()).filter(Boolean);
    updateTask(id, { text: editText, date: editDate || null, tags });
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString();
    } catch { return d; }
  };

  return (
    <ul className="task-list">
      {
        list.map(i => {
          const date = i.date ? new Date(i.date) : null;
          const now = Date.now();
          const isPast = date ? date.getTime() < now : false;
          const hoursLeft = date ? (date.getTime() - now) / (1000 * 60 * 60) : Infinity;
          const near = date && hoursLeft <= 24 && hoursLeft >= 0;

          const classes = [
            "task-item",
            i.done ? "done" : "",
            isPast ? "past" : (near ? "soon" : "future")
          ].join(" ");

          return (
            <li key={i.id} className={classes}>
              <div className="task-main">
                <input
                  type="checkbox"
                  checked={!!i.done}
                  onChange={() => toggleDone(i.id)}
                />

                {editingId === i.id ? (
                  <div style={{ flex: 1 }}>
                    <input
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="input"
                      style={{ width: "100%", marginBottom: 6 }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="date"
                        value={editDate}
                        onChange={e => setEditDate(e.target.value)}
                        className="input"
                      />
                      <input
                        value={editTags}
                        onChange={e => setEditTags(e.target.value)}
                        placeholder="tags (comma)"
                        className="input"
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1 }}>
                    <div className={i.done ? "task-done" : ""} style={{ fontWeight: 600 }}>
                      {i.text}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <span className="meta">Due: {formatDate(i.date)}</span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      {(i.tags || []).map(t => <span key={t} className="tag">#{t}</span>)}
                    </div>
                  </div>
                )}
              </div>

              <div className="task-actions">
                {editingId === i.id ? (
                  <>
                    <button className="button" onClick={() => saveEdit(i.id)}>Save</button>
                    <button className="button ghost" onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="button" onClick={() => startEdit(i)}>Edit</button>
                    <button className="button ghost" onClick={() => removeTask(i.id)}>Remove</button>
                  </>
                )}
              </div>
            </li>
          );
        })
      }
    </ul>
  );
}
export default List;
