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

    // UI Elements
    this.spinButton = document.querySelector("#spinButton");
    this.addButton = document.querySelector("#addButton");
    this.clearButton = document.querySelector("#clearButton");
    this.newGroupButton = document.querySelector("#newGroupButton");
    this.saveGroupButton = document.querySelector("#saveGroupButton");
    this.deleteGroupButton = document.querySelector("#deleteGroupButton");
    this.nameInput = document.querySelector("#nameInput");
    this.groupNameInput = document.querySelector("#groupNameInput");
    this.display = document.querySelector("#resultDisplay");
    this.nameList = document.querySelector("#nameList");
    this.groupList = document.querySelector("#groupList");

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
    this.newGroupButton.addEventListener("click", () => {
      this.handleNewGroup();
    });
    this.deleteGroupButton.addEventListener("click", () => {
      this.handleDeleteGroup();
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
    this.updateGroupList();
    this.updateSpinButtonText();
    // this.updateGroupsDropdown();
  }

  updateGroupList() {
    const groups = RandomSelector.listGroups();
    this.groupList.innerHTML = "";

    groups.forEach((groupName) => {
      const link = document.createElement("a");
      link.textContent = groupName;
      link.href = "#";
      const li = document.createElement("li");
      if (groupName == this.randomSelector.groupName) {
        link.classList.add("selectedGroup");
      } else {
        link.classList.remove("selectedGroup");
      }

      li.appendChild(link);
      this.groupList.appendChild(li);
      link.addEventListener("click", (e) => {
        e.preventDefault();

        if (groupName === this.randomSelector.groupName) {
          this.handleEditGroupName(groupName, link)
        } else {
          this.handleLoadGroup(groupName);
          this.updateDisplayText();
          this.updateGroupList();
        }
      });

    });
  }

  updateDisplayText() {
    this.display.textContent = "";
  }

  handleEditGroupName(groupName, link) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = groupName;
    input.classList.add("groupNameInput");
    link.replaceWith(input);
    input.focus();

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const groupNameInput = input.value.trim();
        if (!groupNameInput) { this.updateGroupList(); return };
        const oldGroupName = this.randomSelector.groupName;
        this.randomSelector.groupName = groupNameInput;
        this.handleSaveGroup();
        RandomSelector.deleteGroup(oldGroupName)
        this.updateGroupList();
      }
    })
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
    this.updateDisplayText();
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

  handleNewGroup() {
    const numOfGroups = RandomSelector.listGroups().length;
    console.log(RandomSelector.listGroups());

    let newGroupNumber = 1;
    while (RandomSelector.listGroups().includes(`Group ${newGroupNumber}`)) {
      newGroupNumber++;
    }

    this.randomSelector.groupName = `Group ${numOfGroups}`;
    this.randomSelector = new RandomSelector([], `Group ${newGroupNumber}`);
    this.handleSaveGroup();
    this.updateNameList();
    this.updateGroupList();
    this.updateDisplayText();
    this.updateSpinButtonText();
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
    this.updateNameList();
    this.updateSpinButtonText();
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
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("deleteNameButton");
      deleteButton.addEventListener("click", () => {
        this.randomSelector.removeName(name);
        this.updateNameList();
      });
      li.appendChild(deleteButton);
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
