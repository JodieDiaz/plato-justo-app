// models/Product.js

class Product {
  constructor(
    name,
    description,
    price,
    portions,
    grams,
    pricePerPortion,
    image
  ) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.portions = portions;
    this.grams = grams;
    this.pricePerPortion = pricePerPortion;
    this.image = image; 
    this.createdAt = new Date(); 
  }

  calculatePortions() {
    if (this.grams && this.portions) {
      return Math.floor(this.grams / this.portions);
    }
    return 0;
  }

  calculateTotalValue() {
    const portionsAvailable = this.calculatePortions();
    if (portionsAvailable && this.pricePerPortion) {
      return portionsAvailable * this.pricePerPortion;
    }
    return 0;
  }
}

// Exportar la clase Product usando exportaciones de ES6
export default Product;
