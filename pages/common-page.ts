// common-page.ts
import { Page, expect, request } from '@playwright/test';

/**
 * CommonPage class provides utility methods for all pages interactions and verifications.
 */
export class CommonPage {
    private page: Page;

    /**
     * Constructor to initialize the CommonPage instance.
     * @param page - The Playwright Page object representing the current page.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Check for broken images on the page.
     * 
     * This method locates all image elements (`<img>`) on the page and checks if their source URLs
     * return a successful HTTP status (200). If any image fails to load or returns a non-200 status,
     * its URL will be added to the `brokenImages` array.
     * 
     * @returns A promise that resolves to an array of strings representing the URLs of broken images.
     * If no broken images are found, the array will be empty.
     */
    async checkForBrokenImages(): Promise<string[]> {
        console.log('Checking Broken Images on Page');
        const brokenImages: string[] = [];

        // Find all image elements on the page
        const images = await this.page.locator('img');

        // Get the count of images found
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const src = await img.getAttribute('src');

            if (src) {
                try {
                    // Make a request to the image URL
                    const response = await this.page.request.get(src);
                    // Log the response status along with the current index and total count
                    console.log(`Image ${i + 1}/${count} - URL: ${src}, Status: ${response.status()}`);
                    // Check if the response status is not OK (not 200)
                    if (!response.ok()) {
                        brokenImages.push(src);
                    }
                } catch (error) {
                    // If there is an error in the request, consider it as broken
                    brokenImages.push(src);
                }
            } else {
                // If the src attribute is missing, consider the image broken
                brokenImages.push('Image missing src attribute');
            }
        }

        return brokenImages;
    }

    /**
    * Verifies if all video elements on the page are present, loaded, and playing.
    * @param timeout - Timeout in milliseconds to wait for each video to load. default set to 10000.
    * @throws Will throw an error if any video is not present, not loaded, or not playing.
    */
    async verifyAllVideosArePlaying(timeout: number = 30000) {
        // Get all video elements on the page
        const videoElements = this.page.locator('video');

        // Get the count of video elements on the page
        const videoCount = await videoElements.count();
        console.log(`Total number of videos on the page: ${videoCount}`);

        // Iterate through each video element and verify its state
        for (let i = 0; i < videoCount; i++) {
            const videoElement = videoElements.nth(i);

            // Wait for the video element to be visible
            await expect(videoElement, `Checking if video ${i + 1} is visible`).toBeVisible({ timeout });

            // Check if the video is loaded by accessing its 'readyState'
            const videoLoaded = await videoElement.evaluate((video: HTMLVideoElement) => video.readyState >= 3);
            expect(videoLoaded, `Expecting video ${i + 1} to be loaded`).toBeTruthy();

            // Check if the video is playing
            const isPlaying = await videoElement.evaluate((video: HTMLVideoElement) => {
                return !video.paused && !video.ended && video.currentTime > 0;
            });
            expect(isPlaying, `Expecting video ${i + 1} to be playing`).toBeTruthy();

            // Log success message for each video
            console.log(`Video ${i + 1} is present, loaded, and playing.`);
        }
    }

    /**
    * Verifies if all video elements with .mp4 source URLs are valid and return a status of 200.
    * @param timeout - Timeout in milliseconds for each video request (default: 10000 ms).
    */
    async verifyAllMp4VideosAreValid(timeout: number = 10000) {
        const videoElements = this.page.locator('video');

        // Get the count of video elements on the page
        const videoCount = await videoElements.count();
        console.log(`Total number of videos on the page: ${videoCount}`);

        for (let i = 0; i < videoCount; i++) {
            const videoElement = videoElements.nth(i);
            const videoSrc = await videoElement.getAttribute('src');

            // Check if the video source URL ends with .mp4
            if (videoSrc && videoSrc.endsWith('.mp4')) {
                console.log(`Checking video URL: ${videoSrc}`);

                // Fetch the video URL directly using the browser context
                try {
                    const response = await this.page.request.get(videoSrc, {
                        timeout: timeout,
                    });

                    expect(response.status(), `Video ${i + 1} returned status : ${response.status}`).toBe(200);
                    console.log(`Video ${i + 1} is a valid .mp4 and returned status 200.`);
                } catch (error) {
                    console.error(`Error fetching video ${i + 1}:`, error);
                }
            } else {
                console.warn(`Video ${i + 1} does not have a valid .mp4 URL, skipping.`);
            }
        }
    }
}