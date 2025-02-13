export class UIManager {
  /**
   * @param {RandomSelector}
   * @param {SelectionAnimator}
   */
  constructor(randomSelector, selectionAnimator) {
    // Components
    this.randomSelector = randomSelector;
    this.selectionAnimator = selectionAnimator;

    // UI Elements
    this.spinButton = document.querySelector("#spinButton");
    this.addButton = document.querySelector("#addButton");
    this.clearButton = document.querySelector("#clearButton");
    this.nameInput = document.querySelector("#nameInput");
    this.display = document.querySelector("#resultDisplay");
    this.nameList = document.querySelector("#nameList");

    // Event Listeners
    this.spinButton.addEventListener("click", () => {
      this.handleSpin();
    });
    this.addButton.addEventListener("click", () => {
      this.handleAddName();
    });
    this.clearButton.addEventListener("click", () => {
      this.handleClear();
    });
    this.nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.handleAddName();
        e.preventDefault();
      }
    });

    // Initialise UI
    this.updateDisplayText();
    this.updateNameList();
    this.updateSpinButtonText();
  }

  updateDisplayText() {
    this.display.textContent = "";
  }

  handleAddName() {
    const input = this.nameInput.value.trim();
    // Input must not be empty
    if (!input) return;
    // If input has commas, turn input into an array of trimmed strings
    let array = input.includes(",")
      ? input
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name !== "")
      : [input];

    array.forEach((name) => this.randomSelector.addName(name));

    this.nameInput.value = "";
    this.updateNameList();
    this.updateSpinButtonText();
  }

  handleClear() {
    this.randomSelector.clear();
    this.updateNameList();
    this.updateSpinButtonText();
  }

  handleSpin() {
    if (!this.randomSelector.hasNamesRemaining()) {
      this.randomSelector.reset();
      this.updateNameList();
      this.updateDisplayText();
      this.updateSpinButtonText();
      return;
    }

    this.selectionAnimator.spin(this.randomSelector.remainingNames, () => {
      const chosenName = this.randomSelector.chooseName();
      this.display.textContent = `${chosenName} 🎉`;
      this.updateNameList();
      this.updateSpinButtonText();
    });
  }

  /**
   * Creates an li for each name in the list
   * Adds "chosenName" class to names that have already been chosen
   */
  updateNameList() {
    this.nameList.innerHTML = "";
    this.randomSelector.originalNames.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;

      if (!this.randomSelector.remainingNames.includes(name)) {
        li.classList.add("chosenName");
      }

      this.nameList.appendChild(li);
    });
  }

  updateSpinButtonText() {
    if (this.randomSelector.originalNames.length < 1) {
      this.spinButton.classList.add("hidden");
    } else {
      this.spinButton.classList.remove("hidden");
    }

    if (
      !this.randomSelector.hasNamesRemaining() &&
      this.randomSelector.originalNames.length > 0
    ) {
      this.spinButton.textContent = "Reset";
    } else {
      this.spinButton.textContent = "Play 🎲";
    }
  }
}

