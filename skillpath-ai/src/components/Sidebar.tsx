import React from 'react';
import {
  Home,
  FileText,
  UserCheck,
  Target,
  Layers,
  GitPullRequest,
  Map,
  CodeXml,
  HelpCircle,
  MessageSquareCode,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  hasResume: boolean;
  hasCareer: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  hasResume,
  hasCareer,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'resume-upload', label: 'Resume Analyzer', icon: FileText },
    { id: 'resume-result', label: 'Student Profile', icon: UserCheck, requiresResume: true },
    { id: 'career-select', label: 'Career Explorer', icon: Target },
    { id: 'industry-reqs', label: 'Industry Requirements', icon: Layers, requiresCareer: true },
    { id: 'skill-gap', label: 'Skill Gap', icon: GitPullRequest, badge: 'Crucial', requiresResume: true },
    { id: 'roadmap', label: 'My Roadmap', icon: Map, badge: 'AI', requiresCareer: true },
    { id: 'projects', label: 'Projects', icon: CodeXml, requiresCareer: true },
    { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquareCode, badge: 'Gemini' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-slate-800/80 bg-slate-950/60 backdrop-blur-lg p-4 select-none">
      <div>
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Career Workflow
        </div>
        <nav className="mt-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isDimmed =
              (item.requiresResume && !hasResume) || (item.requiresCareer && !hasCareer);

            return (
              <button
                key={item.id}
                id={`sidebar-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-500/80 text-white shadow-md shadow-indigo-600/20'
                    : isDimmed
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-white'
                        : isDimmed
                        ? 'text-slate-400 group-hover:text-slate-300'
                        : 'text-indigo-400 group-hover:text-indigo-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'Crucial'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom info card */}
      <div className="mt-6 p-3 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/50 to-slate-950 border border-indigo-900/30">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Smart India Hackathon</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          National Level AI Career &amp; Skill Gap Architecture powered by Gemini 3.8.
        </p>
      </div>
    </aside>
  );
};
