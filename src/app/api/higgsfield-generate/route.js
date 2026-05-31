import { NextResponse } from 'next/server';

/**
 * HiggsField AI Video Concept Generator
 * 
 * Analyzes scraped video data to find common patterns, then generates
 * an AI video concept that could be produced using HiggsField AI
 * with Sonia's wellness-first twist.
 */

// Sonia-specific brand guidelines for video generation
const SONIA_BRAND = {
  tone: "warm, empathetic, non-clinical, empowering",
  colorPalette: ["soft lavender (#B8A9C9)", "warm ivory (#F5F0EB)", "gentle teal (#7EC8B8)", "deep plum (#4A2040)"],
  visualStyle: "minimal, calming, organic textures, soft-focus backgrounds, gentle movement",
  avoidances: ["medical claims", "crisis-targeting", "fear-based hooks", "before/after transformations", "diagnostic language"],
  coreMessage: "Accessible daily wellness support through AI-powered emotional companionship"
};

function findCommonalities(videos) {
  // Extract and count hook types
  const hookCounts = {};
  const ctaCounts = {};
  const viralDriverCounts = {};
  const topicCounts = {};
  
  videos.forEach(v => {
    if (v.hook) {
      const hook = v.hook.toLowerCase().trim();
      hookCounts[hook] = (hookCounts[hook] || 0) + 1;
    }
    if (v.cta) {
      const cta = v.cta.toLowerCase().trim();
      ctaCounts[cta] = (ctaCounts[cta] || 0) + 1;
    }
    if (v.whyViral) {
      const driver = v.whyViral.toLowerCase().trim();
      viralDriverCounts[driver] = (viralDriverCounts[driver] || 0) + 1;
    }
    if (v.topic) {
      topicCounts[v.topic] = (topicCounts[v.topic] || 0) + 1;
    }
  });

  const sortByCount = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);
  
  return {
    topHooks: sortByCount(hookCounts).slice(0, 3).map(([hook, count]) => ({ hook, count })),
    topCTAs: sortByCount(ctaCounts).slice(0, 3).map(([cta, count]) => ({ cta, count })),
    topDrivers: sortByCount(viralDriverCounts).slice(0, 3).map(([driver, count]) => ({ driver, count })),
    topTopics: sortByCount(topicCounts).slice(0, 3).map(([topic, count]) => ({ topic, count })),
    totalVideosAnalyzed: videos.length,
    avgScore: Math.round(videos.reduce((sum, v) => sum + (v.score || 0), 0) / Math.max(videos.length, 1)),
    avgViews: Math.round(videos.reduce((sum, v) => sum + (v.views || 0), 0) / Math.max(videos.length, 1))
  };
}

function generateHiggsFieldBrief(commonalities, topVideo) {
  // Gracefully fallback to defaults if no top video
  const title = topVideo?.title || "Wellness Micro-moment";
  const rawViews = topVideo?.views || 100000;
  const viewsFormatted = topVideo?.viewsFormatted || `${Math.round(rawViews/1000)}K`;
  const hook = topVideo?.hook || "Comforting / Gentle Reminder";
  const driver = topVideo?.whyViral || "High emotional resonance and shareability.";
  const cta = topVideo?.cta || "Save for when you need a reminder";
  const conceptIdea = topVideo?.contentIdea || "Sonia Mindful Reset: A breathing anchor visual with a soft lavender gradient.";
  const topic = topVideo?.topic || "emotional wellness";

  // Create a highly customized HiggsField-ready Cinema Studio prompt based on the specific top video's content idea
  let promptVisuals = `A calming, vertically-shot wellness short (9:16 aspect ratio). `;
  if (conceptIdea.toLowerCase().includes("breathing") || conceptIdea.toLowerCase().includes("vagus")) {
    promptVisuals += `Opens on a soft-focus close-up of a person breathing slowly in sync with a gently pulsing soft ivory circle. Warm window lighting casting a tranquil shadow on the background, shifting slowly with lavender (#B8A9C9) and ivory (#F5F0EB) tones.`;
  } else if (conceptIdea.toLowerCase().includes("grounding") || conceptIdea.toLowerCase().includes("nature")) {
    promptVisuals += `Opens on highly detailed, cinematic b-roll of bare feet gently pressing against vibrant green grass, slowly shifting focus to dew drops on a leaf. Naturally lit by golden hour sun with organic textures, soft-focus background, and subtle camera float.`;
  } else if (conceptIdea.toLowerCase().includes("check-in") || conceptIdea.toLowerCase().includes("men")) {
    promptVisuals += `Features an intimate, warm portrait-style shot of a person looking directly at the camera with a gentle, supportive expression. Warm cozy indoor environment, natural light, 50mm lens f/1.8 shallow depth of field separating the subject from the background.`;
  } else {
    promptVisuals += `Opens on a relaxing visual of a handwritten journal resting next to a warm cup of herbal tea. Wisps of steam rising slowly in a sunlit room, slow breathing dolly push camera movement creating a serene, peaceful sanctuary aesthetic.`;
  }
  promptVisuals += ` Ends with a clean, minimal Sonia CBT companion logo dissolving in over a calming plum (#4A2040) gradient. Style: ${SONIA_BRAND.visualStyle}. Mood: safe, grounded, empathetic.`;

  const brief = {
    conceptTitle: `Sonia Wellness Short: "${title.replace(/["#shorts]/gi, "").trim()}" (Sonia's Twist)`,
    
    higgsFieldPrompt: promptVisuals,
    
    cameraSettings: {
      aspectRatio: "9:16 (Vertical / Mobile-first)",
      movement: "Slow breathing dolly push (0.5x speed) for calming rhythm",
      lens: "50mm f/1.8 — soft background separation, intimate documentary feel",
      lighting: "Natural soft side-light + golden hour warm fill",
      colorGrade: "Emulated organic film, desaturated warm, lifted shadows, soft highlights"
    },
    
    scriptOutline: {
      hook: `[0-3s] Hook Style: "${hook}" — Open with a comforting, scroll-stopping question inspired by the viral video: "${title.replace(/["#shorts]/gi, "").trim()}"`,
      body: `[3-25s] Creative Execution: ${conceptIdea} — Empathetically deliver Sonia's CBT-informed micro-moment. No medical jargon. Keep the delivery warm, friendly, and non-prescriptive.`,
      closer: `[25-35s] CTA Callout: "${cta}" — Invite the viewer to make this self-care step a small daily habit.`,
      soniaIntegration: `[35-42s] App Connection: "Sonia is here whenever you need someone to talk to, completely judgment-free." + App screen revealing Sonia's conversation interface.`
    },
    
    whyThisWorks: `Based on ${commonalities.totalVideosAnalyzed} viral videos analyzed (avg ${Math.round(commonalities.avgViews / 1000)}K views), the top performing source video was "${title}" with ${viewsFormatted} views. This custom replication brief mimics that exact psychological driver: "${driver}" to trigger immediate saves and shares.`,
    
    soniasTwist: `Unlike the scraped viral video "${title}" (which may lead with clickbait or clinical terms like "cures panic attacks"), Sonia's twist delivers safety and soft authority. The hook "${hook}" is translated into a warm, CBT-aligned invitation. The closer leverages "${cta}" to foster connection rather than high-friction engagement farming.`,
    
    productionNotes: [
      "Use HiggsField Cinema Studio for character-consistent generation across multiple takes",
      "Apply 50mm lens simulation for intimate, portrait-style framing",
      "Enable slow dolly push (camera control) for calming, rhythmic movement",
      `Color palette locked to: ${SONIA_BRAND.colorPalette.join(', ')}`,
      "Generate 3 variants: one text-overlay style, one face-to-camera, one aesthetic b-roll",
      "Export at 1080x1920 (9:16) for TikTok/Reels/Shorts cross-posting"
    ],
    
    brandGuidelines: SONIA_BRAND
  };

  return brief;
}

function generateSoniaStrategyInsights(commonalities, topVideo) {
  const insights = {
    recommendation: "",
    bestContentType: "",
    targetAudience: "",
    postingStrategy: "",
    competitiveEdge: ""
  };

  const topTopic = topVideo?.topic || "emotional wellness";
  const hook = topVideo?.hook || "Comforting / Gentle Reminder";
  const title = topVideo?.title || "Viral Wellness Short";
  const avgViews = commonalities.avgViews;

  // Content type recommendation based on what's performing
  if (hook.toLowerCase().includes('pov') || hook.toLowerCase().includes('immersive')) {
    insights.bestContentType = "Relatable POV Micro-Moment — 30-45s vertical shorts showing everyday emotional scenarios with a gentle CBT reframe";
  } else if (hook.toLowerCase().includes('educational') || hook.toLowerCase().includes('listicle') || hook.toLowerCase().includes('hacks')) {
    insights.bestContentType = "Wellness Edutainment — Quick, science-backed CBT tips delivered in a highly conversational, non-academic format";
  } else if (hook.toLowerCase().includes('comforting') || hook.toLowerCase().includes('reminder') || hook.toLowerCase().includes('soothing')) {
    insights.bestContentType = "Aesthetic Calm — ASMR-adjacent, visually beautiful content with soft voiceovers or minimal text overlays";
  } else {
    insights.bestContentType = "Empathetic Companion Content — Heartfelt videos designed to make the viewer feel seen, closing with a soft CBT invitation";
  }

  insights.recommendation = `Based on ${commonalities.totalVideosAnalyzed} viral wellness shorts averaging ${Math.round(avgViews / 1000)}K views, Sonia should double-down on "${topTopic}" content. Replicating the success of "${title.replace(/["#shorts]/gi, "").trim()}" using the "${hook}" hook format will drive high organic reach while maintaining wellness safety.`;

  insights.targetAudience = "Gen Z and Millennials (18-34) experiencing daily anxiety, stress, or emotional overwhelm — seeking accessible support without the high costs or clinical stigma of traditional therapy. They're already consuming CBT/wellness tips on Reels/TikTok and are open to AI companionship tools.";

  insights.postingStrategy = "Post 3-4 times per week during peak evening windows (Tue/Thu 7-9PM EST, Sat 10AM-12PM EST). Cross-post to TikTok, Instagram Reels, and YouTube Shorts simultaneously. Use ambient, calming background tracks to match Sonia's empathetic brand identity.";

  insights.competitiveEdge = "Unlike standard meditation or therapy apps — Sonia is a 24/7 AI emotional companion that provides judgment-free CBT support in real-time. Short-form content should position Sonia not as a tool, but as 'the friend who always knows what to say' — a cozy, accessible companion available on-demand without session fees or waitlists.";

  return insights;
}

export async function POST(request) {
  try {
    const { videos } = await request.json();
    
    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return NextResponse.json({ error: 'Video data array is required' }, { status: 400 });
    }

    // Only analyze videos with score > 0 (not flagged)
    const validVideos = videos.filter(v => v.score > 0);
    
    if (validVideos.length === 0) {
      return NextResponse.json({ error: 'No valid (non-flagged) videos to analyze' }, { status: 400 });
    }

    // Step 1: Find commonalities across all scraped videos
    const commonalities = findCommonalities(validVideos);
    
    // Step 2: Find the absolute top performing video by view count to base our HiggsField Cinema prompt on
    const sortedByViews = [...validVideos].sort((a, b) => b.views - a.views);
    const topVideo = sortedByViews[0];

    // Step 3: Generate the HiggsField AI video production brief
    const higgsfieldBrief = generateHiggsFieldBrief(commonalities, topVideo);
    
    // Step 4: Generate Sonia-specific strategy insights
    const strategyInsights = generateSoniaStrategyInsights(commonalities, topVideo);

    return NextResponse.json({
      success: true,
      data: {
        commonalities,
        higgsfieldBrief,
        strategyInsights,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[higgsfield-generate] Error:', error);
    return NextResponse.json({ error: 'Failed to generate HiggsField concept' }, { status: 500 });
  }
}
