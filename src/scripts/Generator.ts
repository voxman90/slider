class Generator {
  static getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static getRandomChar(charset: string): string {
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }
}

export default Generator;
