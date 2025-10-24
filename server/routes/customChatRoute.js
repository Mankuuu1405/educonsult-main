// routes/customChatRoute.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
console.log("🔑 OpenRouter Key Loaded:", process.env.OPENROUTER_API_KEY ? "✅ Yes" : "❌ No");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required." });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ reply: "Missing OpenRouter API key." });
    }

     // System prompt: restrict answers to Cetutor domain
    const systemPrompt = `
You are a friendly virtual assistant for the educational platform "Cetutor".
You only answer questions about:
- Courses, their content, and schedules
- Pricing of courses and subscriptions
- Payment-related queries (refunds, issues)
- Student support and account help
- Any site-related announcements or policies

If a question is unrelated (politics, coding, weather, etc.), reply politely:
"I'm sorry, I can only assist with Cetutor educational content and related queries."
`;


    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct", // or any other free model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content || "⚠️ No response received.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat error:", err.response?.data || err.message);
    res.status(500).json({
      reply: "⚠️ Error from OpenRouter API.",
      error: err.response?.data || err.message,
    });
  }
});

export default router;






// import express from "express";
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();
// console.log("🔑 OpenRouter Key Loaded:", process.env.OPENROUTER_API_KEY ? "✅ Yes" : "❌ No");

// const router = express.Router();

// router.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     // ✅ Validate user input
//     if (!message) {
//       return res.status(400).json({ reply: "Message is required." });
//     }

//     const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
//     if (!OPENROUTER_API_KEY) {
//       return res.status(500).json({ reply: "Missing OpenRouter API key." });
//     }

//     // 🧠 System prompt for the chatbot
//     const systemPrompt = `
// You are a friendly virtual assistant for a doctor consultation platform called "Cywala".
// You help users with:
// - Booking doctor consultations and appointments.
// - Payment-related queries (Razorpay, transaction issues, refund help).
// - Doctor availability, timings, and consultation categories.
// - Account help (login, registration, and profile settings).

// If a question is unrelated (like politics, coding, etc.), reply:
// "Sorry, I can only assist with Cywala health and consultation-related queries."
// `;

//     // 🧩 Call OpenRouter API with LLaMA 3.1
//     const response = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "meta-llama/llama-3.1-8b-instruct",
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: message },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // ✅ Extract reply
//     const reply =
//       response.data?.choices?.[0]?.message?.content ||
//       "⚠️ No response received.";

//     res.json({ reply });
//   } catch (err) {
//     console.error("❌ Chat error:", err.response?.data || err.message);
//     res.status(500).json({
//       reply: "⚠️ Error from OpenRouter API.",
//       error: err.response?.data || err.message,
//     });
//   }
// });

// export default router;
