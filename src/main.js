import { RandomSelector } from './modules/RandomSelector.js'
import { SelectionAnimator } from './modules/SelectionAnimator.js'
import { UIManager } from './modules/UIManager.js'

const randomSelector = new RandomSelector([], "Group 1");

// Initialise SelectionAnimator instance, supply updateDisplay function
const selectionAnimator = new SelectionAnimator({
  updateDisplay: (name) =>
    (document.querySelector("#resultDisplay").textContent = name),
});

const uiManager = new UIManager(randomSelector, selectionAnimator);
uiManager.handleLoadGroup(uiManager.randomSelector.groupName);
