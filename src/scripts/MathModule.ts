class MathModule {
  public add(a: number, b: number) {
    return this.do(a, '+', b);
  }

  public sub(a: number, b: number) {
    return this.do(a, '-', b);
  }

  public mul(a: number, b: number) {
    return this.do(a, '*', b);
  }

  public div(a: number, b: number) {
    return this.do(a, '/', b);
  }

  public do(a: number, operation: string, b: number): number {
    const fixedA = this._fixed(a);
    const fixedB = this._fixed(b);
    const cf = this.getCommonFactor(fixedA, fixedB);
    const A = a * cf;
    const B = b * cf;
    switch (operation) {
      case 'plus':
      case 'add' :
      case '+'   : {
        return (A + B) / cf;
      }
      case 'minus':
      case 'sub'  :
      case '-'    : {
        return (A - B) / cf;
      }
      case 'mul':
      case '*'  : {
        return (A * B) / (cf ** 2);
      }
      case 'div':
      case '/'  : {
        return (A / B);
      }
      default: {
        return NaN;
      }
    }
  }

  public getCommonFactor(a: number, b: number) {
    return Math.pow(10, Math.max(this.numberOfDecimalPlaces(a), this.numberOfDecimalPlaces(b)));
  }

  public numberOfDecimalPlaces(a: number): number {
    const [mantissa, exponent = '0'] = a.toString().split('e');
    const [_, decimalPlaces = ''] = mantissa.split('.');
    const exp = Number(exponent);
    return (decimalPlaces.length <= exp)
      ? 0
      : decimalPlaces.length - exp;
  }

  private _fixed(a: number): number {
    const FRACTION_DIGITS = 12;
    return globalThis.parseFloat(a.toFixed(FRACTION_DIGITS));
  }
}

export default MathModule;
