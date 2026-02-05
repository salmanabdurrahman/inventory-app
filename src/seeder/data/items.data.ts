/**
 * Item seed data
 * This file contains dummy item data for database seeding
 * supplierIndex refers to the supplier index from suppliersData
 */

export interface ItemSeedData {
  name: string;
  stock: number;
  price: number;
  supplierIndex: number; // Index of supplier in suppliersData (0-based)
}

export const itemsData: ItemSeedData[] = [
  // Items from PT Elektronik Jaya (index 0)
  {
    name: 'Laptop ASUS VivoBook 14',
    stock: 25,
    price: 8500000,
    supplierIndex: 0,
  },
  {
    name: 'Monitor LED Samsung 24 inch',
    stock: 40,
    price: 2200000,
    supplierIndex: 0,
  },
  {
    name: 'Keyboard Mechanical Logitech',
    stock: 60,
    price: 850000,
    supplierIndex: 0,
  },

  // Items from CV Maju Bersama (index 1)
  {
    name: 'Printer HP LaserJet Pro',
    stock: 15,
    price: 3500000,
    supplierIndex: 1,
  },
  {
    name: 'Scanner Epson Perfection',
    stock: 20,
    price: 2800000,
    supplierIndex: 1,
  },

  // Items from PT Global Supplies Indonesia (index 2)
  {
    name: 'UPS APC 1000VA',
    stock: 30,
    price: 1500000,
    supplierIndex: 2,
  },
  {
    name: 'Router WiFi TP-Link Archer',
    stock: 50,
    price: 750000,
    supplierIndex: 2,
  },
  {
    name: 'Switch Network 8 Port',
    stock: 35,
    price: 450000,
    supplierIndex: 2,
  },

  // Items from UD Sumber Makmur (index 3)
  {
    name: 'Mouse Wireless Logitech M350',
    stock: 100,
    price: 350000,
    supplierIndex: 3,
  },
  {
    name: 'Webcam Logitech C920',
    stock: 45,
    price: 1200000,
    supplierIndex: 3,
  },
  {
    name: 'Headset Bluetooth JBL',
    stock: 55,
    price: 980000,
    supplierIndex: 3,
  },

  // Items from PT Nusantara Trading (index 4)
  {
    name: 'SSD Samsung 500GB',
    stock: 80,
    price: 950000,
    supplierIndex: 4,
  },
  {
    name: 'RAM DDR4 16GB Kingston',
    stock: 70,
    price: 750000,
    supplierIndex: 4,
  },
  {
    name: 'External HDD 1TB Seagate',
    stock: 40,
    price: 850000,
    supplierIndex: 4,
  },
  {
    name: 'Flash Drive 64GB SanDisk',
    stock: 150,
    price: 120000,
    supplierIndex: 4,
  },
];
