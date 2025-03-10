export class RandomSelector {
  /*
   * Class for managing a list of names and performing sample without
   * replacement. Saves the list in localStorage and checks for an existing
   * list when initialised.
   * @param {array} names
   */
  constructor(names = [], groupName = "Group 1") {
    this.groupName = groupName;
    const storedNames = JSON.parse(localStorage.getItem("nameGroups"));
    if (storedNames && Array.isArray(storedNames)) {
      this.originalNames = storedNames.slice();
    } else {
      this.originalNames = names.length > 0 ? names.slice() : [];
    }

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

    this.saveToLocalStorage();

    // copy array to remainingNames
    this.reset();
  }

  reset() {
    this.remainingNames = [...this.originalNames];
  }

  clear() {
    this.originalNames = [];
    this.saveToLocalStorage();
    this.reset();
  }

  saveToLocalStorage() {
    // localStorage.setItem("names", JSON.stringify(this.originalNames));

    const allGroups = JSON.parse(localStorage.getItem("nameGroups")) || {};

    allGroups[this.groupName] = this.originalNames;
    
    localStorage.setItem("nameGroups", JSON.stringify(allGroups));
    console.log(allGroups)
  }

  static loadGroup(groupName) {
    const allGroups = JSON.parse(localStorage.getItem("nameGroups")) || {};
    return new RandomSelector(allGroups[groupName] || [], groupName)
  }

  static listGroups() {
    const allGroups = JSON.parse(localStorage.getItem("nameGroups")) || {};
    return Object.keys(allGroups);
  }

  static deleteGroup(groupName) {
    const allGroups = JSON.parse(localStorage.getItem("nameGroups")) || {};
    delete allGroups[groupName];
    localStorage.setItem("nameGroups", JSON.stringify(allGroups))
  }
}
