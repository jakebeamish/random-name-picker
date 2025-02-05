/**
 * Class for managing a list of names and performing sample without replacement
 */
class RandomSelector {
	/*
	 * @param {array} names
	 */
	constructor(names) {
		this.originalNames = names.slice();
		this.reset();
	}

	hasNamesRemaining() {
		return this.remainingNames.length > 0;
	}

	chooseName() {
		// return if there aren't any names to choose
		if (!this.hasNamesRemaining()) return null;

		// get a random name from the array of available names
		const index = Math.floor(Math.random() * this.remainingNames.length);

		// remove the name from the array of available names and
		// return the chosen name
		return this.remainingNames.splice(index, 1)[0];
	}

	addName(name) {
		// remove whitespace
		name = name.trim();

		// return if name is empty or name is already in the array
		if (!name || this.originalNames.includes(name)) return;

		// otherwise, add name to the array
		this.originalNames.push(name);

		// copy array to remainingNames
		this.reset();
	}

	reset() {
		this.remainingNames = [...this.originalNames];
	}
}

class SelectionAnimator {
	constructor(uiElements) {
		this.uiElements = uiElements;
	}

	/**
	 * Animation function
	 * @param {array} names
	 * @param {function} callback
	 */
	spin(names, callback) {
		let index = 0;

		// if there's only one name left, show it after 100ms, otherwise 2000ms
		let timeoutLength = names.length == 1 ? 100 : 2000;

		// scroll slower as fewer names remain to be chosen
		let intervalLength = 300 / names.length;

		const interval = setInterval(() => {
			this.uiElements.updateDisplay(names[index % names.length]);
			index++;
		}, intervalLength);

		setTimeout(() => {
			clearInterval(interval);
			callback();
		}, timeoutLength);
	}
}

class UIManager {
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
		this.nameInput.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				this.handleAddName();
				e.preventDefault();
			}
		});

		// Initialise UI
		this.updateDisplayText();
		this.updateSpinButtonText();
	}

	updateDisplayText() {
		this.display.textContent = "";
	}

	handleAddName() {
		const input = this.nameInput.value.trim();
		if (!input) return; // Input must not be empty
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
			this.display.textContent = `🌟 ${chosenName} 🌟`;
			this.updateNameList();
			this.updateSpinButtonText();
		});
	}

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
			this.spinButton.textContent = "Reset ♻️";
		} else {
			this.spinButton.textContent = "Spin 🎲";
		}
	}
}

const randomSelector = new RandomSelector([]);
const selectionAnimator = new SelectionAnimator({
	updateDisplay: (name) =>
		(document.querySelector("#resultDisplay").textContent = name),
});

const uiManager = new UIManager(randomSelector, selectionAnimator);
