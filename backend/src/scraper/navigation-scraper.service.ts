import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { Page } from 'playwright';

export interface NavigationItem {
  title: string;
  url: string;
  slug: string;
}

@Injectable()
export class NavigationScraperService {
  private readonly logger = new Logger(NavigationScraperService.name);
  private readonly BASE_URL = 'https://www.worldofbooks.com';

  async scrapeNavigation(): Promise<NavigationItem[]> {
    this.logger.log('Starting navigation scraping...');
    const results: NavigationItem[] = [];

    const crawler = new PlaywrightCrawler({
      requestHandlerTimeoutSecs: 60,
      maxRequestRetries: 3,
      requestHandler: async ({ page, request }) => {
        this.logger.log(`Scraping navigation from: ${request.url}`);

        try {
          // Wait for navigation to load
          await page.waitForLoadState('networkidle', { timeout: 30000 });

          // Extract main navigation items
          // Adjust selectors based on actual World of Books site structure
          const navItems = await page.evaluate(() => {
            const items: { title: string; url: string; slug: string }[] = [];
            
            // Try common navigation selectors
            const navSelectors = [
              'nav a',
              '.navigation a',
              '[role="navigation"] a',
              'header nav a',
              '.nav-link',
            ];

            for (const selector of navSelectors) {
              const links = document.querySelectorAll(selector);
              if (links.length > 0) {
                links.forEach((link: Element) => {
                  const anchor = link as HTMLAnchorElement;
                  const text = anchor.textContent?.trim();
                  const href = anchor.href;
                  
                  if (text && href && !items.find(i => i.url === href)) {
                    // Filter relevant navigation links (books, categories, etc.)
                    const relevantKeywords = ['book', 'category', 'fiction', 'non-fiction', 'children', 'academic'];
                    const isRelevant = relevantKeywords.some(keyword => 
                      text.toLowerCase().includes(keyword) || 
                      href.toLowerCase().includes(keyword)
                    );

                    if (isRelevant) {
                      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      items.push({ title: text, url: href, slug });
                    }
                  }
                });
                break; // Use first successful selector
              }
            }

            return items;
          });

          results.push(...navItems);
          this.logger.log(`Found ${navItems.length} navigation items`);
        } catch (error) {
          this.logger.error(`Error scraping navigation: ${error.message}`);
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
      await crawler.run([this.BASE_URL]);
      this.logger.log(`Navigation scraping completed. Total items: ${results.length}`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to scrape navigation: ${error.message}`);
      throw error;
    }
  }
}
