// data.js — simulated LinkedIn network data (profiles, interactions, relationships)

const MOCK_PROFILES = {
  // === YOU (the user) ===
  "you": {
    id: "you",
    name: "You",
    headline: "Product Manager @ Notion",
    company: "Notion",
    degree: 0,
    avatar: "U"
  },

  // === 1ST DEGREE CONNECTIONS ===
  "rahul-mehta": {
    id: "rahul-mehta",
    name: "Rahul Mehta",
    headline: "Senior SWE @ Google",
    company: "Google",
    degree: 1,
    avatar: "R"
  },
  "sneha-iyer": {
    id: "sneha-iyer",
    name: "Sneha Iyer",
    headline: "Engineering Manager @ Stripe",
    company: "Stripe",
    degree: 1,
    avatar: "S"
  },
  "alex-wong": {
    id: "alex-wong",
    name: "Alex Wong",
    headline: "Founder & CEO @ Meshflow",
    company: "Meshflow",
    degree: 1,
    avatar: "A"
  },
  "priya-sharma": {
    id: "priya-sharma",
    name: "Priya Sharma",
    headline: "VP Engineering @ Razorpay",
    company: "Razorpay",
    degree: 1,
    avatar: "P"
  },
  "mike-chen": {
    id: "mike-chen",
    name: "Mike Chen",
    headline: "Staff Engineer @ Meta",
    company: "Meta",
    degree: 1,
    avatar: "M"
  },
  "lisa-kumar": {
    id: "lisa-kumar",
    name: "Lisa Kumar",
    headline: "Product Lead @ Figma",
    company: "Figma",
    degree: 1,
    avatar: "L"
  },
  "vikram-reddy": {
    id: "vikram-reddy",
    name: "Vikram Reddy",
    headline: "Data Scientist @ Netflix",
    company: "Netflix",
    degree: 1,
    avatar: "V"
  },
  "ananya-das": {
    id: "ananya-das",
    name: "Ananya Das",
    headline: "CTO @ Zepto",
    company: "Zepto",
    degree: 1,
    avatar: "A"
  },

  // === 2ND DEGREE CONNECTIONS ===
  "sarah-chen": {
    id: "sarah-chen",
    name: "Sarah Chen",
    headline: "Co-founder & CTO @ NeuralPath",
    company: "NeuralPath",
    degree: 2,
    avatar: "S"
  },
  "james-okonkwo": {
    id: "james-okonkwo",
    name: "James Okonkwo",
    headline: "Principal Engineer @ Stripe",
    company: "Stripe",
    degree: 2,
    avatar: "J"
  },
  "maria-garcia": {
    id: "maria-garcia",
    name: "Maria Garcia",
    headline: "Head of Product @ Canva",
    company: "Canva",
    degree: 2,
    avatar: "M"
  },
  "tom-brewster": {
    id: "tom-brewster",
    name: "Tom Brewster",
    headline: "Founder @ DevStack",
    company: "DevStack",
    degree: 2,
    avatar: "T"
  },
  "dr-anil-kapoor": {
    id: "dr-anil-kapoor",
    name: "Dr. Anil Kapoor",
    headline: "Professor of CS @ IIT Bombay",
    company: "IIT Bombay",
    degree: 2,
    avatar: "K"
  },
  "nina-patel": {
    id: "nina-patel",
    name: "Nina Patel",
    headline: "Partner @ Sequoia Capital",
    company: "Sequoia Capital",
    degree: 2,
    avatar: "N"
  },
  "carlos-rivera": {
    id: "carlos-rivera",
    name: "Carlos Rivera",
    headline: "Director of Eng @ Shopify",
    company: "Shopify",
    degree: 2,
    avatar: "C"
  },
  "emma-zhang": {
    id: "emma-zhang",
    name: "Emma Zhang",
    headline: "AI Research Lead @ DeepMind",
    company: "DeepMind",
    degree: 2,
    avatar: "E"
  }
};

const MOCK_INTERACTIONS = [
  // --- Rahul <-> Sarah Chen (close friends from college) ---
  {
    id: "int-1",
    from: "rahul-mehta",
    to: "sarah-chen",
    postType: "personal_milestone",
    postContent: "Just closed our Series A! NeuralPath is going to change how teams build ML pipelines.",
    comment: "Knew you would close this round. Dinner on me this weekend — we need to celebrate properly.",
    date: "2025-04-18",
    reactions: ["like", "celebrate"]
  },
  {
    id: "int-2",
    from: "rahul-mehta",
    to: "sarah-chen",
    postType: "personal",
    postContent: "Grateful for the people who stuck around through the hard years. You know who you are.",
    comment: "Always. That goes without saying.",
    date: "2025-03-02",
    reactions: ["like"]
  },
  {
    id: "int-3",
    from: "rahul-mehta",
    to: "sarah-chen",
    postType: "professional",
    postContent: "We are hiring ML engineers at NeuralPath. DM if interested.",
    comment: "Vouching for the team here — Sarah builds things that actually work. Rare in this space.",
    date: "2025-01-20",
    reactions: ["like"]
  },

  // --- Sneha <-> James Okonkwo (ex-colleagues at Stripe) ---
  {
    id: "int-4",
    from: "sneha-iyer",
    to: "james-okonkwo",
    postType: "professional",
    postContent: "Reflecting on 5 years at Stripe. Built payment infra that processes $1T+ annually.",
    comment: "The payments redesign you led in 2022 was genuinely the best engineering I have seen. Miss working with you.",
    date: "2025-04-10",
    reactions: ["like", "applause"]
  },
  {
    id: "int-5",
    from: "sneha-iyer",
    to: "james-okonkwo",
    postType: "thought_leadership",
    postContent: "Hot take: microservices are overused. Most startups should stay monolith until Series B.",
    comment: "Remember when we tried to break up the billing monolith and it took 8 months? You were right all along.",
    date: "2025-02-28",
    reactions: ["like"]
  },

  // --- Alex Wong <-> Nina Patel (fundraising / mentor relationship) ---
  {
    id: "int-6",
    from: "alex-wong",
    to: "nina-patel",
    postType: "thought_leadership",
    postContent: "The best founders I have backed share one trait: they talk to 100 customers before writing a line of code.",
    comment: "This is exactly what we did at Meshflow. Nina's advice during our seed round was instrumental. Genuinely grateful for the mentorship.",
    date: "2025-04-05",
    reactions: ["like"]
  },
  {
    id: "int-7",
    from: "alex-wong",
    to: "nina-patel",
    postType: "professional",
    postContent: "Excited to announce Sequoia's new AI-native fund. Looking for founders building infra for the next decade.",
    comment: "Nina has one of the sharpest eyes for developer tools I have encountered. Founders — take the meeting.",
    date: "2025-03-15",
    reactions: ["like"]
  },

  // --- Priya <-> Maria Garcia (professional acquaintance) ---
  {
    id: "int-8",
    from: "priya-sharma",
    to: "maria-garcia",
    postType: "thought_leadership",
    postContent: "Product-led growth isn't dead, it's evolving. Here's what I'm seeing at Canva...",
    comment: "Great insights, thanks for sharing.",
    date: "2025-04-12",
    reactions: ["like"]
  },

  // --- Mike Chen <-> Sarah Chen (professional peers) ---
  {
    id: "int-9",
    from: "mike-chen",
    to: "sarah-chen",
    postType: "professional",
    postContent: "NeuralPath just launched our open-source ML pipeline toolkit.",
    comment: "Tested it over the weekend — the DAG visualization is very clean. Shared with our infra team at Meta.",
    date: "2025-04-20",
    reactions: ["like"]
  },
  {
    id: "int-10",
    from: "mike-chen",
    to: "sarah-chen",
    postType: "thought_leadership",
    postContent: "Why I think feature stores are table stakes for any ML team in 2025.",
    comment: "Solid framing. We reached a similar conclusion at Meta last year. Would be interested to compare notes — DM me.",
    date: "2025-03-08",
    reactions: ["like", "insightful"]
  },

  // --- Vikram <-> Dr. Anil Kapoor (mentor-mentee) ---
  {
    id: "int-11",
    from: "vikram-reddy",
    to: "dr-anil-kapoor",
    postType: "academic",
    postContent: "Our new paper on causal inference in recommendation systems just got accepted at NeurIPS.",
    comment: "This is outstanding work, sir. Everything I know about probability started in your classroom at IIT. Very well deserved recognition.",
    date: "2025-04-15",
    reactions: ["like", "applause"]
  },
  {
    id: "int-12",
    from: "vikram-reddy",
    to: "dr-anil-kapoor",
    postType: "personal_milestone",
    postContent: "Completed 30 years of teaching this semester. What a journey.",
    comment: "You changed a great many lives, sir — mine included. The 2016 batch still talks about your algorithms course. Thank you for everything.",
    date: "2025-01-10",
    reactions: ["like"]
  },

  // --- Lisa Kumar <-> Tom Brewster (engagement farming pattern) ---
  {
    id: "int-13",
    from: "lisa-kumar",
    to: "tom-brewster",
    postType: "thought_leadership",
    postContent: "5 lessons from scaling DevStack to 10K users",
    comment: "Really enjoyed this.",
    date: "2025-04-22",
    reactions: ["like"]
  },
  {
    id: "int-14",
    from: "lisa-kumar",
    to: "tom-brewster",
    postType: "thought_leadership",
    postContent: "Why developer experience is the new competitive moat",
    comment: "So true.",
    date: "2025-04-15",
    reactions: ["like"]
  },
  {
    id: "int-15",
    from: "lisa-kumar",
    to: "tom-brewster",
    postType: "professional",
    postContent: "We just shipped dark mode for DevStack CLI",
    comment: "Great update.",
    date: "2025-04-08",
    reactions: ["like"]
  },
  {
    id: "int-16",
    from: "lisa-kumar",
    to: "tom-brewster",
    postType: "thought_leadership",
    postContent: "The future of low-code is actually no-code",
    comment: "Good read.",
    date: "2025-03-30",
    reactions: ["like"]
  },

  // --- Ananya Das <-> Tom Brewster (single substantive interaction) ---
  {
    id: "int-17",
    from: "ananya-das",
    to: "tom-brewster",
    postType: "professional",
    postContent: "Open-sourcing our internal deployment framework. Built it to solve real pain points at DevStack.",
    comment: "Tom, I want to say this publicly — your deployment framework saved us at Zepto during our last major outage. We were migrating infrastructure at 2am and your documentation on blue-green deployments was the only resource that was clear enough to act on. Genuinely excellent engineering work.",
    date: "2025-03-20",
    reactions: ["like", "applause"]
  },

  // --- Priya <-> Carlos Rivera (evolving relationship) ---
  {
    id: "int-18",
    from: "priya-sharma",
    to: "carlos-rivera",
    postType: "thought_leadership",
    postContent: "Building payments in emerging markets: what I learned at Shopify",
    comment: "Very informative. The UPI integration challenges resonate with what we see at Razorpay.",
    date: "2025-01-15",
    reactions: ["like"]
  },
  {
    id: "int-19",
    from: "priya-sharma",
    to: "carlos-rivera",
    postType: "professional",
    postContent: "Spoke at FinTech Summit 2025 about cross-border payment rails",
    comment: "Carlos, your talk was a highlight. The section on latency vs compliance tradeoffs was particularly useful. Let us catch up at the next conference.",
    date: "2025-03-10",
    reactions: ["like"]
  },
  {
    id: "int-20",
    from: "priya-sharma",
    to: "carlos-rivera",
    postType: "personal",
    postContent: "Ran my first marathon this weekend. 4:32 — not fast but I finished.",
    comment: "We literally talked about this at dinner last week. Knew you would do it. We are running the next one together.",
    date: "2025-04-20",
    reactions: ["like", "celebrate"]
  },

  // --- Mike Chen <-> Emma Zhang (professional respect) ---
  {
    id: "int-21",
    from: "mike-chen",
    to: "emma-zhang",
    postType: "academic",
    postContent: "Our team at DeepMind just published new results on efficient attention mechanisms. 40% less compute, same quality.",
    comment: "Read the paper last night. The sparse attention approach in Section 4 is elegant — we have been attempting something similar at Meta but your masking method is cleaner. Strong work.",
    date: "2025-04-18",
    reactions: ["like", "applause"]
  },

  // --- Sneha <-> Nina Patel (professional acquaintance) ---
  {
    id: "int-22",
    from: "sneha-iyer",
    to: "nina-patel",
    postType: "professional",
    postContent: "Looking for technical advisors for our new portfolio companies. DM if interested.",
    comment: "Interesting opportunity. I have shared this with a few people who may be a good fit.",
    date: "2025-04-01",
    reactions: ["like"]
  },

  // --- Alex Wong <-> Sarah Chen (VC ecosystem connection) ---
  {
    id: "int-23",
    from: "alex-wong",
    to: "sarah-chen",
    postType: "professional",
    postContent: "NeuralPath is hiring. Series A, strong team.",
    comment: "Sarah is one of the most technically rigorous founders I have met. If you want to work on hard ML problems with someone who consistently ships, this is the opportunity.",
    date: "2025-04-19",
    reactions: ["like"]
  },

  // --- Rahul <-> Emma Zhang (weak professional tie) ---
  {
    id: "int-24",
    from: "rahul-mehta",
    to: "emma-zhang",
    postType: "thought_leadership",
    postContent: "Thoughts on the future of transformer architectures in 2025",
    comment: "Interesting perspective. Thanks for sharing.",
    date: "2025-02-10",
    reactions: ["like"]
  },

  // --- Lisa <-> Maria Garcia (moderate professional) ---
  {
    id: "int-25",
    from: "lisa-kumar",
    to: "maria-garcia",
    postType: "professional",
    postContent: "Canva just crossed 150M monthly active users. Incredible milestone.",
    comment: "Congratulations Maria. I would be interested to discuss how you approached the enterprise pivot. We are working through something similar at Figma.",
    date: "2025-03-25",
    reactions: ["like", "applause"]
  },

  // --- Vikram <-> Emma Zhang (conference connection) ---
  {
    id: "int-26",
    from: "vikram-reddy",
    to: "emma-zhang",
    postType: "academic",
    postContent: "Presenting our attention paper at ICML next month.",
    comment: "Looking forward to the talk. Your NeurIPS workshop last year was very strong. I hope to discuss the intersection with recommendation systems.",
    date: "2025-04-22",
    reactions: ["like", "insightful"]
  }
];

// Pre-computed relationship edges (classifier output)
const MOCK_RELATIONSHIPS = [
  {
    source: "rahul-mehta", target: "sarah-chen",
    strength: 0.92, type: "close_friend",
    interactionCount: 3,
    tags: ["informal_language", "emotional", "personal_history", "vouching"],
    summary: "Close personal friends from college. Rahul vouches publicly for Sarah and references shared history across multiple interactions."
  },
  {
    source: "sneha-iyer", target: "james-okonkwo",
    strength: 0.78, type: "ex_colleague",
    interactionCount: 2,
    tags: ["shared_workplace", "technical_respect", "personal_memory", "nostalgia"],
    summary: "Former colleagues at Stripe. Sneha references specific projects and expresses personal nostalgia for the working relationship."
  },
  {
    source: "alex-wong", target: "nina-patel",
    strength: 0.80, type: "mentor",
    interactionCount: 2,
    tags: ["mentorship", "gratitude", "fundraising_context", "mutual_endorsement"],
    summary: "Nina mentored Alex during Meshflow's seed round. Strong mutual professional respect with personal undertones."
  },
  {
    source: "priya-sharma", target: "maria-garcia",
    strength: 0.18, type: "professional_acquaintance",
    interactionCount: 1,
    tags: ["formal_language", "generic_comment", "low_signal"],
    summary: "Single generic professional interaction. No personal connection signals detected."
  },
  {
    source: "mike-chen", target: "sarah-chen",
    strength: 0.58, type: "professional_acquaintance",
    interactionCount: 2,
    tags: ["technical_respect", "industry_peer", "collaboration_interest"],
    summary: "Professional peers in the ML infrastructure space. Substantive technical engagement with expressed interest in further collaboration."
  },
  {
    source: "vikram-reddy", target: "dr-anil-kapoor",
    strength: 0.85, type: "mentor",
    interactionCount: 2,
    tags: ["honorific_usage", "gratitude", "knowledge_attribution", "academic_context"],
    summary: "Former student-professor relationship at IIT Bombay. Deep respect and explicit knowledge attribution from Vikram."
  },
  {
    source: "lisa-kumar", target: "tom-brewster",
    strength: 0.28, type: "professional_acquaintance",
    interactionCount: 4,
    tags: ["high_frequency", "low_depth", "engagement_pattern", "generic_comments"],
    summary: "High-frequency but shallow engagement. All comments are generic one-liners consistent with engagement farming behaviour."
  },
  {
    source: "ananya-das", target: "tom-brewster",
    strength: 0.62, type: "professional_acquaintance",
    interactionCount: 1,
    tags: ["detailed_comment", "technical_depth", "specific_reference", "gratitude"],
    summary: "Single substantive interaction. Ananya attributed Tom's framework with preventing a production outage at Zepto."
  },
  {
    source: "priya-sharma", target: "carlos-rivera",
    strength: 0.76, type: "close_friend",
    interactionCount: 3,
    tags: ["relationship_evolution", "formal_to_informal", "offline_meeting", "shared_interest"],
    summary: "Relationship evolved from formal professional to personal over four months. Evidence of offline meetings."
  },
  {
    source: "mike-chen", target: "emma-zhang",
    strength: 0.55, type: "professional_acquaintance",
    interactionCount: 1,
    tags: ["technical_depth", "peer_respect", "research_context"],
    summary: "Professional peer interaction around published research. Substantive technical engagement."
  },
  {
    source: "sneha-iyer", target: "nina-patel",
    strength: 0.22, type: "professional_acquaintance",
    interactionCount: 1,
    tags: ["formal_language", "low_engagement", "professional_context"],
    summary: "Minimal professional interaction. No personal signals present."
  },
  {
    source: "alex-wong", target: "sarah-chen",
    strength: 0.72, type: "ex_colleague",
    interactionCount: 1,
    tags: ["strong_endorsement", "founder_respect", "startup_ecosystem"],
    summary: "Alex publicly and specifically endorses Sarah as a founder. Likely connected through the VC and startup ecosystem."
  },
  {
    source: "rahul-mehta", target: "emma-zhang",
    strength: 0.15, type: "professional_acquaintance",
    interactionCount: 1,
    tags: ["generic_comment", "formal_language", "low_signal"],
    summary: "Single generic interaction with no personal signals."
  },
  {
    source: "lisa-kumar", target: "maria-garcia",
    strength: 0.45, type: "professional_acquaintance",
    interactionCount: 1,
    tags: ["professional_interest", "collaboration_intent", "moderate_depth"],
    summary: "Professional interest with specific collaboration intent. Moderate signal strength."
  },
  {
    source: "vikram-reddy", target: "emma-zhang",
    strength: 0.48, type: "professional_acquaintance",
    interactionCount: 1,
    tags: ["academic_peer", "conference_connection", "research_interest"],
    summary: "Connected through academic conferences. Mutual interest in overlapping research areas."
  }
];

// Feed items for the live observer panel
const MOCK_FEED_ITEMS = [
  {
    id: "feed-1",
    timestamp: "2 min ago",
    yourConnection: "rahul-mehta",
    theirConnection: "sarah-chen",
    action: "commented on",
    snippet: "Knew you would close this round. Dinner on me this weekend...",
    detectedType: "close_friend",
    detectedStrength: 0.92,
    isNew: true
  },
  {
    id: "feed-2",
    timestamp: "15 min ago",
    yourConnection: "sneha-iyer",
    theirConnection: "james-okonkwo",
    action: "commented on",
    snippet: "The payments redesign you led in 2022 was genuinely the best engineering...",
    detectedType: "ex_colleague",
    detectedStrength: 0.78,
    isNew: true
  },
  {
    id: "feed-3",
    timestamp: "1 hr ago",
    yourConnection: "priya-sharma",
    theirConnection: "carlos-rivera",
    action: "commented on",
    snippet: "We literally talked about this at dinner last week. Knew you would do it...",
    detectedType: "close_friend",
    detectedStrength: 0.76,
    isNew: false
  },
  {
    id: "feed-4",
    timestamp: "2 hrs ago",
    yourConnection: "mike-chen",
    theirConnection: "emma-zhang",
    action: "commented on",
    snippet: "Read the paper last night. The sparse attention approach in Section 4 is elegant...",
    detectedType: "professional_acquaintance",
    detectedStrength: 0.55,
    isNew: false
  },
  {
    id: "feed-5",
    timestamp: "3 hrs ago",
    yourConnection: "vikram-reddy",
    theirConnection: "dr-anil-kapoor",
    action: "commented on",
    snippet: "This is outstanding work, sir. Everything I know about probability started in your classroom...",
    detectedType: "mentor",
    detectedStrength: 0.85,
    isNew: false
  },
  {
    id: "feed-6",
    timestamp: "5 hrs ago",
    yourConnection: "lisa-kumar",
    theirConnection: "tom-brewster",
    action: "commented on",
    snippet: "Really enjoyed this.",
    detectedType: "professional_acquaintance",
    detectedStrength: 0.28,
    isNew: false
  },
  {
    id: "feed-7",
    timestamp: "6 hrs ago",
    yourConnection: "alex-wong",
    theirConnection: "nina-patel",
    action: "commented on",
    snippet: "Nina has one of the sharpest eyes for developer tools I have encountered...",
    detectedType: "mentor",
    detectedStrength: 0.80,
    isNew: false
  },
  {
    id: "feed-8",
    timestamp: "Yesterday",
    yourConnection: "priya-sharma",
    theirConnection: "maria-garcia",
    action: "commented on",
    snippet: "Great insights, thanks for sharing.",
    detectedType: "professional_acquaintance",
    detectedStrength: 0.18,
    isNew: false
  }
];
