export class Image {
  constructor(data) {
    this.thumbnail = data.thumbnail;
    this.mobile = data.mobile;
    this.tablet = data.tablet;
    this.desktop = data.desktop;
  }

  toSrcset() {
    return `
      ${this.mobile} 654w,
      ${this.tablet} 427w,
      ${this.desktop} 502w
    `;
  }
}
