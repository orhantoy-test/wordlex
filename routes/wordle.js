// @ts-check

var express = require("express");
var router = express.Router();

const resultTypes = {
  CorrectPosition: "correct",
  InWord: "in-word",
  NotInWord: "not-in-word",
};

const wordleLength = 5;
const wordle = "FANCY";

router.post("/", function (req, res, next) {
  const { guess } = req.body;

  if (!guess || typeof guess !== "string") {
    res.status(400).json({ error: "Guess (string) must be provided" });
    return;
  }

  if (guess.length !== wordleLength) {
    res.status(400).json({ error: "Guess must consist of 5 characters" });
    return;
  }

  const letters = new Array(5);
  for (let i = 0; i < letters.length; i++) {
    const result = resultTypes.NotInWord; // TODO: Use other result types depending on whether or not letter matches.
    letters[i] = { value: guess.charAt(i), result };
  }

  res.json({ letters, outcome: guess == wordle ? "win" : null });
});

module.exports = router;
