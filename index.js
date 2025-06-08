const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/ask", async (req, res) => {
  const question = req.body.question;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "אתה מדריך בתכנית דרך פרת. ענה על שאלות על סמינרים, מחויבויות, ערכים, מדריכים ותהליכי קבלה.",
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = response.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("No answer returned from OpenAI");
    }

    res.json({ answer }); // שולח JSON עם שדה 'answer' שמתאים למה שהקוד בצ'אט מצפה לו
  } catch (error) {
    console.error("Error in /ask:", error);
    res.status(500).json({ answer: "שגיאה בטיפול בשאלה. נסה שוב מאוחר יותר." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
