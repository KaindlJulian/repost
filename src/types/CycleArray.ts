/**
 * An array with circular access utility. Mutating the array will reset the
 * access index.
 */
export class CycleArray<T> extends Array<T> {
  /**
   * Holds the index value for the __next__ access.
   */
  private accessIndex: number;

  constructor(...params: T[]) {
    super(...params);
    this.accessIndex = 0;
  }

  private resetAccessIndex() {
    this.accessIndex = 0;
  }

  private setNextAccessIndex() {
    if (this.accessIndex < this.length - 1) {
      this.accessIndex++;
    } else {
      this.accessIndex = 0;
    }
  }

  /**
   * Access the next element in rotation
   */
  cycle() {
    const currentIndex = this.accessIndex;
    this.setNextAccessIndex();
    return this[currentIndex];
  }

  // Overwriting the mutating functions to reset the access index:

  push(...items: T[]) {
    this.resetAccessIndex();
    return super.push(...items);
  }

  concat(items: T[]) {
    this.resetAccessIndex();
    return super.concat(items);
  }

  reverse() {
    this.resetAccessIndex();
    return super.reverse();
  }

  sort(compareFn?: (a: T, b: T) => number) {
    this.resetAccessIndex();
    return super.sort(compareFn);
  }

  pop() {
    this.resetAccessIndex();
    return super.pop();
  }

  splice(start: number, deleteCount?: number) {
    this.resetAccessIndex();
    return super.splice(start, deleteCount);
  }

  shift() {
    this.resetAccessIndex();
    return super.shift();
  }

  unshift(...items: T[]) {
    this.resetAccessIndex();
    return super.unshift(...items);
  }
}
