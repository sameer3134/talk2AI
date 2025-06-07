import './App.css';
import AudioTranscriber from './components/audioTranscriber';

function App() {
  return (
    <div className="App">
     <AudioTranscriber/>
    </div>
  );
}

export default App;


// const express = require("express");
// const multer = require("multer");
// const { execFile } = require("child_process");
// const path = require("path");
// const cors = require("cors");
// const fs = require("fs");
// const axios = require("axios");  // Don't forget to import axios

// const app = express();
// const upload = multer({ dest: "uploads/" });

// app.use(cors({
//   origin: "http://localhost:3001",
// }));

// app.post("/transcribe", upload.single("audio"), async (req, res) => {  // Marking as async
//   const audioPath = req.file.path;

//   execFile("C:\\Program Files\\Python310\\python.exe", ["transcribe.py", audioPath], async (error, stdout, stderr) => {  // Using async here for axios
//     fs.unlinkSync(audioPath); // Clean up

//     if (error) {
//       console.error("Whisper error:", stderr || error.message);
//       return res.status(500).send({ error: "Transcription failed." });
//     }

//     const question = stdout.trim();  // the spoken text
// console.log(question)
//     try {
//       // Await the axios call to handle it asynchronously
//       // Send the transcribed question to OpenRouter API for AI response
//     const aiResponse = await axios.post(
//       "https://openrouter.ai/api/v1/chat/completions",
//       {
//         model: "openai/gpt-4o", // Replace with a valid model ID
//         messages: [
//           { role: "system", content: "You are a helpful assistant." },
//           { role: "user", content: question },
//         ],
//         max_tokens: 1500,  
//       },
//       {
//         headers: {
//           "Authorization": `Bearer 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`,  // Replace with your actual API key
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("S",aiResponse.data)

//     // Access the AI response from OpenRouter
//     const reply = aiResponse.data.choices[0].message.content;  
// console.log("m",reply)
//       // Send back both the question and the AI response
//       res.send({
//         question,
//         reply,
//       });
//     } catch (err) {
//       console.error("AI error:", err.response ? err.response.data : err.message);
//       res.status(500).send({ error: "AI response failed." });
//     }
//   });
// });

// app.listen(3000, () => {
//   process.on('uncaughtException', console.error);
//   process.on('unhandledRejection', console.error);
//   console.log("Server listening on http://localhost:3000");
// });
