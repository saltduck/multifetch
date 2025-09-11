const { fetch } = require('./index');

async function testPuppeteer() {
  console.log('🔍 测试Puppeteer XPath功能...\n');
  
  try {
    const test = {
      name: 'simple_test',
      type: 'xpath',
      params: {
        url: 'https://transcription.bihelix.io/zh',
        xpath: '//title',
        waitFor: 3000
      }
    };
    
    const results = await fetch([test]);
    console.log('📊 测试结果:');
    console.log('='.repeat(60));
    console.log(JSON.stringify(results, null, 2));
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testPuppeteer();
