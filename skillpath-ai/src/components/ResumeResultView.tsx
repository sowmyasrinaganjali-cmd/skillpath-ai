import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Briefcase,
  Users,
  Edit3,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ResumeAnalysis } from '../types';

interface ResumeResultViewProps {
  analysis: ResumeAnalysis;
  onUpdateAnalysis: (updated: ResumeAnalysis) => void;
  onContinue: () => void;
}

export const ResumeResultView: React.FC<ResumeResultViewProps> = ({
  analysis,
  onUpdateAnalysis,
  onContinue,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ResumeAnalysis>(JSON.parse(JSON.stringify(analysis)));
  const [newSkillCategory, setNewSkillCategory] = useState<keyof typeof editForm.skills>('programming');
  const [newSkillText, setNewSkillText] = useState('');

  // Sync editForm when analysis prop changes
  React.useEffect(() => {
    if (analysis) {
      setEditForm(JSON.parse(JSON.stringify(analysis)));
    }
  }, [analysis]);

  const handleSaveEdit = () => {
    onUpdateAnalysis(editForm);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    const current = (editForm.skills && editForm.skills[newSkillCategory]) || [];
    setEditForm({
      ...editForm,
      skills: {
        ...(editForm.skills || {}),
        [newSkillCategory]: [...current, newSkillText.trim()],
      },
    });
    setNewSkillText('');
  };

  const handleRemoveSkill = (category: keyof typeof editForm.skills, skillToRemove: string) => {
    const currentList = (editForm.skills && editForm.skills[category]) || [];
    setEditForm({
      ...editForm,
      skills: {
        ...(editForm.skills || {}),
        [category]: currentList.filter((s) => s !== skillToRemove),
      },
    });
  };

  const skillCategories: { key: keyof typeof analysis.skills; label: string; color: string }[] = [
    { key: 'programming', label: 'Programming', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
    { key: 'ai_ml', label: 'AI & Machine Learning', color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300' },
    { key: 'data', label: 'Data Science & Math', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' },
    { key: 'web', label: 'Web & Frontend', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
    { key: 'cloud', label: 'Cloud & Infrastructure', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
    { key: 'databases', label: 'Databases & Storage', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300' },
    { key: 'tools', label: 'Tools & Version Control', color: 'border-rose-500/30 bg-rose-500/10 text-rose-300' },
    { key: 'other', label: 'Other Skills', color: 'border-slate-500/30 bg-slate-500/10 text-slate-300' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Extracted via Gemini AI Structured Ingestion</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Your AI Resume Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review your extracted profile below. Click "Edit Profile" if anything needs refinement.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="edit-profile-toggle-btn"
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>

          <button
            id="continue-career-btn"
            onClick={onContinue}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <span>Continue to Career Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Modal / Drawer if Active */}
      {isEditing && (
        <div className="rounded-2xl border border-indigo-500/40 bg-slate-900/90 p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span>Correct AI Extraction Errors</span>
            </h3>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500"
            >
              Save Profile
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Candidate Name</label>
              <input
                type="text"
                value={editForm.personalInfo?.name || ''}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    personalInfo: { ...(editForm.personalInfo || {}), name: e.target.value },
                  })
                }
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
              <input
                type="text"
                value={editForm.personalInfo?.email || ''}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    personalInfo: { ...(editForm.personalInfo || {}), email: e.target.value },
                  })
                }
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={editForm.personalInfo?.location || ''}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    personalInfo: { ...(editForm.personalInfo || {}), location: e.target.value },
                  })
                }
                className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Add / Remove Skills */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300">Add Extracted Skill</h4>
            <div className="flex flex-wrap gap-2">
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as any)}
                className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-slate-200"
              >
                <option value="programming">Programming</option>
                <option value="ai_ml">AI & ML</option>
                <option value="data">Data Science</option>
                <option value="web">Web</option>
                <option value="cloud">Cloud</option>
                <option value="databases">Databases</option>
                <option value="tools">Tools</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Skill name (e.g. PyTorch, Docker, SQL)"
                value={newSkillText}
                onChange={(e) => setNewSkillText(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-1.5 text-xs text-white flex-1 min-w-[200px]"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Profile Summary Header Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[2px]">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              {analysis.personalInfo?.name || 'Candidate Name'}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
              <span>{analysis.personalInfo?.email || 'Not mentioned'}</span>
              <span>•</span>
              <span>{analysis.personalInfo?.location || 'Not mentioned'}</span>
              {analysis.personalInfo?.github && (
                <>
                  <span>•</span>
                  <span className="text-indigo-400">{analysis.personalInfo.github}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {analysis.summary && (
          <div className="max-w-md p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-indigo-300 block mb-1">AI Summary</span>
            {analysis.summary}
          </div>
        )}
      </div>

      {/* 2-Column Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Education, Experience, Certifications */}
        <div className="lg:col-span-5 space-y-6">
          {/* Education Card */}
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-bold text-white">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span>Education</span>
            </div>

            {analysis.education && analysis.education.length > 0 ? (
              analysis.education.map((edu, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">{edu.degree}</span>
                    <span className="text-[11px] text-slate-400">{edu.graduationYear}</span>
                  </div>
                  <p className="text-xs text-white font-medium">{edu.branch}</p>
                  <p className="text-[11px] text-slate-400">{edu.college}</p>
                  {edu.cgpaOrPercentage && (
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mt-1">
                      CGPA: {edu.cgpaOrPercentage}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">Not mentioned in resume.</p>
            )}
          </div>

          {/* Experience Card */}
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-bold text-white">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <span>Work &amp; Internships</span>
            </div>

            {analysis.experience &&
            analysis.experience.length > 0 &&
            analysis.experience[0].role !== 'Not mentioned in resume' ? (
              analysis.experience.map((exp, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{exp.role}</span>
                    <span className="text-[10px] text-slate-400">{exp.duration}</span>
                  </div>
                  <p className="text-xs text-emerald-400">{exp.company}</p>
                  <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                    {exp.responsibilities.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400">
                Not mentioned in resume.
              </div>
            )}
          </div>

          {/* Certifications Card */}
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/40 p-6 space-y-3">
            <div className="flex items-center gap-2.5 text-sm font-bold text-white">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Certifications</span>
            </div>

            {analysis.certifications && analysis.certifications.length > 0 ? (
              <div className="space-y-2">
                {analysis.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Not mentioned in resume.</p>
            )}
          </div>

          {/* Soft Skills Card */}
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/40 p-6 space-y-3">
            <div className="flex items-center gap-2.5 text-sm font-bold text-white">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Soft Skills &amp; Competencies</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {analysis.softSkills && analysis.softSkills.length > 0 ? (
                analysis.softSkills.map((ss, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  >
                    {ss}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">Not mentioned in resume.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Technical Skills Badges & Academic Projects */}
        <div className="lg:col-span-7 space-y-6">
          {/* Technical Skills Card */}
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/40 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm font-bold text-white">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span>Technical Skills (Extracted &amp; Categorized)</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Interactive badges
              </span>
            </div>

            <div className="space-y-4">
              {skillCategories.map((cat) => {
                const skills = analysis.skills?.[cat.key] || [];
                const isEmpty = skills.length === 0 || (skills.length === 1 && skills[0].toLowerCase().includes('not mentioned'));

                return (
                  <div key={cat.key} className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {cat.label}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {isEmpty ? (
                        <span className="text-xs text-slate-500 italic px-2 py-0.5">
                          Not mentioned in resume.
                        </span>
                      ) : (
                        skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${cat.color}`}
                          >
                            <span>{skill}</span>
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveSkill(cat.key, skill)}
                                className="hover:text-rose-400"
                                title="Remove skill"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Projects Card */}
          <div className="rounded-3xl border border-slate-800/90 bg-slate-900/40 p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-2.5 text-sm font-bold text-white">
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
              <span>Extracted Projects</span>
            </div>

            {analysis.projects && analysis.projects.length > 0 ? (
              <div className="space-y-4">
                {analysis.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        Project {idx + 1}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Technologies used */}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 mr-1">Technologies:</span>
                        {proj.technologies.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-cyan-300 border border-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Skills demonstrated */}
                    {proj.skillsDemonstrated && proj.skillsDemonstrated.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] text-slate-400 mr-1">Skills Demonstrated:</span>
                        {proj.skillsDemonstrated.map((sd, sdIdx) => (
                          <span
                            key={sdIdx}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800/50"
                          >
                            {sd}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Not mentioned in resume.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">
            Ready to explore your target career trajectory?
          </h3>
          <p className="text-xs text-slate-300">
            Next, choose your target career or let Gemini calculate your top 3 matching industry roles.
          </p>
        </div>

        <button
          id="bottom-continue-career-btn"
          onClick={onContinue}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
        >
          <span>Continue to Career Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
