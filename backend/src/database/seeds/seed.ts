import { AppDataSource } from '../data-source';
import { Navigation, Category, Product, ProductDetail } from '../entities';

async function seed() {
  console.log('Starting database seeding...');

  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connected');

    const navigationRepo = AppDataSource.getRepository(Navigation);
    const categoryRepo = AppDataSource.getRepository(Category);
    const productRepo = AppDataSource.getRepository(Product);
    const productDetailRepo = AppDataSource.getRepository(ProductDetail);

    // Clear existing data (optional) - skip clearing, just add new data
    console.log('Seeding data...');

    // Seed Navigation
    console.log('Seeding navigation...');
    const booksNav = navigationRepo.create({
      title: 'Books',
      slug: 'books',
      description: 'Browse all books',
      sourceUrl: 'https://www.worldofbooks.com/en-gb/books',
      lastScrapedAt: new Date(),
    });
    await navigationRepo.save(booksNav);

    const categoriesNav = navigationRepo.create({
      title: 'Categories',
      slug: 'categories',
      description: 'Browse by category',
      sourceUrl: 'https://www.worldofbooks.com/en-gb/categories',
      lastScrapedAt: new Date(),
    });
    await navigationRepo.save(categoriesNav);

    // Seed Categories
    console.log('Seeding categories...');
    const fictionCategory = categoryRepo.create({
      title: 'Fiction',
      slug: 'fiction',
      description: 'Fiction books',
      navigationId: booksNav.id,
      productCount: 100,
      sourceUrl: 'https://www.worldofbooks.com/en-gb/books/fiction',
      lastScrapedAt: new Date(),
    });
    await categoryRepo.save(fictionCategory);

    const nonFictionCategory = categoryRepo.create({
      title: 'Non-Fiction',
      slug: 'non-fiction',
      description: 'Non-fiction books',
      navigationId: booksNav.id,
      productCount: 80,
      sourceUrl: 'https://www.worldofbooks.com/en-gb/books/non-fiction',
      lastScrapedAt: new Date(),
    });
    await categoryRepo.save(nonFictionCategory);

    const childrenCategory = categoryRepo.create({
      title: 'Children\'s Books',
      slug: 'childrens-books',
      description: 'Books for children',
      navigationId: booksNav.id,
      productCount: 60,
      sourceUrl: 'https://www.worldofbooks.com/en-gb/books/children',
      lastScrapedAt: new Date(),
    });
    await categoryRepo.save(childrenCategory);

    // Seed Sample Products
    console.log('Seeding products...');
    const products = [
      // Fiction
      {
        sourceId: 'sample-1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 8.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-1',
        availability: 'In Stock',
        condition: 'Used - Good',
        categoryId: fictionCategory.id,
      },
      {
        sourceId: 'sample-2',
        title: '1984',
        author: 'George Orwell',
        price: 7.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-2',
        availability: 'In Stock',
        condition: 'Used - Very Good',
        categoryId: fictionCategory.id,
      },
      {
        sourceId: 'sample-4',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        price: 9.49,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-4',
        availability: 'In Stock',
        condition: 'Used - Good',
        categoryId: fictionCategory.id,
      },
      {
        sourceId: 'sample-5',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        price: 6.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-5',
        availability: 'In Stock',
        condition: 'Used - Very Good',
        categoryId: fictionCategory.id,
      },
      {
        sourceId: 'sample-6',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        price: 7.49,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-6',
        availability: 'In Stock',
        condition: 'Used - Good',
        categoryId: fictionCategory.id,
      },
      {
        sourceId: 'sample-7',
        title: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        price: 10.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-7',
        availability: 'In Stock',
        condition: 'Used - Good',
        categoryId: fictionCategory.id,
      },
      {
        sourceId: 'sample-8',
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        price: 14.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-8',
        availability: 'In Stock',
        condition: 'Used - Very Good',
        categoryId: fictionCategory.id,
      },
      {
        sourceId: 'sample-9',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        price: 8.49,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-9',
        availability: 'In Stock',
        condition: 'Used - Good',
        categoryId: fictionCategory.id,
      },
      // Non-Fiction
      {
        sourceId: 'sample-3',
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        price: 12.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-3',
        availability: 'In Stock',
        condition: 'Used - Good',
        categoryId: nonFictionCategory.id,
      },
      {
        sourceId: 'sample-10',
        title: 'Educated',
        author: 'Tara Westover',
        price: 11.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-10',
        availability: 'In Stock',
        condition: 'Used - Very Good',
        categoryId: nonFictionCategory.id,
      },
      {
        sourceId: 'sample-11',
        title: 'Atomic Habits',
        author: 'James Clear',
        price: 13.49,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-11',
        availability: 'In Stock',
        condition: 'Used - Good',
        categoryId: nonFictionCategory.id,
      },
      {
        sourceId: 'sample-12',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        price: 10.49,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-12',
        availability: 'In Stock',
        condition: 'Used - Very Good',
        categoryId: nonFictionCategory.id,
      },
      // Children's Books
      {
        sourceId: 'sample-13',
        title: 'The Very Hungry Caterpillar',
        author: 'Eric Carle',
        price: 5.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-13',
        availability: 'In Stock',
        condition: 'Used - Good',
        categoryId: childrenCategory.id,
      },
      {
        sourceId: 'sample-14',
        title: 'Where the Wild Things Are',
        author: 'Maurice Sendak',
        price: 6.49,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-14',
        availability: 'In Stock',
        condition: 'Used - Very Good',
        categoryId: childrenCategory.id,
      },
      {
        sourceId: 'sample-15',
        title: 'The Gruffalo',
        author: 'Julia Donaldson',
        price: 5.49,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-15',
        availability: 'In Stock',
        condition: 'Used - Good',
        categoryId: childrenCategory.id,
      },
      {
        sourceId: 'sample-16',
        title: 'Matilda',
        author: 'Roald Dahl',
        price: 7.99,
        currency: 'GBP',
        imageUrl: 'https://via.placeholder.com/300x400',
        sourceUrl: 'https://www.worldofbooks.com/product/sample-16',
        availability: 'In Stock',
        condition: 'Used - Very Good',
        categoryId: childrenCategory.id,
      },
    ];

    for (const productData of products) {
      const product = productRepo.create({
        ...productData,
        lastScrapedAt: new Date(),
      });
      const savedProduct = await productRepo.save(product);

      // Add product detail
      const detail = productDetailRepo.create({
        productId: savedProduct.id,
        description: 'A classic book that has stood the test of time.',
        specs: {
          Publisher: 'Penguin Books',
          Language: 'English',
          Format: 'Paperback',
        },
        ratingsAvg: 4.5,
        reviewsCount: 120,
        isbn: '978-0000000000',
        publisher: 'Penguin Books',
        pageCount: 200,
        format: 'Paperback',
      });
      await productDetailRepo.save(detail);
    }

    console.log('Seeding completed successfully!');
    console.log(`- Navigation items: 2`);
    console.log(`- Categories: 3`);
    console.log(`- Products: ${products.length}`);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
