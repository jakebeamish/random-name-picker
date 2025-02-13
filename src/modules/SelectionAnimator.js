export class SelectionAnimator {
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
    let timeoutLength = names.length == 1 ? 500 : 1500;

    // scroll slower as fewer names remain to be chosen
    let intervalLength = 700 / names.length;

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

