const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Admin user
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@smartbuy.in' },
    update: {},
    create: { email: 'admin@smartbuy.in', password: hashed, name: 'Admin', role: 'admin' }
  });
  console.log('✅ Admin user: admin@smartbuy.in / admin123');

  // Restaurant
  const rest = await prisma.restaurant.upsert({
    where: { slug: 'a2b' },
    update: {},
    create: { name: 'A2B Restaurant', slug: 'a2b' }
  });

  // Tables
  for (let i = 1; i <= 10; i++) {
    await prisma.table.upsert({
      where: { id: i },
      update: {},
      create: { number: i, restaurantId: rest.id }
    }).catch(() => {});
  }

  // Menu Items
  const menuItems = [
    { name: 'Masala Dosa', nameTa: 'மசால் தோசை', description: 'Crispy dosa with spiced potato filling', price: 65, category: 'Meals', emoji: '🫓', restaurantId: rest.id },
    { name: 'Plain Dosa', nameTa: 'சாதா தோசை', description: 'Classic thin crispy dosa', price: 45, category: 'Meals', emoji: '🫓', restaurantId: rest.id },
    { name: 'Idli (2 pcs)', nameTa: 'இட்லி (2)', description: 'Steamed rice cakes with sambar & chutney', price: 40, category: 'Meals', emoji: '🍚', restaurantId: rest.id },
    { name: 'Vada (2 pcs)', nameTa: 'வடை (2)', description: 'Crispy fried lentil donuts', price: 45, category: 'Snacks', emoji: '🍩', restaurantId: rest.id },
    { name: 'Pongal', nameTa: 'பொங்கல்', description: 'Soft rice and lentil dish with ghee', price: 60, category: 'Meals', emoji: '🥘', restaurantId: rest.id },
    { name: 'Upma', nameTa: 'உப்மா', description: 'Semolina porridge with vegetables', price: 50, category: 'Meals', emoji: '🍲', restaurantId: rest.id },
    { name: 'Filter Coffee', nameTa: 'ஃபில்டர் காபி', description: 'Traditional South Indian coffee', price: 30, category: 'Drinks', emoji: '☕', restaurantId: rest.id },
    { name: 'Tea', nameTa: 'தேநீர்', description: 'Hot masala chai', price: 20, category: 'Drinks', emoji: '🍵', restaurantId: rest.id },
    { name: 'Fresh Lime Soda', nameTa: 'லிம்கா சோடா', description: 'Refreshing lime with soda', price: 40, category: 'Drinks', emoji: '🍋', restaurantId: rest.id },
    { name: 'Gulab Jamun', nameTa: 'குலாப் ஜாமுன்', description: 'Soft milk dumplings in sugar syrup', price: 35, category: 'Sweets', emoji: '🍮', restaurantId: rest.id },
    { name: 'Halwa', nameTa: 'அல்வா', description: 'Rich semolina sweet dessert', price: 40, category: 'Sweets', emoji: '🍯', restaurantId: rest.id },
    { name: 'Rava Dosa', nameTa: 'ரவா தோசை', description: 'Crispy semolina crepe', price: 70, category: 'Meals', emoji: '🥞', restaurantId: rest.id },
    { name: 'Parotta', nameTa: 'பரோட்டா', description: 'Layered flat bread with salna', price: 55, category: 'Meals', emoji: '🫓', restaurantId: rest.id },
    { name: 'Sambar Rice', nameTa: 'சாம்பார் சாதம்', description: 'Rice with lentil vegetable curry', price: 70, category: 'Meals', emoji: '🍛', restaurantId: rest.id },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: menuItems.indexOf(item) + 1 },
      update: {},
      create: item
    }).catch(async () => {
      await prisma.menuItem.create({ data: item }).catch(() => {});
    });
  }
  console.log('✅ Menu items seeded');

  // Supermarket Products
  const products = [
    { name: 'Tata Salt 1kg', nameTa: 'தாதா உப்பு 1கி', price: 24, category: 'Grocery', barcode: '1001', emoji: '🧂' },
    { name: 'Fortune Rice 5kg', nameTa: 'ஃபார்ச்சூன் அரிசி 5கி', price: 280, category: 'Grocery', barcode: '1002', emoji: '🌾' },
    { name: 'Aashirvaad Atta 5kg', nameTa: 'ஆசிர்வாட் மாவு 5கி', price: 260, category: 'Grocery', barcode: '1003', emoji: '🌾' },
    { name: 'Sunflower Oil 1L', nameTa: 'சூரியகாந்தி எண்ணெய் 1L', price: 150, category: 'Grocery', barcode: '1004', emoji: '🫙' },
    { name: 'Toor Dal 500g', nameTa: 'துவரம் பருப்பு 500கி', price: 70, category: 'Grocery', barcode: '1005', emoji: '🫘' },
    { name: 'Amul Butter 500g', nameTa: 'அமுல் வெண்ணெய் 500கி', price: 125, category: 'Dairy', barcode: '2001', emoji: '🧈' },
    { name: 'Amul Milk 1L', nameTa: 'அமுல் பால் 1L', price: 62, category: 'Dairy', barcode: '2002', emoji: '🥛' },
    { name: 'Britannia Bread', nameTa: 'பிரிட்டானியா பிரெட்', price: 45, category: 'Bakery', barcode: '3001', emoji: '🍞' },
    { name: 'Parle-G Biscuits', nameTa: 'பார்லே-G பிஸ்கட்', price: 20, category: 'Snacks', barcode: '4001', emoji: '🍪' },
    { name: 'Lay\'s Classic Chips', nameTa: 'லேஸ் சிப்ஸ்', price: 20, category: 'Snacks', barcode: '4002', emoji: '🥔' },
    { name: 'Coca-Cola 500ml', nameTa: 'கோக் 500ml', price: 40, category: 'Beverages', barcode: '5001', emoji: '🥤' },
    { name: 'Minute Maid OJ 250ml', nameTa: 'ஆரஞ்சு ஜூஸ் 250ml', price: 30, category: 'Beverages', barcode: '5002', emoji: '🍊' },
    { name: 'Colgate Toothpaste', nameTa: 'கோல்கேட் பேஸ்ட்', price: 95, category: 'Personal Care', barcode: '6001', emoji: '🪥' },
    { name: 'Dove Soap', nameTa: 'டவ் சோப்', price: 55, category: 'Personal Care', barcode: '6002', emoji: '🧼' },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { barcode: p.barcode },
      update: {},
      create: p
    });
  }
  console.log('✅ Products seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('   Admin login: admin@smartbuy.in / admin123');
  await prisma.$disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
