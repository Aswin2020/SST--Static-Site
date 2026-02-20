window.RateConfig = window.RateConfig || {};

window.RateConfig.rates = {
  'parking-kag-16x16': {
    oldPrice: 'Rs. 70.00',
    currentPrice: 'Rs. 59.00 / sq ft'
  },
  'parking-kag-rafale-16x16': {
    oldPrice: 'Rs. 65.00',
    currentPrice: 'Rs. 55.00 / sq ft'
  }
};

window.RateConfig.getRateByKey = function getRateByKey(rateKey) {
  return this.rates[rateKey] || null;
};

window.RateConfig.getParkingKag16x16Rate = function getParkingKag16x16Rate() {
  return this.getRateByKey('parking-kag-16x16');
};

window.RateConfig.getParkingKagRafale16x16Rate = function getParkingKagRafale16x16Rate() {
  return this.getRateByKey('parking-kag-rafale-16x16');
};
