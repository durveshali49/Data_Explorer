import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';

export interface ProductDetailData {
  description?: string;
  specs?: Record<string, any>;
  isbn?: string;
  publisher?: string;
  publicationDate?: string;
  pageCount?: number;
  format?: string;
  reviews?: ReviewData[];
  ratingsAvg?: number;
  reviewsCount?: number;
  recommendations?: string[];
}

export interface ReviewData {
  author?: string;
  rating: number;
  text?: string;
  title?: string;
  reviewDate?: string;
  verifiedPurchase?: boolean;
  helpfulCount?: number;
}

@Injectable()
export class ProductDetailScraperService {
  private readonly logger = new Logger(ProductDetailScraperService.name);

  async scrapeProductDetail(url: string): Promise<ProductDetailData> {
    this.logger.log(`Scraping product detail from: ${url}`);
    let result: ProductDetailData = {};

    const crawler = new PlaywrightCrawler({
      requestHandlerTimeoutSecs: 90,
      maxRequestRetries: 3,
      requestHandler: async ({ page, request }) => {
        this.logger.log(`Scraping product detail from: ${request.url}`);

        try {
          await page.waitForLoadState('networkidle', { timeout: 30000 });

          // Extract product details
          const detail = await page.evaluate(() => {
            const data: any = {};

            // Description
            const descSelectors = [
              '.product-description',
              '[data-description]',
              '.description',
              '#product-description',
            ];
            for (const selector of descSelectors) {
              const el = document.querySelector(selector);
              if (el) {
                data.description = el.textContent?.trim();
                break;
              }
            }

            // Specs / Product Information
            const specs: Record<string, any> = {};
            const specSelectors = [
              '.product-details',
              '.specifications',
              '[data-specs]',
              '.product-info',
            ];
            for (const selector of specSelectors) {
              const container = document.querySelector(selector);
              if (container) {
                const rows = container.querySelectorAll('tr, .spec-row, dt');
                rows.forEach((row) => {
                  const label = row.querySelector('th, dt, .label')?.textContent?.trim();
                  const value = row.querySelector('td, dd, .value')?.textContent?.trim();
                  if (label && value) {
                    specs[label] = value;
                    
                    // Extract specific fields
                    if (label.toLowerCase().includes('isbn')) data.isbn = value;
                    if (label.toLowerCase().includes('publisher')) data.publisher = value;
                    if (label.toLowerCase().includes('publication')) data.publicationDate = value;
                    if (label.toLowerCase().includes('pages')) {
                      const pageMatch = value.match(/\d+/);
                      if (pageMatch) data.pageCount = parseInt(pageMatch[0], 10);
                    }
                    if (label.toLowerCase().includes('format')) data.format = value;
                  }
                });
                break;
              }
            }
            if (Object.keys(specs).length > 0) {
              data.specs = specs;
            }

            // Reviews
            const reviews: any[] = [];
            const reviewSelectors = [
              '.review',
              '[data-review]',
              '.customer-review',
              'article.review',
            ];
            for (const selector of reviewSelectors) {
              const reviewElements = document.querySelectorAll(selector);
              if (reviewElements.length > 0) {
                reviewElements.forEach((element) => {
                  const author = element.querySelector('.reviewer, .author, [data-author]')?.textContent?.trim();
                  const ratingEl = element.querySelector('.rating, [data-rating]');
                  const ratingText = ratingEl?.textContent || ratingEl?.getAttribute('data-rating');
                  const text = element.querySelector('.review-text, .comment')?.textContent?.trim();
                  const title = element.querySelector('.review-title, h3, h4')?.textContent?.trim();
                  
                  let rating = 0;
                  if (ratingText) {
                    const match = ratingText.match(/(\d+(\.\d+)?)/);
                    rating = match ? parseFloat(match[1]) : 0;
                  }

                  if (rating > 0 || text) {
                    reviews.push({ author, rating, text, title });
                  }
                });
                break;
              }
            }
            if (reviews.length > 0) {
              data.reviews = reviews;
              data.reviewsCount = reviews.length;
              const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
              data.ratingsAvg = Math.round(avgRating * 100) / 100;
            }

            // Recommendations / Related Products
            const recommendations: string[] = [];
            const recSelectors = [
              '.related-products a',
              '.recommendations a',
              '[data-recommendations] a',
              '.similar-products a',
            ];
            for (const selector of recSelectors) {
              const links = document.querySelectorAll(selector);
              if (links.length > 0) {
                links.forEach((link: Element) => {
                  const href = (link as HTMLAnchorElement).href;
                  if (href && !recommendations.includes(href)) {
                    recommendations.push(href);
                  }
                });
                break;
              }
            }
            if (recommendations.length > 0) {
              data.recommendations = recommendations;
            }

            return data;
          });

          result = detail;
          this.logger.log(`Product detail scraped successfully`);
        } catch (error) {
          this.logger.error(`Error scraping product detail: ${error.message}`);
          throw error;
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
      return result;
    } catch (error) {
      this.logger.error(`Failed to scrape product detail: ${error.message}`);
      throw error;
    }
  }
}
