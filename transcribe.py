# transcribe.py
import sys
import whisper

if len(sys.argv) < 2:
    print("No audio file provided")
    sys.exit(1)

audio_file = sys.argv[1]

model = whisper.load_model("base")
result = model.transcribe(audio_file)
print(result["text"])
