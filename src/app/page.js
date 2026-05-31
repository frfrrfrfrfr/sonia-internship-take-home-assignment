"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle2, Activity, Video, Camera, Music, ShieldAlert, ExternalLink, Sparkles, Film, TrendingUp, Eye, Zap, Clock } from "lucide-react";

const SAMPLE_TOPICS = [
  "mindful mornings", 
  "managing daily stress", 
  "gentle self care", 
  "grounding techniques", 
  "emotional wellness"
];

const PLATFORMS = ["YouTube Shorts", "Instagram Reels", "TikTok"];

const platformColors = {
  "YouTube Shorts": "text-red-500 bg-red-500/10 border-red-500/20",
  "Instagram Reels": "text-pink-500 bg-pink-500/10 border-pink-500/20",
  "TikTok": "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
};

const platformIcons = {
  "YouTube Shorts": <Video className="w-3 h-3 mr-1" />,
  "Instagram Reels": <Camera className="w-3 h-3 mr-1" />,
  "TikTok": <Music className="w-3 h-3 mr-1" />,
};

export default function App() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTopic, setCurrentTopic] = useState("");
  const [results, setResults] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filter, setFilter] = useState("All");
  const [agentLog, setAgentLog] = useState([]);
  const [done, setDone] = useState(false);
  const [activeTab, setActiveTab] = useState("database");
  const [higgsData, setHiggsData] = useState(null);
  const [higgsLoading, setHiggsLoading] = useState(false);

  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [agentLog]);

  const log = (msg) => setAgentLog(prev => [...prev, { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), msg }]);

  const runAgent = async () => {
    setRunning(true);
    setDone(false);
    setResults([]);
    setAgentLog([]);
    setProgress(0);
    setHiggsData(null);

    log("🤖 Agent initialized — connecting to YouTube Scraper...");
    await new Promise(r => setTimeout(r, 600));
    log("📅 Date Boundary: ENFORCED — YouTube sp=EgQIBBAB filter (1 Year) + server-side validation.");
    await new Promise(r => setTimeout(r, 400));
    log("👁️ View Threshold: ENFORCED — minimum 100,000 views required.");
    await new Promise(r => setTimeout(r, 300));
    log("⏱️ Duration Filter: ENFORCED — short-form only (≤ 3 minutes).");
    await new Promise(r => setTimeout(r, 400));
    log("🛡️ Loaded Sonia Trust & Wellness Guardrails (no medical claims, no crisis-targeting).");
    await new Promise(r => setTimeout(r, 500));
    log("🔍 Starting real-time YouTube scraping...");
    await new Promise(r => setTimeout(r, 600));

    let allResults = [];
    for (let i = 0; i < SAMPLE_TOPICS.length; i++) {
      const topic = SAMPLE_TOPICS[i];
      setCurrentTopic(topic);
      log(`📡 Scraping YouTube for: "${topic}" — filtering by 1 Year + Shorts...`);
      
      try {
        const fetchRes = await fetch('/api/fetch-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic })
        });
        const fetchData = await fetchRes.json();
        
        if (fetchData.success) {
          if (fetchData.data.length === 0) {
            log(`⚠️ No videos met ALL boundaries for "${topic}" — views≥100k + age≤1year + short-form`);
          } else {
            log(`✅ Found ${fetchData.data.length} verified viral shorts for "${topic}"`);
            fetchData.data.forEach(v => {
              log(`   📌 "${v.title}" — ${v.viewsFormatted} views, uploaded ${v.publishedAgo}`);
            });
          }
          
          for (let j = 0; j < fetchData.data.length; j++) {
            const video = fetchData.data[j];
            
            log(`🧠 Analyzing virality of: "${video.title}"...`);
            const analyzeRes = await fetch('/api/analyze-virality', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ video })
            });
            const analyzeData = await analyzeRes.json();
            
            if (analyzeData.success) {
              const fullVideo = { ...video, ...analyzeData.data };
              allResults = [...allResults, fullVideo];
              setResults([...allResults]);
              
              if (fullVideo.score === 0) {
                log(`⚠️ FLAGGED: "${video.title}" — Violates Sonia medical claim guardrails.`);
              }
            }
          }
        }
      } catch (err) {
        log(`❌ Error scanning topic "${topic}" — ${err.message || 'network error'}`);
      }
      
      setProgress(Math.round(((i + 1) / SAMPLE_TOPICS.length) * 100));
      await new Promise(r => setTimeout(r, 200));
    }

    log(`🎯 Scraping complete! ${allResults.length} shorts collected across all topics.`);
    
    // Auto-trigger HiggsField analysis
    if (allResults.filter(r => r.score > 0).length > 0) {
      log("🎬 Launching HiggsField AI analysis — finding commonalities across viral videos...");
      setHiggsLoading(true);
      try {
        const higgsRes = await fetch('/api/higgsfield-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videos: allResults })
        });
        const higgsResult = await higgsRes.json();
        if (higgsResult.success) {
          setHiggsData(higgsResult.data);
          log("✨ HiggsField AI concept generated — check the HIGGSFIELD STUDIO tab!");
        }
      } catch (err) {
        log("❌ HiggsField generation failed — " + (err.message || 'unknown error'));
      }
      setHiggsLoading(false);
    }
    
    setRunning(false);
    setDone(true);
    setCurrentTopic("");
  };

  const filtered = filter === "All" ? results : results.filter(r => r.platform === filter);
  const topScore = [...results].sort((a, b) => b.score - a.score).slice(0, 3);
  
  const topPerformers = results.filter(r => r.score >= 80);
  const commonHooks = [...new Set(topPerformers.map(r => r.hook))].slice(0, 3);
  const commonCtas = [...new Set(topPerformers.map(r => r.cta))].slice(0, 3);

  return (
    <div className="h-screen max-h-screen bg-[#030305] text-[#e8e8f0] font-sans flex flex-col overflow-hidden relative">
      {/* Premium ambient glow mesh elements */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-fuchsia-600/5 rounded-full blur-[180px] pointer-events-none z-0" />
      
      {/* Header */}
      <header className="border-b border-[#1e1e2e]/80 py-4 px-4 sm:px-8 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 bg-[#050508]/80 backdrop-blur-md shrink-0 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Activity className="text-white w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] text-muted tracking-[0.2em] mb-0.5 font-mono truncate">
              SONIA GROWTH INTERNSHIP
            </div>
            <h1 className="text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300 tracking-wide truncate">
              Viral Wellness Shorts Agent
            </h1>
          </div>
        </div>
        <div className="flex gap-2 items-center ml-auto sm:ml-0 shrink-0">
          {running && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1a1a2e] border border-secondary/50 rounded-md px-2.5 py-1 text-[10px] text-secondary flex items-center gap-1.5 font-mono"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              SCANNING
            </motion.div>
          )}
          {done && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-950/30 border border-emerald-500/30 rounded-md px-2.5 py-1 text-[10px] text-emerald-400 flex items-center gap-1 font-mono"
            >
              <CheckCircle2 className="w-3 h-3" />
              COMPLETE
            </motion.div>
          )}
          <button
            onClick={runAgent}
            disabled={running}
            className={`
              flex items-center gap-1.5 rounded-lg px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold tracking-wider transition-all shrink-0
              ${running 
                ? "bg-[#1a1a2e] text-muted cursor-not-allowed border border-[#2a2a3a]" 
                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 border border-white/10"}
            `}
          >
            {running ? (
              <Activity className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            {running ? "RUNNING..." : "RUN AGENT"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Agent Log */}
        <div className="w-80 border-r border-[#1e1e2e] flex flex-col bg-[#050508] shrink-0 z-0">
          <div className="py-3 px-5 border-b border-[#1e1e2e] text-[10px] text-muted tracking-[0.2em] font-mono flex items-center gap-2">
            <Activity className="w-3 h-3" />
            AGENT TERMINAL
          </div>

          {/* Progress Section */}
          <AnimatePresence>
            {(running || done) && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="p-5 border-b border-[#1e1e2e] bg-[#0a0a0f]/50"
              >
                <div className="flex justify-between text-[10px] text-muted font-mono mb-2">
                  <span>PROGRESS</span>
                  <span className="text-secondary">{progress}%</span>
                </div>
                <div className="bg-[#1a1a2e] rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
                {currentTopic && (
                  <div className="mt-3 text-[11px] text-secondary font-mono truncate flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                    Target: {currentTopic}
                  </div>
                )}
                
                {/* Boundary Status Indicators */}
                <div className="mt-3 space-y-1">
                  {[
                    { label: "DATE ≤ 1 YEAR", color: "text-emerald-400", icon: "🗓️" },
                    { label: "VIEWS ≥ 100K", color: "text-emerald-400", icon: "👁️" },
                    { label: "SHORT-FORM ONLY", color: "text-emerald-400", icon: "⏱️" },
                  ].map(b => (
                    <div key={b.label} className={`text-[9px] font-mono ${b.color} flex items-center gap-1.5`}>
                      <span>{b.icon}</span> {b.label} <span className="text-emerald-500">✓</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px]">
            {agentLog.length === 0 && (
              <div className="text-[#2a2a3e] text-center mt-10">
                Press RUN AGENT to start scanning...
              </div>
            )}
            {agentLog.map((entry, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="leading-relaxed"
              >
                <span className="text-[#3a3a5a] mr-2">[{entry.time}]</span>
                <span className={
                  entry.msg.includes('⚠️') ? 'text-amber-400' : 
                  entry.msg.includes('❌') ? 'text-red-400' :
                  entry.msg.includes('✅') ? 'text-emerald-400' :
                  entry.msg.includes('📅') || entry.msg.includes('👁️') || entry.msg.includes('⏱️') ? 'text-cyan-300' :
                  entry.msg.includes('✨') || entry.msg.includes('🎬') ? 'text-fuchsia-400' :
                  'text-[#a0a0c0]'
                }>{entry.msg}</span>
              </motion.div>
            ))}
            <div ref={logEndRef} />
          </div>

          {/* Top Score Callouts */}
          {done && topScore.length > 0 && (
            <div className="border-t border-[#1e1e2e] p-4 bg-[#0a0a0f]/80">
              <div className="text-[10px] text-muted tracking-[0.2em] mb-3 font-mono">
                TOP VIRALITY SCORES
              </div>
              <div className="space-y-2">
                {topScore.map((r, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={r.id} 
                    className={`
                      p-2.5 rounded-md cursor-pointer border-l-2 bg-[#0d0d15] hover:bg-[#12121c] transition-colors
                      ${i === 0 ? "border-fuchsia-400" : i === 1 ? "border-violet-400" : "border-[#3a3a6a]"}
                    `}
                    onClick={() => setSelectedRow(r)}
                  >
                    <div className="text-[11px] text-[#e8e8f0] mb-1.5 line-clamp-1">{r.title}</div>
                    <div className="flex justify-between text-[10px] text-muted">
                      <span>{r.platform}</span>
                      <span className={r.score >= 90 ? "text-fuchsia-400 font-bold" : "text-violet-400 font-bold"}>
                        {r.score}/100
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main: Results Area */}
        <div className="flex-1 flex flex-col bg-[#030305] relative z-0">
          {/* Dashboard View Tabs */}
          <div className="flex border-b border-[#1e1e2e] bg-[#050508]/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
            <button
              onClick={() => setActiveTab("database")}
              className={`flex-1 py-4 px-6 text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === "database"
                  ? "border-purple-500 text-white bg-purple-500/5"
                  : "border-transparent text-muted hover:text-[#c0c0e0] hover:bg-white/[0.01]"
              }`}
            >
              <Activity className="w-4 h-4 text-purple-400" />
              VIDEO DATABASE ({results.length})
            </button>
            <button
              onClick={() => setActiveTab("ideahub")}
              className={`flex-1 py-4 px-6 text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-2 border-b-2 transition-all relative ${
                activeTab === "ideahub"
                  ? "border-pink-500 text-white bg-pink-500/5"
                  : "border-transparent text-muted hover:text-[#c0c0e0] hover:bg-white/[0.01]"
              }`}
            >
              <span className="relative flex h-2 w-2 mr-1">
                {done && results.length > 0 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              💡 IDEA HUB
            </button>
            <button
              onClick={() => setActiveTab("higgsfield")}
              className={`flex-1 py-4 px-6 text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-2 border-b-2 transition-all relative ${
                activeTab === "higgsfield"
                  ? "border-amber-500 text-white bg-amber-500/5"
                  : "border-transparent text-muted hover:text-[#c0c0e0] hover:bg-white/[0.01]"
              }`}
            >
              <span className="relative flex h-2 w-2 mr-1">
                {higgsData && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              🎬 HIGGSFIELD STUDIO
            </button>
          </div>

          {/* ============================================================ */}
          {/* TAB: VIDEO DATABASE */}
          {/* ============================================================ */}
          {activeTab === "database" && (
            <>
              {/* Filter Bar */}
              <div className="py-3 px-6 border-b border-[#1e1e2e] flex items-center gap-3 shrink-0 bg-[#0a0a0f]/50 backdrop-blur-md">
                <span className="text-[10px] text-muted font-mono tracking-wider mr-2">PLATFORM:</span>
                {["All", ...PLATFORMS].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setFilter(p)} 
                    className={`
                      px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors border
                      ${filter === p 
                        ? "bg-secondary/10 border-secondary/30 text-secondary" 
                        : "bg-transparent border-[#2a2a3a] text-muted hover:text-[#a0a0c0]"}
                    `}
                  >
                    {p}
                  </button>
                ))}
                <span className="ml-auto text-[11px] text-[#3a3a5a] font-mono">
                  {filtered.length} RESULTS
                </span>
              </div>

              {/* Table Area */}
              <div className="flex-1 overflow-auto relative">
                {filtered.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-[#2a2a3e]">
                    <Activity className="w-12 h-12 mb-4 opacity-20" />
                    <div className="text-sm">Run the agent to start collecting viral shorts data</div>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#0a0a0f] z-10 shadow-md">
                      <tr>
                        {["TITLE", "PLATFORM", "VIEWS", "UPLOADED", "HOOK TYPE", "WHY VIRAL", "SCORE"].map(h => (
                          <th key={h} className="py-3 px-4 text-[10px] font-mono tracking-wider text-muted font-normal border-b border-[#1e1e2e] whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-[12px] divide-y divide-[#1e1e2e]/50">
                      <AnimatePresence>
                        {filtered.map((r) => (
                          <motion.tr 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={r.id}
                            onClick={() => setSelectedRow(selectedRow?.id === r.id ? null : r)}
                            className={`
                              cursor-pointer transition-colors group
                              ${selectedRow?.id === r.id ? "bg-[#0f0f1a]" : "hover:bg-[#0a0a0f]"}
                            `}
                          >
                            <td className="py-3 px-4 max-w-[200px]">
                              <div className={`line-clamp-2 leading-relaxed ${r.score === 0 ? "text-muted line-through" : "text-[#d0d0e8]"}`}>
                                {r.score === 0 && <ShieldAlert className="inline w-3 h-3 text-amber-500 mr-1" />}
                                {r.title}
                              </div>
                              <div className="text-[10px] text-muted mt-1 font-mono flex items-center gap-2 flex-wrap">
                                <span className="text-purple-400 font-medium">#{r.topic}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center border rounded px-2 py-0.5 text-[10px] whitespace-nowrap ${platformColors[r.platform]}`}>
                                {platformIcons[r.platform]} {r.platform}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-emerald-400 font-mono">{r.viewsFormatted}</td>
                            <td className="py-3 px-4">
                              <span className="text-cyan-400 font-mono text-[11px] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {r.publishedAgo || "This month"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-fuchsia-400 max-w-[150px] truncate">{r.hook}</td>
                            <td className="py-3 px-4 text-[#a0a0c0] max-w-[200px] truncate">{r.whyViral}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${r.score >= 90 ? "bg-fuchsia-400" : r.score >= 70 ? "bg-violet-400" : r.score === 0 ? "bg-amber-500" : "bg-[#3a3a6a]"}`} 
                                    style={{ width: `${r.score}%` }} 
                                  />
                                </div>
                                <span className={`font-mono text-[11px] ${r.score >= 90 ? "text-fuchsia-400" : r.score === 0 ? "text-amber-500" : "text-[#7c7a9a]"}`}>
                                  {r.score}
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ============================================================ */}
          {/* TAB: IDEA HUB */}
          {/* ============================================================ */}
          {activeTab === "ideahub" && (
            <div className="flex-1 overflow-auto relative">
              {results.filter(r => r.score > 0).length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#2a2a3e]">
                  <Activity className="w-12 h-12 mb-4 opacity-20" />
                  <div className="text-sm">Run the agent to start collecting and generating wellness ideas</div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#0a0a0f] z-10 shadow-md">
                    <tr>
                      {["WELLNESS CONCEPT", "TOPIC", "HOOK FORMAT", "PSYCHOLOGICAL DRIVER", "SUGGESTED CTA", "POTENTIAL"].map(h => (
                        <th key={h} className="py-3 px-4 text-[10px] font-mono tracking-wider text-muted font-normal border-b border-[#1e1e2e] whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[12px] divide-y divide-[#1e1e2e]/50">
                    <AnimatePresence>
                      {results.filter(r => r.score > 0).map((r) => {
                        const hasColon = r.contentIdea && r.contentIdea.includes(":");
                        const ideaTitle = hasColon ? r.contentIdea.split(":")[0] : "Replication Concept";
                        const ideaDesc = hasColon ? r.contentIdea.split(":").slice(1).join(":") : r.contentIdea || "Wellness content replication concept.";

                        return (
                          <motion.tr 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={`idea-${r.id}`}
                            onClick={() => setSelectedRow(selectedRow?.id === r.id ? null : r)}
                            className={`
                              cursor-pointer transition-colors group
                              ${selectedRow?.id === r.id ? "bg-[#0f0f1a]" : "hover:bg-[#0a0a0f]"}
                            `}
                          >
                            <td className="py-3.5 px-4 max-w-[260px]">
                              <div className="font-bold text-[#e8e8f0] mb-1">{ideaTitle}</div>
                              <div className="text-muted text-[11px] leading-relaxed line-clamp-2">{ideaDesc}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950/40 text-indigo-300 border border-indigo-900/30">
                                #{r.topic}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-fuchsia-400 max-w-[140px] truncate">
                              {r.hook}
                            </td>
                            <td className="py-3.5 px-4 text-emerald-400 max-w-[180px] truncate">
                              {r.whyViral}
                            </td>
                            <td className="py-3.5 px-4 text-amber-400 max-w-[140px] truncate">
                              {r.cta}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-12 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" 
                                    style={{ width: `${r.score}%` }} 
                                  />
                                </div>
                                <span className="font-mono text-[11px] text-pink-400">
                                  {r.score}%
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: HIGGSFIELD STUDIO */}
          {/* ============================================================ */}
          {activeTab === "higgsfield" && (
            <div className="flex-1 overflow-auto relative">
              {!higgsData && !higgsLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#2a2a3e]">
                  <Film className="w-12 h-12 mb-4 opacity-20" />
                  <div className="text-sm">Run the agent to generate a HiggsField AI video concept</div>
                  <div className="text-[11px] mt-2 text-[#1e1e2e]">Analyzes video commonalities → Creates production brief</div>
                </div>
              ) : higgsLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                    <Sparkles className="w-8 h-8 text-amber-400" />
                  </motion.div>
                  <div className="text-sm mt-4">Analyzing commonalities across viral videos...</div>
                </div>
              ) : (
                <div className="p-6 space-y-8 max-w-5xl mx-auto">
                  {/* Section: Commonalities Found */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#e8e8f0]">Pattern Analysis</h2>
                        <p className="text-[11px] text-muted font-mono">{higgsData.commonalities.totalVideosAnalyzed} VIDEOS ANALYZED • AVG {Math.round(higgsData.commonalities.avgViews / 1000)}K VIEWS</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {/* Top Hooks */}
                      <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-4">
                        <div className="text-[10px] text-muted tracking-wider font-mono mb-3 flex items-center gap-2">
                          <Zap className="w-3 h-3 text-fuchsia-400" /> TOP HOOKS
                        </div>
                        <div className="space-y-2">
                          {higgsData.commonalities.topHooks.map((h, i) => (
                            <div key={i} className="bg-fuchsia-950/20 border border-fuchsia-900/20 rounded-lg p-2.5 text-[11px] text-fuchsia-300">
                              <span className="text-muted mr-1 font-mono">{h.count}×</span> {h.hook}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Top CTAs */}
                      <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-4">
                        <div className="text-[10px] text-muted tracking-wider font-mono mb-3 flex items-center gap-2">
                          <Play className="w-3 h-3 text-amber-400" /> TOP CTAs
                        </div>
                        <div className="space-y-2">
                          {higgsData.commonalities.topCTAs.map((c, i) => (
                            <div key={i} className="bg-amber-950/20 border border-amber-900/20 rounded-lg p-2.5 text-[11px] text-amber-300">
                              <span className="text-muted mr-1 font-mono">{c.count}×</span> {c.cta}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Top Drivers */}
                      <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl p-4">
                        <div className="text-[10px] text-muted tracking-wider font-mono mb-3 flex items-center gap-2">
                          <Eye className="w-3 h-3 text-emerald-400" /> WHY THEY GO VIRAL
                        </div>
                        <div className="space-y-2">
                          {higgsData.commonalities.topDrivers.map((d, i) => (
                            <div key={i} className="bg-emerald-950/20 border border-emerald-900/20 rounded-lg p-2.5 text-[11px] text-emerald-300 leading-relaxed">
                              <span className="text-muted mr-1 font-mono">{d.count}×</span> {d.driver}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Section: HiggsField AI Production Brief */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <Film className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#e8e8f0]">HiggsField AI — Production Brief</h2>
                        <p className="text-[11px] text-muted font-mono">READY TO GENERATE IN HIGGSFIELD CINEMA STUDIO</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#0d0d1a] to-[#0a0a12] border border-violet-900/30 rounded-xl overflow-hidden">
                      {/* Concept Title */}
                      <div className="p-5 border-b border-violet-900/20 bg-violet-950/10">
                        <div className="text-[10px] text-violet-400 tracking-wider font-mono mb-2">CONCEPT</div>
                        <div className="text-lg font-bold text-[#e8e8f0]">{higgsData.higgsfieldBrief.conceptTitle}</div>
                      </div>
                      
                      {/* Prompt */}
                      <div className="p-5 border-b border-violet-900/20">
                        <div className="text-[10px] text-violet-400 tracking-wider font-mono mb-2">HIGGSFIELD PROMPT</div>
                        <div className="bg-[#050508] border border-[#1e1e2e] rounded-lg p-4 text-[12px] text-[#c0c0e0] leading-relaxed font-mono">
                          {higgsData.higgsfieldBrief.higgsFieldPrompt}
                        </div>
                      </div>
                      
                      {/* Camera Settings */}
                      <div className="p-5 border-b border-violet-900/20">
                        <div className="text-[10px] text-violet-400 tracking-wider font-mono mb-3">CAMERA & CINEMATIC SETTINGS</div>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(higgsData.higgsfieldBrief.cameraSettings).map(([key, val]) => (
                            <div key={key} className="bg-[#050508] border border-[#1e1e2e] rounded-lg p-3">
                              <div className="text-[9px] text-muted font-mono uppercase mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                              <div className="text-[11px] text-[#e8e8f0]">{val}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Script Outline */}
                      <div className="p-5 border-b border-violet-900/20">
                        <div className="text-[10px] text-violet-400 tracking-wider font-mono mb-3">SCRIPT OUTLINE</div>
                        <div className="space-y-3">
                          {Object.entries(higgsData.higgsfieldBrief.scriptOutline).map(([key, val]) => {
                            const colors = {
                              hook: "border-fuchsia-500/30 bg-fuchsia-950/10",
                              body: "border-violet-500/30 bg-violet-950/10",
                              closer: "border-amber-500/30 bg-amber-950/10",
                              soniaIntegration: "border-emerald-500/30 bg-emerald-950/10"
                            };
                            return (
                              <div key={key} className={`border rounded-lg p-3 ${colors[key] || 'border-[#1e1e2e]'}`}>
                                <div className="text-[9px] text-muted font-mono uppercase mb-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                                <div className="text-[11px] text-[#d0d0e8] leading-relaxed">{val}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Sonia's Twist */}
                      <div className="p-5 border-b border-violet-900/20 bg-gradient-to-r from-purple-950/20 to-fuchsia-950/10">
                        <div className="text-[10px] text-fuchsia-400 tracking-wider font-mono mb-2 flex items-center gap-2">
                          <Sparkles className="w-3 h-3" /> SONIA&apos;S TWIST
                        </div>
                        <div className="text-[12px] text-[#d0d0e8] leading-relaxed">{higgsData.higgsfieldBrief.soniasTwist}</div>
                      </div>
                      
                      {/* Why This Works */}
                      <div className="p-5 border-b border-violet-900/20">
                        <div className="text-[10px] text-emerald-400 tracking-wider font-mono mb-2">WHY THIS CONCEPT WORKS</div>
                        <div className="text-[12px] text-emerald-300/80 leading-relaxed">{higgsData.higgsfieldBrief.whyThisWorks}</div>
                      </div>
                      
                      {/* Production Notes */}
                      <div className="p-5">
                        <div className="text-[10px] text-muted tracking-wider font-mono mb-3">PRODUCTION NOTES</div>
                        <ul className="space-y-2">
                          {higgsData.higgsfieldBrief.productionNotes.map((note, i) => (
                            <li key={i} className="text-[11px] text-[#a0a0c0] flex items-start gap-2">
                              <span className="text-violet-400 font-mono mt-0.5">→</span> {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  {/* Section: Sonia Strategy Insights */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-[#e8e8f0]">Sonia Growth — Content Strategy</h2>
                        <p className="text-[11px] text-muted font-mono">RESEARCH-BACKED RECOMMENDATIONS FOR SONIA HEALTH</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { label: "STRATEGIC RECOMMENDATION", value: higgsData.strategyInsights.recommendation, color: "border-emerald-500/20 bg-emerald-950/10", textColor: "text-emerald-300" },
                        { label: "BEST CONTENT TYPE FOR SONIA", value: higgsData.strategyInsights.bestContentType, color: "border-violet-500/20 bg-violet-950/10", textColor: "text-violet-300" },
                        { label: "TARGET AUDIENCE", value: higgsData.strategyInsights.targetAudience, color: "border-cyan-500/20 bg-cyan-950/10", textColor: "text-cyan-300" },
                        { label: "POSTING STRATEGY", value: higgsData.strategyInsights.postingStrategy, color: "border-amber-500/20 bg-amber-950/10", textColor: "text-amber-300" },
                        { label: "SONIA'S COMPETITIVE EDGE", value: higgsData.strategyInsights.competitiveEdge, color: "border-fuchsia-500/20 bg-fuchsia-950/10", textColor: "text-fuchsia-300" },
                      ].map((item) => (
                        <div key={item.label} className={`border rounded-xl p-5 ${item.color}`}>
                          <div className="text-[10px] text-muted tracking-wider font-mono mb-2">{item.label}</div>
                          <div className={`text-[12px] ${item.textColor} leading-relaxed`}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Sonia Brand Info */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <div className="bg-gradient-to-br from-[#1a1028] to-[#0a0a12] border border-purple-900/30 rounded-xl p-5">
                      <div className="text-[10px] text-purple-400 tracking-wider font-mono mb-3">ABOUT SONIA HEALTH</div>
                      <div className="text-[12px] text-[#a0a0c0] leading-relaxed mb-3">
                        Sonia is an AI-powered mental health companion founded by ETH Zürich/MIT researchers (Y Combinator backed). 
                        Uses CBT and ACT principles to provide evidence-based emotional support via voice/text conversations. 
                        HIPAA-compliant, available 24/7, and designed to overcome barriers of cost, waitlists, and stigma.
                      </div>
                      <div className="text-[10px] text-purple-400 tracking-wider font-mono mb-2">BRAND COLOR PALETTE</div>
                      <div className="flex gap-3">
                        {higgsData.higgsfieldBrief.brandGuidelines.colorPalette.map((c, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: c.match(/#[0-9A-Fa-f]+/)?.[0] || '#666' }} />
                            <span className="text-[10px] text-muted font-mono">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Detail Panel */}
        <AnimatePresence>
          {selectedRow && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-[#1e1e2e] bg-[#050508] shrink-0 overflow-y-auto shadow-2xl relative z-20"
            >
              <div className="p-6 w-[320px]">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-[10px] text-muted tracking-[0.2em] font-mono">
                    INTELLIGENCE BRIEF
                  </div>
                  <button 
                    onClick={() => setSelectedRow(null)}
                    className="w-6 h-6 rounded-full bg-[#1a1a2e] flex items-center justify-center text-muted hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-sm text-[#e8e8f0] leading-relaxed mb-4 font-medium">
                  {selectedRow.title}
                </div>

                <div className={`inline-flex items-center border rounded px-2.5 py-1 text-[11px] mb-4 ${platformColors[selectedRow.platform]}`}>
                  {platformIcons[selectedRow.platform]} {selectedRow.platform}
                </div>

                {selectedRow.url && (
                  <div className="mb-6">
                    <a href={selectedRow.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1a1a2e] hover:bg-[#2a2a3e] border border-secondary/30 rounded-md text-[11px] font-mono text-secondary transition-colors">
                      <ExternalLink className="w-3 h-3" /> WATCH VIDEO
                    </a>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {[
                    ["Views", selectedRow.viewsFormatted, "text-emerald-400"],
                    ["Likes", selectedRow.likesFormatted, "text-[#a0a0c0]"],
                    ["Comments", selectedRow.commentsFormatted, "text-[#a0a0c0]"],
                    ["Shares", selectedRow.sharesFormatted, "text-[#a0a0c0]"],
                    ["Duration", selectedRow.duration, "text-[#a0a0c0]"],
                    ["Uploaded", selectedRow.publishedAgo || "This month", "text-cyan-400"],
                    ["Virality Score", `${selectedRow.score}/100`, selectedRow.score === 0 ? "text-amber-500" : "text-fuchsia-400"],
                  ].map(([label, val, colorClass]) => (
                    <div key={label} className="flex justify-between border-b border-[#1a1a2a] pb-2 text-[12px]">
                      <span className="text-muted">{label}</span>
                      <span className={`font-mono ${colorClass}`}>{val}</span>
                    </div>
                  ))}
                </div>

                {selectedRow.score === 0 && (
                  <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-500 text-[10px] font-mono tracking-wider mb-2">
                      <ShieldAlert className="w-3 h-3" /> FLAGGED CONTENT
                    </div>
                    <div className="text-[11px] text-amber-200/80 leading-relaxed">
                      This content was flagged for violating Sonia&apos;s wellness guidelines. It may contain unauthorized medical claims, crisis-targeting, or fear-based language.
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <div className="text-[10px] text-muted tracking-wider font-mono mb-2">HOOK TYPE</div>
                    <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 text-[12px] text-fuchsia-300 leading-relaxed">
                      {selectedRow.hook}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted tracking-wider font-mono mb-2">PSYCHOLOGICAL DRIVER</div>
                    <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-3 text-[12px] text-emerald-300 leading-relaxed">
                      {selectedRow.whyViral}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted tracking-wider font-mono mb-2">CALL TO ACTION</div>
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 text-[12px] text-amber-300 leading-relaxed">
                      {selectedRow.cta}
                    </div>
                  </div>
                </div>

                {selectedRow.score > 0 && (
                  <div className="mt-8 p-4 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a15] rounded-xl border border-secondary/20 shadow-lg shadow-purple-900/20">
                    <div className="text-[10px] text-secondary tracking-wider font-mono mb-3 flex items-center gap-2">
                      <Activity className="w-3 h-3" /> REPLICATION BLUEPRINT
                    </div>
                    <div className="text-[11px] text-[#a0a0c0] leading-loose">
                      <span className="text-muted mr-2">01</span> Start with <span className="text-fuchsia-300 font-medium">{selectedRow.hook.toLowerCase()}</span><br />
                      <span className="text-muted mr-2">02</span> Focus on <span className="text-[#e8e8f0]">#{selectedRow.topic}</span><br />
                      <span className="text-muted mr-2">03</span> Keep length around <span className="text-[#e8e8f0]">{selectedRow.duration}</span><br />
                      <span className="text-muted mr-2">04</span> End by asking viewers to <span className="text-amber-300 font-medium">{selectedRow.cta.toLowerCase()}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {!selectedRow && done && topPerformers.length > 0 && activeTab !== "higgsfield" && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-[#1e1e2e] bg-[#050508] shrink-0 overflow-y-auto shadow-2xl relative z-20"
            >
              <div className="p-6 w-[320px]">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-[10px] text-muted tracking-[0.2em] font-mono flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    TOP PERFORMER INSIGHTS
                  </div>
                </div>
                <div className="text-[13px] text-[#e8e8f0] leading-relaxed mb-6 font-medium">
                  Based on {topPerformers.length} highly viral videos (Score 80+), here are the key similarities to replicate.
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] text-muted tracking-wider font-mono mb-3">COMMON HOOKS</div>
                    <ul className="space-y-2">
                      {commonHooks.map((h, i) => (
                        <li key={i} className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg p-3 text-[12px] text-fuchsia-300 leading-relaxed">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted tracking-wider font-mono mb-3">COMMON CALL-TO-ACTIONS</div>
                    <ul className="space-y-2">
                      {commonCtas.map((c, i) => (
                        <li key={i} className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-3 text-[12px] text-amber-300 leading-relaxed">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
