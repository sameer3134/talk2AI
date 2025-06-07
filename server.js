const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");  // Don't forget to import axios

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors({
  origin: "http://localhost:3001",
}));
app.use(express.json());
// Route 1: Transcribe audio and return text
app.post("/transcribe", upload.single("audio"), (req, res) => {
  const audioPath = req.file.path;

  execFile("C:\\Program Files\\Python310\\python.exe", ["transcribe.py", audioPath], (error, stdout, stderr) => {
    fs.unlinkSync(audioPath); // Remove temp file

    if (error) {
      console.error("Whisper error:", stderr || error.message);
      return res.status(500).send({ error: "Transcription failed." });
    }

    const question = stdout.trim(); // Transcribed text
    console.log("Transcribed:", question);

    res.send({ question });
  });
});

// Route 2: Take text and return AI-generated answer
app.post("/answer", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).send({ error: "No question provided." });
  }
console.log(question)
  try {
    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
        max_tokens: 1500,
      },
      {
        headers: {
          "Authorization": `Bearer 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`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = aiResponse.data.choices[0].message.content;
    console.log("AI Response:", reply);

    res.send({ reply });
  } catch (err) {
    console.error("AI error:", err.response ? err.response.data : err.message);
    res.status(500).send({ error: "AI response failed." });
  }
});


app.listen(3000, () => {
  process.on('uncaughtException', console.error);
  process.on('unhandledRejection', console.error);
  console.log("Server listening on http://localhost:3000");
});
