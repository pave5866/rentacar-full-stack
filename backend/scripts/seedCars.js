const mongoose = require('mongoose');
const Car = require('../models/Car');
const dotenv = require('dotenv');

dotenv.config();

const cars = [
  {
    make: "BMW",
    model: "M4",
    year: 2023,
    category: "sports",
    price: 2500,
    specifications: {
      transmission: "Otomatik",
      seats: 4,
      fuelType: "Benzin",
      mileage: 15000
    },
    features: [
      "Deri Koltuk",
      "Navigasyon",
      "Sunroof",
      "Bluetooth",
      "Geri Görüş Kamerası"
    ],
    images: [
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068"
    ],
    availability: true,
    rating: 4.8
  },
  {
    make: "Mercedes-Benz",
    model: "S500",
    year: 2023,
    category: "luxury",
    price: 3000,
    specifications: {
      transmission: "Otomatik",
      seats: 5,
      fuelType: "Benzin",
      mileage: 10000
    },
    features: [
      "Masajlı Koltuk",
      "Panoramik Sunroof",
      "360° Kamera",
      "Buzdolabı",
      "Ambiyans Aydınlatma"
    ],
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8"
    ],
    availability: true,
    rating: 4.9
  },
  {
    make: "Volkswagen",
    model: "Golf",
    year: 2023,
    category: "economy",
    price: 1000,
    specifications: {
      transmission: "Manuel",
      seats: 5,
      fuelType: "Dizel",
      mileage: 20000
    },
    features: [
      "Apple CarPlay",
      "Android Auto",
      "Klima",
      "USB Girişi",
      "Yol Bilgisayarı"
    ],
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d"
    ],
    availability: true,
    rating: 4.5
  },
  {
    make: "Audi",
    model: "Q7",
    year: 2023,
    category: "SUV",
    price: 2800,
    specifications: {
      transmission: "Otomatik",
      seats: 7,
      fuelType: "Dizel",
      mileage: 18000
    },
    features: [
      "Quattro 4x4",
      "Elektrikli Bagaj",
      "Matrix LED Farlar",
      "Bang & Olufsen Ses Sistemi",
      "Adaptif Cruise Control"
    ],
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6"
    ],
    availability: true,
    rating: 4.7
  },
  {
    make: "Toyota",
    model: "Corolla",
    year: 2023,
    category: "economy",
    price: 800,
    specifications: {
      transmission: "Otomatik",
      seats: 5,
      fuelType: "Hibrit",
      mileage: 25000
    },
    features: [
      "Geri Görüş Kamerası",
      "Şerit Takip Sistemi",
      "Adaptif Cruise Control",
      "Kablosuz Şarj",
      "LED Farlar"
    ],
    images: [
      "https://images.unsplash.com/photo-1623869675781-80aa31012a5a"
    ],
    availability: true,
    rating: 4.6
  }
];

const seedCars = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Car.deleteMany({});
    await Car.insertMany(cars);
    await mongoose.connection.close();
  } catch (error) {
    process.exit(1);
  }
};

seedCars(); 