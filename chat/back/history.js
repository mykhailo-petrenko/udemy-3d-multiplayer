export class History {
  constructor(capacity) {
    this.capacity = capacity;
    this.messages  = [];
  }

  add(message) {
    if (this.messages.length + 1 > this.capacity) {
      this.messages.shift();
    }

    this.messages.push(message);
  }

  get() {
    return this.messages;
  }
}
