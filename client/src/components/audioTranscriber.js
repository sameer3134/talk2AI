import React, { useState, useRef } from "react";

function AudioTranscriber() {
  const [recording, setRecording] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    setQuestion("");
    setAnswer("");
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        try {
          const res1 = await fetch("http://localhost:3000/transcribe", {
            method: "POST",
            body: formData,
          });
          const data1 = await res1.json();
          if (!res1.ok) throw new Error(data1.error || "Transcription failed");

          const question = data1.question;
          setQuestion(question);

          const res2 = await fetch("http://localhost:3000/answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
          });
          const data2 = await res2.json();
          if (!res2.ok) throw new Error(data2.error || "AI response failed");

          setAnswer(data2.reply);
          speakText(data2.reply);
        } catch (err) {
          setError(err.message || "Something went wrong");
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (err) {
      setError("Mic access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "auto",
      marginTop: "5rem",
      padding: "2rem",
      border: "1px solid #ddd",
      borderRadius: "12px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      fontFamily: "'Segoe UI', sans-serif",
    },
    heading: {
      textAlign: "center",
      marginBottom: "1.5rem",
      color: "#333",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: recording ? "#e74c3c" : "#3498db",
      color: "white",
      cursor: "pointer",
      transition: "background-color 0.3s",
      display: "block",
      margin: "0 auto",
    },
    error: {
      color: "red",
      textAlign: "center",
      marginTop: "1rem",
    },
    resultBlock: {
      marginTop: "2rem",
      backgroundColor: "#fff",
      padding: "1rem",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    },
    label: {
      fontWeight: "600",
      color: "#444",
    },
    text: {
      marginBottom: "1rem",
      color: "#555",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎤 Speak to Transcribe & Get Answer</h2>
      <button onClick={recording ? stopRecording : startRecording} style={styles.button}>
        {recording ? "⏹ Stop Recording" : "🎙 Start Recording"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {(question || answer) && (
        <div style={styles.resultBlock}>
          {question && (
            <div style={styles.text}>
              <span style={styles.label}>Question:</span> {question}
            </div>
          )}
          {answer && (
            <div style={styles.text}>
              <span style={styles.label}>Answer:</span> {answer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AudioTranscriber;
