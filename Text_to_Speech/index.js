const textarea = document.querySelector("textarea"),
  voicelist = document.querySelector("select"),
  speechBtn = document.querySelector("button");

let synth = speechSynthesis;
let isSpeaking = true;

function populateVoices() {
  voicelist.innerHTML = "";
  for (let voice of synth.getVoices()) {
    let selected = voice.name === "Google US English" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voicelist.insertAdjacentHTML("beforeend", option);
  }
}

synth.addEventListener("voiceschanged", populateVoices);

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  for (let voice of synth.getVoices()) {
    if (voice.name === voicelist.value) {
      utterance.voice = voice;
    }
  }
  synth.speak(utterance);
}

speechBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (textarea.value !== "") {
    if (!synth.speaking) {
      textToSpeech(textarea.value);
    }
    if (textarea.value.length > 80) {
      const checkSpeaking = setInterval(() => {
        if (!synth.speaking && !isSpeaking) {
          isSpeaking = true;
          speechBtn.innerText = "Converti in voce - Convert to speech";
          clearInterval(checkSpeaking);
        }
      }, 500);
      if (isSpeaking) {
        synth.resume();
        isSpeaking = false;
        speechBtn.innerText = "Pausa - Pause";
      } else {
        synth.pause();
        isSpeaking = true;
        speechBtn.innerText = "Ricomincia - Restart";
      }
    } else {
      speechBtn.innerText = "Converti - Convert";
    }
  }
});

populateVoices();
