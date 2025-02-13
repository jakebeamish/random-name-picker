/**
 * Class for managing a list of names and performing sample without replacement
 */
export class RandomSelector {
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

  clear() {
    this.originalNames = [];
    this.reset();
  }
}

