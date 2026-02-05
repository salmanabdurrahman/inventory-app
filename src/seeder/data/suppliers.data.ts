/**
 * Data seeder untuk Supplier
 * File ini berisi data dummy supplier yang akan digunakan untuk seeding database
 */

export interface SupplierSeedData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export const suppliersData: SupplierSeedData[] = [
  {
    name: 'PT Elektronik Jaya',
    phone: '021-5551234',
    email: 'info@elektronikjaya.com',
    address: 'Jl. Mangga Dua Raya No. 45, Jakarta Pusat',
  },
  {
    name: 'CV Maju Bersama',
    phone: '022-4567890',
    email: 'sales@majubersama.co.id',
    address: 'Jl. Sudirman No. 120, Bandung',
  },
  {
    name: 'PT Global Supplies Indonesia',
    phone: '021-7891234',
    email: 'contact@globalsupplies.id',
    address: 'Jl. Gajah Mada No. 88, Jakarta Barat',
  },
  {
    name: 'UD Sumber Makmur',
    phone: '031-3214567',
    email: 'order@sumbermakmur.com',
    address: 'Jl. Raya Darmo No. 56, Surabaya',
  },
  {
    name: 'PT Nusantara Trading',
    phone: '024-8765432',
    email: 'info@nusantaratrading.co.id',
    address: 'Jl. Pemuda No. 33, Semarang',
  },
];
