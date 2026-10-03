require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/correct", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                error: "Please enter a sentence."
            });
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a sentence correction assistant. Correct grammar, spelling, punctuation, and sentence structure. Return only the corrected sentence."
                        },
                        {
                            role: "user",
                            content: text
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data);

            return res.status(response.status).json({
                error: "AI API request failed."
            });
        }

        const corrected =
            data.choices?.[0]?.message?.content?.trim();

        res.json({
            original: text,
            corrected: corrected || text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Server error."
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `Sentence.io running at http://localhost:${PORT}`
    );
});