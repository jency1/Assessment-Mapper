"use client";

import {
  BookOpen,
  Clock3,
  FileText,
  Grid2X2,
  Settings,
  Users,
  ClipboardList,
  Sparkles
} from "lucide-react";

const iconMap = {
  grid: Grid2X2,
  classroom: Users,
  assignment: ClipboardList,
  exam: FileText,
  library: Clock3
};

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">A</div>
        <span>Assessment Mapper</span>
      </div>

      <button className="toolkit-button" onClick={() => window.location.href = "/"}>
        <Sparkles size={15} />
        AI Teacher&apos;s Toolkit
      </button>

      <nav className="sidebar-nav" onClick={() => window.location.href = "/"}>
        {[
          ["Home", "grid"],
          ["My Classroom", "classroom"],
          ["Assignments", "assignment"],
          ["Exams", "exam"],
          ["My Library", "library"]
        ].map(([label, icon]) => {
          const Icon =
            iconMap[icon as keyof typeof iconMap];

          const active = label === "Exams";

          return (
            <button
              key={label}
              className={`nav-item ${
                active ? "active" : ""
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={() => window.location.href = "/"}>
          <Settings size={16} />
          <span>Settings</span>
        </button>

        <div className="school-card">
          <div className="school-logo">EI</div>

          <div>
            <strong>Educational Institution</strong>
            <span>Ahmedabad City</span>
          </div>
        </div>  
      </div>
    </aside>
  );
}