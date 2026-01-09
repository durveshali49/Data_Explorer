import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';

export interface CategoryItem {
  title: string;
  url: string;
  slug: string;
  productCount?: number;
  parentSlug?: string;
}

@Injectable()
export class CategoryScraperService {
  private readonly logger = new Logger(CategoryScraperService.name);

  async scrapeCategory(url: string): Promise<CategoryItem[]> {
    this.logger.log(`Starting category scraping from: ${url}`);
    const results: CategoryItem[] = [];

    const crawler = new PlaywrightCrawler({
      requestHandlerTimeoutSecs: 60,
      maxRequestRetries: 3,
      requestHandler: async ({ page, request }) => {
        this.logger.log(`Scraping categories from: ${request.url}`);

        try {
          await page.waitForLoadState('networkidle', { timeout: 30000 });

          // Extract categories and subcategories
          const categories = await page.evaluate(() => {
            const items: { title: string; url: string; slug: string; productCount?: number }[] = [];
            
            // Try different selectors for category listings
            const selectors = [
              '.category-list a',
              '.subcategory a',
              '[data-category] a',
              '.category-item',
              'ul.categories li a',
            ];

            for (const selector of selectors) {
              const links = document.querySelectorAll(selector);
              if (links.length > 0) {
                links.forEach((link: Element) => {
                  const anchor = link as HTMLAnchorElement;
                  const text = anchor.textContent?.trim();
                  const href = anchor.href;
                  
                  if (text && href && !items.find(i => i.url === href)) {
                    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    
                    // Try to extract product count if displayed
                    const countMatch = text.match(/\((\d+)\)/);
                    const productCount = countMatch ? parseInt(countMatch[1], 10) : undefined;
                    
                    items.push({ 
                      title: text.replace(/\s*\(\d+\)\s*$/, '').trim(), 
                      url: href, 
                      slug,
                      productCount
                    });
                  }
                });
                break;
              }
            }

            return items;
          });

          results.push(...categories);
          this.logger.log(`Found ${categories.length} categories`);
        } catch (error) {
          this.logger.error(`Error scraping categories: ${error.message}`);
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
      await crawler.run([url]);
      this.logger.log(`Category scraping completed. Total items: ${results.length}`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to scrape categories: ${error.message}`);
      throw error;
    }
  }
}
