const puppeteer = require('puppeteer');

async function testSimple() {
  console.log('🔍 测试简单Puppeteer功能...');
  
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto('https://www.baidu.com');
    
    const title = await page.title();
    console.log('页面标题:', title);
    
    await browser.close();
    console.log('✅ 测试成功');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testSimple();
