const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    });
    const page = await browser.newPage()
    await page.goto('https://voirdrama.org/drama/her-trajectory/')
    // await page.waitForTimeout(1000)
    // await page.click('.item-summary a')
    await page.waitForTimeout(1000)
    await page.click('a#btn-read-last')
    const select = page.locator('select.host-select').nth(1);
    await page.waitForTimeout(3000)
    await select.selectOption({index: 1})
    await page.waitForTimeout(2000)
    
    const videoFrame = page.locator('iframe').first()
    const embeddedVideoURL = await videoFrame.getAttribute('src');
    await page.close();

    const context = await browser.newContext({
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        locale: 'fr-FR',
        javaScriptEnabled: true,
    });
    const newPage = await context.newPage();
    let mediaUrl = null;

  newPage.on('request', request => {
    const type = request.resourceType();
    const url = request.url();
    if (!mediaUrl && type === 'media') {
      mediaUrl = url;
      console.log('URL TROUVÉE :', mediaUrl);
    }
  });

  await newPage.goto(embeddedVideoURL, {
    waitUntil: 'load',
  });

  await newPage.reload({ waitUntil: 'load' });

  await newPage.waitForTimeout(5000);

  if (!mediaUrl) console.log('Aucune URL media trouvée');

  await browser.close();

})()