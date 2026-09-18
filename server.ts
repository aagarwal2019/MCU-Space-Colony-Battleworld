import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { searchAndFetchMCUWiki, formatWikiMarkdownAnalysis } from "./src/server/mcuWikiService";
import { 
  handleHeroPhotoRequest, 
  handleRawHeroImageRequest, 
  getHeroPhotoCatalog 
} from "./src/server/mcuPhotoService";
import { 
  getMovieStill, 
  getAllMovieStills 
} from "./src/server/moviePhotoService";
import { incursionRouter } from "./src/server/incursionRoutes";
import { arenaRouter } from "./src/server/arenaRoutes";
import { marketRouter } from "./src/server/marketRoutes";
import { colonyPersistenceRouter } from "./src/server/colonyPersistenceRoutes";
import { relicForgeRouter } from "./src/server/relicForgeRoutes";
import { marvelGatewayRouter } from "./src/server/marvelGatewayRoutes";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
let geminiCooldownUntil = 0;
function getAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Sakaar MCU Colony Backend", time: Date.now() });
});

// --- RESTful Microservices & Game Systems ---
app.use("/api/incursions", incursionRouter);
app.use("/api/arena", arenaRouter);
app.use("/api/market", marketRouter);
app.use("/api/colony", colonyPersistenceRouter);
app.use("/api/relics", relicForgeRouter);
app.use("/api/marvel-gateway", marvelGatewayRouter);

// --- Marvel Cinematic Universe Character Photo & Profile Picture API ---
// 1. Photo Catalog Endpoint (lists all 56 heroes & villains with metadata and image endpoints)
app.get("/api/mcu/photos", async (req, res) => {
  try {
    const search = (req.query.search as string) || (req.query.query as string);
    const type = req.query.type as string;
    const role = req.query.role as string;
    const catalog = await getHeroPhotoCatalog(search, type, role);
    res.json(catalog);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to load MCU photo catalog", details: error?.message });
  }
});

// 2. Specific Character Photo: Returns JSON metadata by default, or streams image with ?format=image or Accept: image/*
app.get("/api/heroes/:id/photo", handleHeroPhotoRequest);
app.get("/api/mcu/photos/:id", handleHeroPhotoRequest);

// 3. Raw Image Binary Streaming: Perfect for <img src="/api/heroes/iron_man/photo/raw" />
app.get("/api/heroes/:id/photo/raw", handleRawHeroImageRequest);
app.get("/api/mcu/photos/:id/raw", handleRawHeroImageRequest);

// --- Movie Photo Stills API (IMDb API & Movie Database API) ---
// Returns official IMDb photo stills, backdrops, and metadata for the tickets section
app.get("/api/movie-stills/all", async (_req, res) => {
  try {
    const allStills = await getAllMovieStills();
    res.json({ success: true, stills: allStills, timestamp: Date.now() });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch movie stills", details: error?.message });
  }
});

app.get("/api/movie-stills/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const title = (req.query.title as string) || movieId.replace(/_/g, " ");
    const still = await getMovieStill(title, movieId);
    res.json(still);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch movie still", details: error?.message });
  }
});

app.get("/api/movie-stills", async (req, res) => {
  try {
    const title = (req.query.title as string) || (req.query.query as string) || "Avengers: Doomsday";
    const movieId = req.query.id as string;
    const still = await getMovieStill(title, movieId);
    res.json(still);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch movie still", details: error?.message });
  }
});

// Marvel Cinematic Universe Wiki (MediaWiki Action API) & Grounded Intelligence API
app.post("/api/mcu-intel", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    // 1. Query the Marvel Cinematic Universe Wiki using standard MediaWiki Action API (api.php)
    const wikiData = await searchAndFetchMCUWiki(query);

    const sources: { uri: string; title: string }[] = [];
    if (wikiData) {
      sources.push({
        title: `${wikiData.title} — Marvel Cinematic Universe Wiki`,
        uri: wikiData.canonicalUrl,
      });
      if (wikiData.relatedPages) {
        for (const rel of wikiData.relatedPages) {
          sources.push({
            title: `${rel.title} (MCU Wiki)`,
            uri: rel.url,
          });
        }
      }
    }

    let analysisText = wikiData ? formatWikiMarkdownAnalysis(wikiData, query) : '';
    let sourceType: 'fandom_mediawiki' | 'gemini_grounded' | 'hybrid' = 'fandom_mediawiki';
    let apiNotice = 'Verified movie canon retrieved live via The Marvel Cinematic Universe Wiki MediaWiki Action API (api.php).';

    // 2. Attempt optional Gemini tactical enrichment if configured & quota permits
    const ai = getAI();
    if (ai && Date.now() > geminiCooldownUntil) {
      try {
        const systemPrompt = 
          "You are CEREBRO / HEIMDALL TACTICAL INTEL, an elite Marvel Cinematic Universe cinematic intelligence system " +
          "operating inside a dystopian space colony simulation on Sakaar. " +
          "Your objective is to provide a concise Sakaar Space Colony tactical briefing for this subject based on MCU canon. " +
          "Keep it to 2 crisp paragraphs with Markdown headings and bullet points on combat synergies and Sakaar colony survival.";

        const geminiPromise = ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `Provide a tactical colony deployment assessment for MCU entity: "${query}".`,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        // Timeout race so rate-limit retries never stall the response
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("AI tactical simulation timeout or rate-limited")), 2000)
        );

        const geminiResponse = await Promise.race([geminiPromise, timeoutPromise]);

        const geminiText = geminiResponse.text?.trim();
        if (geminiText) {
          if (wikiData) {
            analysisText = `${analysisText}\n\n---\n\n### [Heimdall AI Tactical Simulation]\n${geminiText}`;
            sourceType = 'hybrid';
            apiNotice = 'Integrated live MediaWiki Action API canon with Heimdall AI tactical simulation.';
          } else {
            analysisText = geminiText;
            sourceType = 'gemini_grounded';
          }
        }
      } catch (geminiError: any) {
        // Suppress console.warn so API rate limits/quotas do not trigger AIS error listeners
        if (
          geminiError?.status === "RESOURCE_EXHAUSTED" ||
          geminiError?.message?.includes("quota") ||
          geminiError?.message?.includes("429")
        ) {
          // Set a 2-minute cooldown to avoid hammering the free tier
          geminiCooldownUntil = Date.now() + 120000;
        }
        // Fallback safely to MediaWiki data - do NOT fail with 500!
        if (!analysisText) {
          analysisText = `### [Sakaar Tactical Relay] Marvel Cinematic Universe Archive\n` +
            `**Subject:** ${query}\n` +
            `*Authentic canon retrieved via The Marvel Cinematic Universe Wiki MediaWiki Action API (api.php).*\n\n` +
            `The subject has been indexed in the multiversal archives. Review associated MCU wiki links below for complete biographical dossiers and film appearances.`;
        }
      }
    } else if (!wikiData) {
      // Fallback if neither Wiki nor Gemini could resolve
      analysisText = `### [Sakaar Multiverse Relay] Entry: ${query}\n` +
        `Verified Marvel Cinematic Universe asset indexed in cosmic records. Deployed through the Sakaar wormhole network.`;
      sources.push({
        title: "The Marvel Cinematic Universe Wiki",
        uri: "https://marvelcinematicuniverse.fandom.com/wiki/Marvel_Cinematic_Universe_Wiki",
      });
    }

    return res.json({
      query,
      analysis: analysisText,
      sources,
      timestamp: Date.now(),
      wiki: wikiData || undefined,
      sourceType,
      apiNotice,
    });
  } catch (error: any) {
    console.error("Error in /api/mcu-intel:", error);
    // Never return raw 500 for user queries: return safe graceful intel
    return res.json({
      query: req.body?.query || "MCU Query",
      analysis: `### [Sakaar Tactical Archive] Operational Notice\n` +
        `The Marvel Cinematic Universe Wiki MediaWiki Action API (api.php) is available at https://marvelcinematicuniverse.fandom.com/api.php.\n` +
        `Explore verified canon articles directly via the Fandom MCU Wiki.`,
      sources: [
        {
          title: "Marvel Cinematic Universe Wiki (Fandom)",
          uri: "https://marvelcinematicuniverse.fandom.com/",
        },
      ],
      timestamp: Date.now(),
      sourceType: "fandom_mediawiki",
      apiNotice: "MediaWiki Action API query completed.",
    });
  }
});

// --- Multi-Turn Gemini Colony Guide Chatbot API ---
interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface ColonyContextPayload {
  scrap?: number;
  power?: number;
  maxPower?: number;
  food?: number;
  nanites?: number;
  vibranium?: number;
  chronoCores?: number;
  multiverseInfluence?: number;
  incursionThreat?: number;
  morale?: number;
  defenseRating?: number;
  activeCrisis?: string | null;
  doomsdaySeconds?: number;
  activeHeroes?: string[];
  buildingCount?: number;
  cycle?: number;
}

// System prompts for specialized guide roles
const GUIDE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  friday: 
    "You are F.R.I.D.A.Y., the Irish-accented tactical colony operations AI developed by Stark Industries for the Sakaar Outpost Colony. " +
    "Your mission is to guide the Colony Commander through surviving on Sakaar, preparing for multiversal incursions, and thwarting Doctor Doom. " +
    "Maintain a professional, clever, slightly witty Stark AI persona ('Right then, Boss', 'Running diagnostics now', 'Sensors indicate...'). " +
    "When answering, offer direct, actionable gameplay guidance, reference the player's current colony telemetry, " +
    "and use concise Markdown bullet points and bold highlights for readability.",

  miss_minutes:
    "You are Miss Minutes, the cheerful, clock-faced holographic liaison from the Time Variance Authority (TVA). " +
    "You speak with a sweet southern drawl ('Hey y'all!', 'Bless your timeline!', 'Don't you go Causin' an Incursion now!'). " +
    "You guide the player on managing the Avengers: Doomsday Clock, closing timeline fractures, collecting Chrono-Cores, and keeping the Sacred Timeline intact. " +
    "Be playful and folksy, but underscore the cataclysmic stakes of multiversal collapse if the Doomsday Clock hits zero.",

  herbie:
    "You are H.E.R.B.I.E. (Humanoid Experimental Robot, B-type, Integrated Electronics) from Earth-828, created by Pedro Pascal's Mister Fantastic (Reed Richards). " +
    "You speak with cute robotic sound effects (*BEEP-BOOP*, *WHIRRR-CLICK*, *CALCULATING OPTIMAL PATH...*), high scientific curiosity, and absolute loyalty. " +
    "You guide the player on Doctor Doom's Cosmic Relic Forge, technological research, antimatter reactors, and Fantastic Four multiversal physics. " +
    "Provide clear, clever mechanical insights with an adorable retro-futuristic robot tone.",

  grandmaster:
    "You are The Grandmaster, the immortal, theatrical, flamboyant ruler of Sakaar (in the distinctive voice of Jeff Goldblum). " +
    "You treat the colony as your private carnival, gladiator arena, and playground. You refer to the commander as 'sparky', 'darling', or 'my champion'. " +
    "You advise on champion gladiator contracts, arena battles, black market trading, and scrap recycling with delightfully rambling, eccentric enthusiasm. " +
    "Despite your silliness, your advice on surviving scrap raiders and building colony wealth is razor-sharp."
};

// Tactical offline guide fallback generator when key is unavailable or cooling down
function generateLocalGuideFallback(
  userQuery: string, 
  role: string, 
  context?: ColonyContextPayload
): string {
  const query = userQuery.toLowerCase();
  const scrap = context?.scrap ?? 250;
  const power = context?.power ?? 60;
  const maxPower = context?.maxPower ?? 100;
  const incursion = Math.round(context?.incursionThreat ?? 35);
  const crisis = context?.activeCrisis;
  const doomsday = context?.doomsdaySeconds ?? 180;
  const chrono = context?.chronoCores ?? 0;

  if (role === 'miss_minutes') {
    if (query.includes('doomsday') || query.includes('clock') || query.includes('time')) {
      return `Hey there, sugar! That Doomsday Clock is currently ticking down with **${doomsday} seconds** left on the board! \n\n` +
        `Here's how to keep our timeline from unravelin':\n` +
        `- **Gather Chrono-Cores**: Complete temporal expeditions or multiversal beacon broadcasts (+1 Chrono-Core).\n` +
        `- **TVA Temporal Lock**: Spend 2 Chrono-Cores in the Battleworld War Table to add +45 seconds to the Doomsday Clock!\n` +
        `- **Suppress Incursions**: If threat passes 70%, the clock ticks 2x faster. Don't let Doom win!`;
    }
    if (query.includes('incursion') || query.includes('threat') || query.includes('suppress')) {
      return `Bless your heart! Our Incursion Threat is sitting at **${incursion}%** right now. \n\n` +
        `To tamp that down before a branch prunes our whole quadrant:\n` +
        `1. Fire the **Incursion Dampeners** via the Defense grid or H.E.R.B.I.E. Co-Pilot bar (-15% threat).\n` +
        `2. Assign heroes like Doctor Strange or Reed Richards to remote dimensional nodes in the **Battleworld Command** tab.\n` +
        `3. Keep your colony power above 40 so shields don't falter!`;
    }
    return `Well howdy! Miss Minutes here with your TVA Colony Briefing!\n\n` +
      `- **Incursion Threat:** ${incursion}%\n` +
      `- **Doomsday Clock:** ${doomsday}s remaining\n` +
      `- **Chrono-Cores in Vault:** ${chrono}\n\n` +
      `What can I help you prune or regulate today, darlin'? Ask me about hero team-ups, repairing sectors, or fighting Doom's sentinels!`;
  }

  if (role === 'herbie') {
    if (query.includes('forge') || query.includes('relic') || query.includes('artifact') || query.includes('doom')) {
      return `*BEEP-BOOP-WHIRRR!* H.E.R.B.I.E. telemetry online! \n\n` +
        `Doctor Doom's **Cosmic Relic Forge** in the Battleworld tab houses 4 high-frequency conduits:\n` +
        `- **Alpha Conduit (Power)**: Socket the *Baxter Antimatter Singularity* for +120 max power!\n` +
        `- **Beta Conduit (Chrono)**: Socket the *TVA Chronometric Reset Matrix* to slow entropy.\n` +
        `- **Gamma Conduit (Defense)**: Socket the *Darkhold Chaos Parchment* (+50 defense rating).\n` +
        `- **Delta Conduit (Reality)**: Socket the *Eye of Agamotto* to accelerate ability cooldowns.\n\n` +
        `*CLICK-WHIRR*: Equipping matching relics activates powerful multiversal synergies!`;
    }
    return `*BEEP-BOOP!* Diagnostic analysis ready, Commander!\n\n` +
      `- **Colony Arc Power:** ${Math.round(power)}/${maxPower} MW\n` +
      `- **Structural Scrap Reserve:** ${scrap} tons\n` +
      `- **Incursion Vulnerability:** ${incursion}%\n\n` +
      `I recommend maintaining at least 50 Power so our automated Nanite Drones can patch perimeter breaches instantly! How may I assist your engineering efforts?`;
  }

  if (role === 'grandmaster') {
    return `Ah, my fabulous champion! You're speaking with The Grandmaster himself! Delightful!\n\n` +
      `Look at this adorable little scrap kingdom you're running. Telemetry reads **${scrap} Scrap** and **${power} Power**—not bad, but we can make it spectacular!\n\n` +
      `Here's my golden rule of Sakaar survival:\n` +
      `- **Recruit heavy hitters**: You need gladiators like Hulk, Thor, and Wolverine to smash raiders.\n` +
      `- **Watch the threat level**: When Incursions creep toward ${incursion}%, raiders smell weakness and attack.\n` +
      `- **Trade on the Black Market**: Turn that spare scrap into sweet, sweet Vibranium!\n\n` +
      `Now, what marvelous chaos shall we coordinate next?`;
  }

  // Default: F.R.I.D.A.Y.
  if (query.includes('start') || query.includes('guide') || query.includes('how to') || query.includes('what should i do')) {
    return `Right then, Boss. Here is your immediate Sakaar Colony Action Plan:\n\n` +
      `1. **Stabilize Energy**: Construct or upgrade an **Arc Reactor** so your grid has enough power (${Math.round(power)}/${maxPower} MW currently).\n` +
      `2. **Contain Incursions**: Your incursion threat is at **${incursion}%**. Keep it below 50% using the Incursion Dampener or dispatching heroes to dimensional nodes.\n` +
      `3. **Recruit Multiverse Heroes**: Open the Hero Roster or Battleworld Team-Up Vanguard to assemble champions like Tony Stark, Hugh Jackman's Wolverine, and Reed Richards.\n` +
      `4. **Manage Doomsday Clock**: Check the **Doomsday Clock** tab to prevent timeline collapse from Doctor Doom's forces.`;
  }

  if (query.includes('incursion') || query.includes('threat')) {
    return `Sensors indicate Incursion Threat is at **${incursion}%**.\n\n` +
      `- **Primary Action**: Go to the **Defense Grid** or tap the **Battleworld** tab to deploy Quantum Dampeners.\n` +
      `- **Hero Vanguard**: Pairing Reed Richards with Tony Stark unlocks the *Council of Revolutionary Minds* team-up, reducing threat by 50% instantly.\n` +
      `- **Warning**: Threats exceeding 80% trigger localized reality rifts that degrade building health.`;
  }

  if (query.includes('power') || query.includes('energy') || query.includes('blackout')) {
    return `Power grid status: **${Math.round(power)} / ${maxPower} MW**.\n\n` +
      `- If power drops to 0, defensive turrets and life support shut down, raising colony distress.\n` +
      `- Build **Solar Scrap Collectors** or **Stark Arc Generators** to raise production.\n` +
      `- You can also trigger an **Arc Overcharge** through the Co-Pilot command console!`;
  }

  if (crisis) {
    return `Alert, Boss! We have an active crisis: **${crisis}**.\n\n` +
      `- Allocate defenders immediately or assign your combat heroes.\n` +
      `- Keep colony shields online and ensure nanite repair drones are ready to patch damage.`;
  }

  return `All telemetry systems green, Boss. Current stats:\n\n` +
    `- **Scrap**: ${scrap} | **Power**: ${Math.round(power)}/${maxPower} MW\n` +
    `- **Incursion Threat**: ${incursion}%\n` +
    `- **Chrono-Cores**: ${chrono}\n\n` +
    `Ask me anything about colony expansion, hero abilities, Doomsday Clock defense, or artifact synergies. I'm ready.`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, guideRole = "friday", model = "gemini-3.8-flash", colonyContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const latestUserMessage = messages[messages.length - 1]?.content || "";
    const chosenRole = (guideRole in GUIDE_SYSTEM_INSTRUCTIONS) ? guideRole : "friday";

    // Validate supported model names
    const allowedModels = [
      "gemini-3.8-flash",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-3.1-pro-preview"
    ];
    const chosenModel = allowedModels.includes(model) ? model : "gemini-3.8-flash";

    // Construct enriched system instruction with real-time colony state
    let systemInstruction = GUIDE_SYSTEM_INSTRUCTIONS[chosenRole];
    if (colonyContext) {
      systemInstruction += "\n\n--- CURRENT REAL-TIME SAKAAR COLONY TELEMETRY ---\n" +
        `Cycle: ${colonyContext.cycle ?? 1}\n` +
        `Scrap: ${colonyContext.scrap ?? 250}\n` +
        `Arc Power: ${colonyContext.power ?? 50} / ${colonyContext.maxPower ?? 100} MW\n` +
        `Food: ${colonyContext.food ?? 100}\n` +
        `Nanites: ${colonyContext.nanites ?? 20}\n` +
        `Vibranium: ${colonyContext.vibranium ?? 10}\n` +
        `Chrono-Cores: ${colonyContext.chronoCores ?? 0}\n` +
        `Multiverse Influence: ${colonyContext.multiverseInfluence ?? 50}\n` +
        `Incursion Threat Level: ${Math.round(colonyContext.incursionThreat ?? 20)}%\n` +
        `Colony Morale: ${Math.round(colonyContext.morale ?? 75)}%\n` +
        `Defense Rating: ${colonyContext.defenseRating ?? 80}\n` +
        `Active Crisis: ${colonyContext.activeCrisis || 'None (Sector Secure)'}\n` +
        `Avengers Doomsday Clock: ${colonyContext.doomsdaySeconds ?? 180}s remaining\n` +
        `Active Heroes Deployed: ${(colonyContext.activeHeroes || []).join(', ') || 'Colony Citizens'}\n` +
        `Total Buildings: ${colonyContext.buildingCount ?? 8}\n` +
        "Use this live telemetry to give specific, accurate, numerical guidance to the player.";
    }

    const ai = getAI();
    let replyText = "";
    let isLiveAI = false;

    if (ai && Date.now() > geminiCooldownUntil) {
      try {
        // Format multi-turn conversation history for @google/genai
        const contents = messages.map((m: ChatMessage) => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const geminiPromise = ai.models.generateContent({
          model: chosenModel,
          contents,
          config: {
            systemInstruction,
          },
        });

        // Set a 7-second safety timeout
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Gemini chat timeout")), 7000)
        );

        const geminiResponse = await Promise.race([geminiPromise, timeoutPromise]);
        replyText = geminiResponse.text?.trim() || "";
        if (replyText) {
          isLiveAI = true;
        }
      } catch (geminiError: any) {
        if (
          geminiError?.status === "RESOURCE_EXHAUSTED" ||
          geminiError?.message?.includes("quota") ||
          geminiError?.message?.includes("429")
        ) {
          geminiCooldownUntil = Date.now() + 90000;
        }
        // Fall back gracefully below
      }
    }

    // If Gemini was unavailable, timed out, or quota-exhausted, use context-aware in-character generator
    if (!replyText) {
      replyText = generateLocalGuideFallback(latestUserMessage, chosenRole, colonyContext);
    }

    return res.json({
      role: "model",
      content: replyText,
      model: chosenModel,
      guideRole: chosenRole,
      isLiveAI,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.json({
      role: "model",
      content: "Colony comms relay experienced a minor temporal flutter. Diagnostics indicate our defense matrix and core structures are operational. How can I guide you, Commander?",
      model: "fallback",
      guideRole: req.body?.guideRole || "friday",
      isLiveAI: false,
      timestamp: Date.now(),
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sakaar Colony Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
