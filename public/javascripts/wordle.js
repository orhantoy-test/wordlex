const keyCodes = {
  A: 65,
  Z: 90,
  Backspace: 8,
  Enter: 13,
};

const wordleLength = 5;

function Guess({ letters }) {
  return React.createElement(
    "div",
    { className: "wordle-guess" },
    letters.map((letter, index) => {
      let letterClassNames = ["wordle-letter"];
      if (letter.result !== null) {
        letterClassNames.push(`wordle-letter--${letter.result}`);
      }

      return React.createElement(
        "div",
        { key: index, className: letterClassNames.join(" ") },
        React.createElement("span", null, letter.value)
      );
    })
  );
}

function Wordle() {
  const [guess, setGuess] = React.useState("");
  const [guessResult, setGuessResult] = React.useState(null);

  const submitWordle = React.useCallback(async () => {
    if (guess.length !== wordleLength) return;

    const res = await fetch("/wordle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess }),
    });
    const jsonResponse = await res.json();

    if (res.ok) {
      setGuessResult(jsonResponse);
    } else {
      console.error("Error response", jsonResponse);
    }
  }, [guess]);

  React.useEffect(() => {
    if (guessResult && guessResult.outcome === "win") return;

    const onKeyUp = (e) => {
      if (e.keyCode >= keyCodes.A && e.keyCode <= keyCodes.Z) {
        setGuess((prev) =>
          `${prev}${e.key}`.slice(0, wordleLength).toUpperCase()
        );
      } else if (e.keyCode === keyCodes.Backspace) {
        setGuess((prev) => prev.slice(0, prev.length - 1));
        setGuessResult(null);
      } else if (e.keyCode === keyCodes.Enter) {
        submitWordle();
      }
    };

    window.addEventListener("keyup", onKeyUp);

    return () => window.removeEventListener("keyup", onKeyUp);
  }, [guessResult, submitWordle]);

  const guessAsLetters = new Array(wordleLength);
  for (let i = 0; i < guessAsLetters.length; i++) {
    let result = null;
    const value = guess.charAt(i);

    if (guessResult !== null) {
      if ("letters" in guessResult) {
        const entry = guessResult.letters[i];

        if (entry && entry.value === value) {
          result = entry.result;
        }
      }
    }

    guessAsLetters[i] = { value, result };
  }

  return React.createElement(
    React.Fragment,
    null,
    guessResult && guessResult.outcome === "win"
      ? React.createElement("div", { style: { fontSize: "5rem", margin: "0 0 1rem", textAlign: "center" } }, " 🎉")
      : null,
    React.createElement(Guess, { letters: guessAsLetters })
  );

  return;
}

window.addEventListener("DOMContentLoaded", function () {
  const mountNode = document.getElementById("wordle-mount-node");
  ReactDOM.render(React.createElement(Wordle), mountNode);
});
