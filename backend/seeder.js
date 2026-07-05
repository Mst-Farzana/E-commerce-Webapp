const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CategoryItem = require('./models/CategoryItem');
const categoryItems = require('./seeder/categoryItemseeder');

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('✅ MongoDB connected...');
    await CategoryItem.deleteMany(); // পুরোনো data মুছে ফেলা হবে
    await CategoryItem.insertMany(categoryItems);
    console.log('✅ Data inserted successfully!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
