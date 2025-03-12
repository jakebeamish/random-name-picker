import { RandomSelector } from "./RandomSelector.js";

export class UIManager {
  /**
   * @param {RandomSelector} randomSelector
   * @param {SelectionAnimator} selectionAnimator
   */
  constructor(randomSelector, selectionAnimator) {

    // Components
    /** @type {RandomSelector} */
    this.randomSelector = randomSelector;
    this.selectionAnimator = selectionAnimator;

    // Initialise UI Elements
    const elements = [
      "spinButton",
      "addButton",
      "clearButton",
      "newGroupButton",
      "saveGroupButton",
      "deleteGroupButton",
      "nameInput",
      "resultDisplay",
      "nameList",
      "groupList"
    ];

    // Select HTMLElements where id corresponds to elements array
    elements.forEach((id) => (this[id] = document.querySelector(`#${id}`)));

    // Setup Event listeners
    this.addEvent(this.addButton, "click", () => this.handleAddName());
    this.addEvent(this.nameInput, "keydown", (e) => {
      if (e.key === "Enter") {
        this.handleAddName();
        e.preventDefault();
      }
    });
    this.addEvent(this.spinButton, "click", () => this.handleSpin());
    this.addEvent(this.clearButton, "click", () => this.handleClear());
    this.addEvent(this.newGroupButton, "click", () => this.handleNewGroup());
    this.addEvent(this.deleteGroupButton, "click", () =>
      this.handleDeleteGroup()
    );

    // Initialise UI
    this.updateDisplayText();
    this.updateNameList();
    this.updateGroupList();
    this.updateSpinButtonText();
  }

  /**
   * Helper function for adding event listeners
   * @param {HTMLElement} element - The target DOM element.
   * @param {string} event - The event type ("click", "keydown", etc.)
   * @param {EventHandler} handler - The event handler function.
   */
  addEvent(element, event, handler) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError(`${element} is not a valid HTMLElement.`);
    }
    element.addEventListener(event, handler);
  }

  /**
   * Helper function for updating the UI
   */
  updateUI() {
    this.updateNameList();
    this.updateGroupList();
    this.updateSpinButtonText();
    this.updateDisplayText();
  }

  updateGroupList() {
    const groups = RandomSelector.listGroups();
    this.groupList.innerHTML = "";

    groups.forEach((groupName) => {
      const link = document.createElement("a");
      link.textContent = groupName;
      link.href = "#";
      link.classList.toggle(
        "selectedGroup",
        groupName === this.randomSelector.groupName
      );

      const li = document.createElement("li");
      li.appendChild(link);
      this.groupList.appendChild(li);

      this.addEvent(link, "click", (e) => {
        e.preventDefault();

        if (groupName === this.randomSelector.groupName) {
          this.handleEditGroupName(groupName, link);
        } else {
          this.handleLoadGroup(groupName);
          this.updateDisplayText();
          this.updateGroupList();
        }
      });
    });
  }

  updateDisplayText() {
    this.resultDisplay.textContent = "";
  }

  handleEditGroupName(groupName, link) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = groupName;
    input.classList.add("groupNameInput");
    link.replaceWith(input);
    input.focus();

    this.addEvent(input, "focusout", () => {
      this.updateGroupList();
      return;
    });

    this.addEvent(input, "keydown", (e) => {
      if (e.key === "Enter") {
        const groupNameInput = input.value.trim();
        // If input is empty, revert to old group name
        if (!groupNameInput) {
          this.updateGroupList();
          return;
        }
        const oldGroupName = this.randomSelector.groupName;
        this.randomSelector.groupName = groupNameInput;
        this.handleSaveGroup();
        RandomSelector.deleteGroup(oldGroupName);
        this.updateGroupList();
      }
    });
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
    this.updateUI();
  }

  handleClear() {
    this.randomSelector.clear();
    this.updateUI();
  }

  handleSpin() {
    if (!this.randomSelector.hasNamesRemaining()) {
      this.randomSelector.reset();
      this.updateUI();
      return;
    }

    this.selectionAnimator.spin(this.randomSelector.remainingNames, () => {
      const chosenName = this.randomSelector.chooseName();
      this.resultDisplay.textContent = `${chosenName} 🎉`;
      this.updateNameList();
      this.updateSpinButtonText();
    });
  }

  handleNewGroup() {
    // Starting with `Group 1`, check if a group already has that name. If it
    // does, try `Group 2`, and so on.
    let newGroupNumber = 1;
    while (RandomSelector.listGroups().includes(`Group ${newGroupNumber}`)) {
      newGroupNumber++;
    };

    this.randomSelector = new RandomSelector([], `Group ${newGroupNumber}`);
    this.handleSaveGroup();
    this.updateUI();
  }

  handleSaveGroup() {
    this.randomSelector.saveToLocalStorage();
  }

  handleDeleteGroup() {
    RandomSelector.deleteGroup(this.randomSelector.groupName);

    const groups = RandomSelector.listGroups();
    this.handleLoadGroup(groups[groups.length - 1]);
    this.updateGroupList();
  }

  handleLoadGroup(groupName) {
    this.randomSelector = RandomSelector.loadGroup(groupName);
    this.updateUI();
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

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "❌";
      deleteButton.classList.add("deleteNameButton");
      this.addEvent(deleteButton, "click", () => {
        this.randomSelector.removeName(name);
        this.updateNameList();
      });
      li.appendChild(deleteButton);
      this.nameList.appendChild(li);
    });
  }

  updateSpinButtonText() {
    // Hide the spinButton if no names have been added to the group
    this.spinButton.classList.toggle(
      "hidden",
      this.randomSelector.originalNames.length < 1
    );

    if (
      !this.randomSelector.hasNamesRemaining() &&
      this.randomSelector.originalNames.length > 0
    ) {
      this.spinButton.textContent = "Reset 🔄";
    } else {
      this.spinButton.textContent = "Play 🎲";
    }
  }
}
