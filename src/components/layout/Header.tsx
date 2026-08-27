"use client";

import {
  ArrowLeft,
  Bell,
  ChevronDown,
  HelpCircle,
  Menu,
  Sparkles
} from "lucide-react";

type HeaderProps = {
  mobile?: boolean;
};

export default function Header({
  mobile = false
}: HeaderProps) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button className="icon-button" onClick={() => window.location.href = "/"}>
          <ArrowLeft size={18} />
        </button>

        <div className="breadcrumb" onClick={() => window.location.href = "/"}>
          <span>Exams</span>
        </div>
      </div>

      <div className="header-actions">
        <button className="icon-button header-desktop-only" onClick={() => window.location.href = "/"}>
          <HelpCircle size={18} />
        </button>

        <button className="icon-button notification-button" onClick={() => window.location.href = "/"}>
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <button className="icon-button" onClick={() => window.location.href = "/"}>
          <Sparkles size={18} />
        </button>

        <div className="profile">
          <div className="profile-avatar">
            J
          </div>

          {!mobile && (
            <>
              <span>Jency</span>
              <ChevronDown size={15} />
            </>
          )}
        </div>

        <button className="icon-button mobile-only">
          <Menu size={19} />
        </button>
      </div>
    </header>
  );
}