export class WhoOnline {
  constructor() {
    this.online = new Map();
    this.onChangeCb = () => {};
  }

  onChange(cb) {
    // I plan to add only one subscriber. it is simple implementation.
    this.onChangeCb = cb;
  }

  count() {
    return this.online.size;
  }

  logins() {
    const logins = [];

    for (let u of this.online.values()) {
      logins.push(u);
    }

    return logins;
  }

  update(id, login = undefined) {
    this.online.set(id, {
      login: login,
      updated: (new Date()).getTime()
    });

    setTimeout(() => this.onChangeCb(), 0);
  }

  offline(id) {
    if (this.online.has(id)) {
      this.online.delete(id);

      setTimeout(() => this.onChangeCb(), 0);
    }
  }
}
