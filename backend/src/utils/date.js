// OPTIMIZED - 1.5-2KB version

class Duration {
  constructor(baseDate) {
    this.baseDate = new Date(baseDate);
    this.value = new Date(baseDate);
  }

  // Single helper method for all additions
  _add(type, count) {
    const d = new Duration(this.value);
    const methods = {
      s: "Seconds",
      m: "Minutes",
      h: "Hours",
      d: "Date",
      M: "Month",
      y: "FullYear",
    };
    if (!methods[type]) {
      throw new Error(`Invalid duration type: ${type}`);
    }
    d.value[`set${methods[type]}`](d.value[`get${methods[type]}`]() + count);
    return d;
  }

  addSeconds(s) {
    return this._add("s", s);
  }
  addMinutes(m) {
    return this._add("m", m);
  }
  addHours(h) {
    return this._add("h", h);
  }
  addDays(d) {
    return this._add("d", d);
  }
  addMonths(M) {
    return this._add("M", M);
  }
  addYears(y) {
    return this._add("y", y);
  }

  get ms() {
    return this.value.getTime() - new Date().getTime();
  }
  get seconds() {
    return Math.floor(this.ms / 1000);
  }
  get minutes() {
    return Math.floor(this.ms / 60000);
  }
  get hours() {
    return Math.floor(this.ms / 3600000);
  }
  get days() {
    return Math.floor(this.ms / 86400000);
  }
  get months() {
    return Math.floor(this.days / 30);
  }
  get years() {
    return Math.floor(this.days / 365);
  }

  get isExpired() {
    return this.ms < 0;
  }

  get indianTime() {
    return this.value.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  get indianDateOnly() {
    return this.value.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  get remaining() {
    if (this.years > 0) return `${this.years}y`;
    if (this.months > 0) return `${this.months}m`;
    if (this.days > 0) return `${this.days}d`;
    if (this.hours > 0) return `${this.hours}h`;
    if (this.minutes > 0) return `${this.minutes}min`;
    return `${this.seconds}s`;
  }

  toString() {
    return this.value.toString();
  }
  toISOString() {
    return this.value.toISOString();
  }
  getTime() {
    return this.value.getTime();
  }
}

const created = new Date();

export const time = new Duration(created);
export const _30secs = time.addSeconds(30).value;
export const _45mins = time.addMinutes(45).value;
export const _12hours = time.addHours(12);
export const _1day = time.addDays(1).value;
export const _7day = time.addDays(7).value;
("  ");
export const _30day = time.addDays(30).value;

export const _1year = time.addYears(1);

const ind = _12hours.indianTime;
