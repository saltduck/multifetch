const { fetch } = require('./index');

async function debugPage() {
  console.log('🔍 调试页面内容...\n');
  
  try {
    // 测试不同的选择器来查看页面内容
    const tests = [
      {
        name: 'page_title',
        type: 'xpath',
        params: {
          url: 'https://transcription.bihelix.io/zh',
          xpath: '//title',
          waitFor: 5000
        }
      },
      {
        name: 'page_body',
        type: 'xpath',
        params: {
          url: 'https://transcription.bihelix.io/zh',
          xpath: '//body',
          waitFor: 5000
        }
      },
      {
        name: 'all_divs',
        type: 'xpath',
        params: {
          url: 'https://transcription.bihelix.io/zh',
          xpath: '//div',
          waitFor: 5000
        }
      },
      {
        name: 'all_spans',
        type: 'xpath',
        params: {
          url: 'https://transcription.bihelix.io/zh',
          xpath: '//span',
          waitFor: 5000
        }
      }
    ];
    
    const results = await fetch(tests);
    
    results.forEach((result, index) => {
      const name = Object.keys(result)[0];
      const value = result[name];
      const operation = tests[index];
      
      console.log(`\n🔍 测试 ${index + 1}: ${name}`);
      console.log(`   XPath: ${operation.params.xpath}`);
      console.log(`   结果长度: ${value ? value.length : 0} 字符`);
      
      if (value && value.length > 0) {
        // 显示前500个字符
        const preview = value.length > 500 ? value.substring(0, 500) + '...' : value;
        console.log(`   内容预览:`);
        console.log(`   ${preview.split('\n').map(line => `   ${line}`).join('\n')}`);
        
        // 查找数字
        const numbers = value.match(/\d+\.?\d*/g);
        if (numbers && numbers.length > 0) {
          console.log(`   找到数字: [${numbers.join(', ')}]`);
        } else {
          console.log(`   未找到数字`);
        }
      }
      
      console.log('-'.repeat(60));
    });
    
  } catch (error) {
    console.error('❌ 调试失败:', error.message);
  }
}

debugPage();
