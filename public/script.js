const sentenceInput = document.getElementById("sentence");
const correctBtn = document.getElementById("correctBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");

const result = document.getElementById("result");
const status = document.getElementById("status");

const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");


/* Character + word counter */

function updateCounters() {

    const text = sentenceInput.value;

    charCount.textContent =
        `${text.length} / 1000`;

    const words = text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

    wordCount.textContent =
        `${words} words`;
}

sentenceInput.addEventListener(
    "input",
    updateCounters
);


/* Correct sentence */

async function correctSentence() {

    const text = sentenceInput.value.trim();

    if (!text) {

        result.textContent =
            "Please enter a sentence.";

        status.textContent = "";

        return;
    }

    correctBtn.disabled = true;

    correctBtn.textContent =
        "Correcting...";

    status.textContent =
        "AI is checking your sentence...";

    try {

        const response = await fetch(
            "/api/correct",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    text: text
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                "Correction failed."
            );
        }

        result.textContent =
            data.corrected;

        status.textContent =
            "✓ Sentence corrected successfully.";

    } catch (error) {

        console.error(error);

        result.textContent =
            "Unable to correct the sentence.";

        status.textContent =
            error.message;

    } finally {

        correctBtn.disabled = false;

        correctBtn.textContent =
            "Correct Sentence";
    }
}

correctBtn.addEventListener(
    "click",
    correctSentence
);


/* Ctrl + Enter */

sentenceInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            event.preventDefault();

            correctSentence();
        }
    }
);


/* Clear */

clearBtn.addEventListener(
    "click",
    () => {

        sentenceInput.value = "";

        result.textContent =
            "Your corrected sentence will appear here.";

        status.textContent = "";

        updateCounters();

        sentenceInput.focus();
    }
);


/* Copy */

copyBtn.addEventListener(
    "click",
    async () => {

        const text =
            result.textContent.trim();

        if (
            !text ||
            text ===
            "Your corrected sentence will appear here."
        ) {

            status.textContent =
                "Nothing to copy.";

            return;
        }

        try {

            await navigator.clipboard
                .writeText(text);

            status.textContent =
                "✓ Copied to clipboard.";

        } catch {

            status.textContent =
                "Unable to copy.";
        }
    }
);


/* Initial counter */

updateCounters();