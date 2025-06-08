const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ask", async (req, res) => {
  const question = req.body.question;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "אתה מדריך בתכנית דרך פרת. ענה על שאלות על סמינרים, ערכים, עלויות, והתנהלות בצורה נגישה, ברורה ומכבדת."
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 300
    });

    res.json({ answer: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "שגיאה בשרת או במפתח ה-API." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
