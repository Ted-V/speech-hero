// Web Speech API
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

// DOM Elements
var output = document.getElementById('output');
var result = document.getElementById("matchPercentage");
var script = document.getElementById("script");

var recordBtn = document.getElementById('recordBtn');
var compareBtn = document.getElementById("compare");
let clearBtn = document.getElementById("clearBtn");
let hideBtn = document.getElementById("hideBtn");

// Voice to Text Functions
function recordSpeech() {
    recordBtn.disabled = true;
    recordBtn.textContent = 'Recording in progress';

    var recognition = new SpeechRecognition();

    recognition.start();
    recognition.onresult = function (event) {
        var speechResult = event.results[0][0].transcript.toLowerCase();
        output.textContent = `${speechResult}`;

        console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onspeechend = function () {
        recognition.stop();
        recordBtn.disabled = false;
        recordBtn.textContent = 'Start new recording';
    }

    // Errors
    recognition.onerror = function (event) {
        recordBtn.disabled = false;
        recordBtn.textContent = 'Start new record';
        output.textContent = 'Error occurred in recognition: ' + event.error;
    }

    recognition.onaudiostart = function (event) {
        //Fired when the user agent has started to capture audio.
        console.log('SpeechRecognition.onaudiostart');
    }

    recognition.onaudioend = function (event) {
        //Fired when the user agent has finished capturing audio.
        console.log('SpeechRecognition.onaudioend');
    }

    recognition.onend = function (event) {
        //Fired when the speech recognition service has disconnected.
        console.log('SpeechRecognition.onend');
    }

    recognition.onnomatch = function (event) {
        //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        console.log('SpeechRecognition.onnomatch');
    }

    recognition.onsoundstart = function (event) {
        //Fired when any sound — recognisable speech or not — has been detected.
        console.log('SpeechRecognition.onsoundstart');
    }

    recognition.onsoundend = function (event) {
        //Fired when any sound — recognisable speech or not — has stopped being detected.
        console.log('SpeechRecognition.onsoundend');
    }

    recognition.onspeechstart = function (event) {
        //Fired when sound that is recognised by the speech recognition service as speech has been detected.
        console.log('SpeechRecognition.onspeechstart');
    }
    recognition.onstart = function (event) {
        //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
        console.log('SpeechRecognition.onstart');
    }
}

recordBtn.addEventListener('click', function () {
    recordSpeech()
});

// Similarity calculation
function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

compareBtn.addEventListener('click', function () {
    let ratio = Math.round(similarity(document.getElementById("output").value, document.getElementById("script").value) * 10000) / 100;
    result.textContent = `${ratio}% Match`;
});

// Clear script text
function clearInput(input) {
    input.value = '';
};

clearBtn.addEventListener("click", function () {
    clearInput(script);
});

// Hide script
function toggleHideBtnText() {
    if (hideBtn.textContent == "Hide Script") {
        hideBtn.textContent = "Unhide Script";
    } else {
        hideBtn.textContent = "Hide Script"
    }
};

function hideScript() {
    toggleHideBtnText();
    script.classList.toggle('hiddenScript');
};

hideBtn.addEventListener('click', function () {
    hideScript();
});