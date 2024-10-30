let select = document.querySelector(".select-heading");
let options = document.querySelector(".options");
let arrow = document.querySelector(".select-heading img");
let option = document.querySelectorAll(".option");
let selecttext = document.querySelector(".select-heading span");

select.addEventListener("click", () => {
  options.classList.toggle("active-options");
  arrow.classList.toggle("rotate");
});

option.forEach((item) => {
  item.addEventListener("click", () => {
    selecttext.innerText = item.innerText;
  });
});

//  chatbot code

let prompt = document.querySelector(".prompt");
let chatbtn = document.querySelector(".btn");
let chatContainer = document.querySelector(".chat-container");
let userMessage = null;
let h1 = document.querySelector(".h1");
let chatimg = document.querySelector("#chatbotimg");
let chatbox = document.querySelector(".chat-box");

//
chatimg.addEventListener("click", () => {
  chatbox.classList.toggle("active-chat-box");
  if (chatbox.classList.contains("active-chat-box")) {
    chatimg.src = "cross.svg";
  } else {
    chatimg.src = "chatbot.svg";
  }
});

let Api_url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyABgHqLNin7tGqaSGlZ65Bxu0RIN1VreBg";

//  here we will use gemeini api for chatbot
function createChatBox(html, className) {
  const div = document.createElement("div");
  div.classList.add(className);
  div.innerHTML = html;
  return div;
}
async function generateApiResponse(aiChatBox) {
  const textElement = aiChatBox.querySelector(".text");
  try {
    const response = await fetch(Api_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${userMessage} in 10 words` }],
          },
        ],
      }),
    });
    const data = await response.json();
    const apiResponse = data?.candidates[0].content.parts[0].text.trim();
    textElement.innerText = apiResponse;
  } catch (error) {
    console.log(error);
  } finally {
    aiChatBox.querySelector(".loading").style.display = "none";
  }
}
function showLoading() {
  const html = `<div class="text"></div>
        <img src="load.gif" alt="" height="50" class="loading">`;
  let aiChatBox = createChatBox(html, "ai-chat-box");
  chatContainer.appendChild(aiChatBox);
  generateApiResponse(aiChatBox);
}
// create chatbox function
chatbtn.addEventListener("click", () => {
  h1.style.display = "none";
  userMessage = prompt.value;
  const html = `<div class="text"></div>`;
  let userChatBox = createChatBox(html, "user-chat-box");
  userChatBox.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(userChatBox);
  prompt.value = "";
  setTimeout(showLoading, 500);
});

//  -- VIRTUAL ASSISTANT CODE --//
let ai = document.querySelector("#aiimg");
let speakPage = document.querySelector(".speak-page");
let content = document.querySelector(".speak-page h1");

//  create speak function
function speak(text) {
  let text_speak = new SpeechSynthesisUtterance(text);
  // const allvoice = speechSynthesis.getVoices()
  // text_speak.voice=allvoice[36];
  text_speak.text = text;
  text_speak.rate = 1;
  text_speak.pitch = 1;
  text_speak.volume = 1;
  text_speak.lang = "en-IN"; //hi for hindi and en english
  window.speechSynthesis.speak(text_speak);
}

//  create speeck recognition function
let speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();
recognition.onresult = (e) => {
  speakPage.style.display = "none";
  let currindex = e.resultIndex;
  let transcript = e.results[currindex][0].transcript; // here we are getting data from 0 th index and string data in transcript in console
  content.innerText = transcript;
  takeCommand(transcript.toLowerCase());
};

//  takecommand function
function takeCommand(message) {
  //  we are using self after the link b=soo it cannot open a new tab
  if (message.includes("open") && message.includes("chat")) {
    speak("Okay sir");
    chatbox.classList.add("active-chat-box");
  } else if (message.includes("close") && message.includes("chat")) {
    chatbox.classList.remove("active-chat-box");
  } else if (message.includes("back")) {
    window.open("http://127.0.0.1:5500/back.html", "_self");
  } else if (message.includes("chest")) {
    window.open("http://127.0.0.1:5500/chest.html", "_self");
  } else if (message.includes("shoulder")) {
    window.open("http://127.0.0.1:5500/shoulder.html", "_elf");
  } else if (message.includes("leg")) {
    window.open("http://127.0.0.1:5500/leg.html", "_self");
  } else if (message.includes("bicep") || message.includes("tricep")) {
    window.open("http://127.0.0.1:5500/biceptricep.html", "_self");
  } else if (message.includes("workout") || message.includes("exercise")) {
    window.open("http://127.0.0.1:5500/workout.html", "_self");
  } else if (message.includes("home")) {
    window.open("http://127.0.0.1:5500/index.html", "_self");
  } else if (message.includes("open google")) {
    speak("Opening google...");
    window.open("https://google.com", "_blank");
  } else if (message.includes("open calculator")) {
    speak("Opening calculator...");
    window.open("calculator://");
  } else if (message.includes("open whatsappr")) {
    speak("Opening whatsapp...");
    window.open("whatsapp://");
  } else if (message.includes("time")) {
    // text_speak.lang="en-GB"
    let time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    speak(time);
  } else if (message.includes("date")) {
    // text_speak.lang="en-GB"
    let date = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "short",
    });
    speak(date);
  } else if (message.includes("day")) {
    // text_speak.lang.replace="en-GB"
    let day = new Date().toLocaleString(undefined, { day: "2-digit" });
    speak(day);
  } else {
    let finaltext =
      "this is what i found for you" + message.replace("changuu", "");
    speak(finaltext);
    window.open(`https://www.google.com/search?q=${message}`);
  }
}

//  add event listner to ai gif
ai.addEventListener("click", () => {
  recognition.start();
  speakPage.style.display = "flex";
});
