import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';

export interface ProductItem {
  sourceId: string;
  title: string;
  author?: string;
  price?: number;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  availability?: string;
  condition?: string;
}

@Injectable()
export class ProductScraperService {
  private readonly logger = new Logger(ProductScraperService.name);

  async scrapeProducts(url: string, page: number = 1, limit: number = 24): Promise<ProductItem[]> {
    this.logger.log(`Scraping products from: ${url} (page ${page}, limit ${limit})`);
    const results: ProductItem[] = [];

    // Add pagination to URL if needed
    const paginatedUrl = this.addPagination(url, page, limit);

    const crawler = new PlaywrightCrawler({
      requestHandlerTimeoutSecs: 60,
      maxRequestRetries: 3,
      requestHandler: async ({ page: browserPage, request }) => {
        this.logger.log(`Scraping products from: ${request.url}`);

        try {
          await browserPage.waitForLoadState('networkidle', { timeout: 30000 });

          // Scroll to load lazy images
          await this.scrollPage(browserPage);

          // Extract product listings
          const products = await browserPage.evaluate(() => {
            const items: any[] = [];
            
            // Try different selectors for product cards
            const selectors = [
              '.product-card',
              '.product-item',
              '[data-product]',
              '.grid-item',
              'article.product',
            ];

            let productElements: NodeListOf<Element> | null = null;
            for (const selector of selectors) {
              const elements = document.querySelectorAll(selector);
              if (elements.length > 0) {
                productElements = elements;
                break;
              }
            }

            if (!productElements || productElements.length === 0) {
              return items;
            }

            productElements.forEach((element: Element) => {
              try {
                const titleEl = element.querySelector('h2, h3, .product-title, [data-title], a[href*="/product"]');
                const linkEl = element.querySelector('a[href*="/product"]') || titleEl;
                const imageEl = element.querySelector('img');
                const priceEl = element.querySelector('.price, [data-price], .product-price');
                const authorEl = element.querySelector('.author, [data-author], .product-author');

                const title = titleEl?.textContent?.trim();
                const href = (linkEl as HTMLAnchorElement)?.href;
                const imageUrl = (imageEl as HTMLImageElement)?.src || (imageEl as HTMLImageElement)?.dataset?.src;
                const priceText = priceEl?.textContent?.trim();
                const author = authorEl?.textContent?.trim();

                if (title && href) {
                  // Extract price
                  let price: number | undefined;
                  let currency = 'GBP';
                  if (priceText) {
                    const priceMatch = priceText.match(/([£$€])?([\d,.]+)/);
                    if (priceMatch) {
                      price = parseFloat(priceMatch[2].replace(/,/g, ''));
                      if (priceMatch[1] === '$') currency = 'USD';
                      else if (priceMatch[1] === '€') currency = 'EUR';
                    }
                  }

                  // Generate source ID from URL
                  const sourceId = href.split('/').pop()?.split('?')[0] || `product-${Date.now()}-${Math.random()}`;

                  items.push({
                    sourceId,
                    title,
                    author,
                    price,
                    currency,
                    imageUrl,
                    sourceUrl: href,
                    availability: 'In Stock',
                    condition: 'Used - Good',
                  });
                }
              } catch (error) {
                console.error('Error parsing product:', error);
              }
            });

            return items;
          });

          results.push(...products);
          this.logger.log(`Found ${products.length} products`);
        } catch (error) {
          this.logger.error(`Error scraping products: ${error.message}`);
        }
      },
      headless: true,
      launchContext: {
        launchOptions: {
          timeout: 60000,
        },
      },
    });

    try {
      await crawler.run([paginatedUrl]);
      
      // Limit results
      const limited = results.slice(0, limit);
      this.logger.log(`Product scraping completed. Returning ${limited.length} products`);
      return limited;
    } catch (error) {
      this.logger.error(`Failed to scrape products: ${error.message}`);
      throw error;
    }
  }

  private addPagination(url: string, page: number, limit: number): string {
    const urlObj = new URL(url);
    urlObj.searchParams.set('page', page.toString());
    urlObj.searchParams.set('limit', limit.toString());
    return urlObj.toString();
  }

  private async scrollPage(page: any) {
    try {
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    } catch (error) {
      this.logger.warn(`Could not scroll page: ${error.message}`);
    }
  }
}
