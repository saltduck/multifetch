// 浏览器环境使用示例

// 在浏览器中，使用 browser-compatible.js 版本
const { fetch } = require('./browser-compatible');

// 示例1: HTTP GET 请求
const httpGetExample = [
  {
    type: 'http-get',
    params: {
      url: 'https://api.github.com/status'
    }
  }
];

// 示例2: 币安价格查询
const binanceExample = [
  {
    type: 'binance',
    params: {
      symbol: 'BTCUSDT'
    }
  },
  {
    type: 'binance',
    params: {
      symbol: 'ETHUSDT'
    }
  }
];

// 示例3: 以太坊余额查询
const balanceExample = [
  {
    type: 'balanceOf',
    params: {
      chainid: 1,
      contract: '0xA0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C4', // 示例合约地址
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' // 示例地址
    }
  }
];

// 示例4: LP 价格查询
const lpPriceExample = [
  {
    type: 'lpPrice',
    params: {
      chainid: 1,
      contract: '0x11b815efB8f581194ae79006d24E0d814B7697F6', // ETH/USDT LP 合约
      reverse: false
    }
  }
];

async function runBrowserExamples() {
  console.log('🌐 浏览器环境示例\n');
  
  try {
    // 运行 HTTP GET 示例
    console.log('📡 HTTP GET 示例:');
    const httpResults = await fetch(httpGetExample);
    console.log(JSON.stringify(httpResults, null, 2));
    console.log('\n');
    
    // 运行币安价格示例
    console.log('💰 币安价格示例:');
    const binanceResults = await fetch(binanceExample);
    console.log(JSON.stringify(binanceResults, null, 2));
    console.log('\n');
    
    // 运行余额查询示例（需要有效的合约地址）
    console.log('🏦 余额查询示例:');
    try {
      const balanceResults = await fetch(balanceExample);
      console.log(JSON.stringify(balanceResults, null, 2));
    } catch (error) {
      console.log('⚠️  余额查询失败（使用示例地址）:', error.message);
    }
    console.log('\n');
    
    // 运行 LP 价格示例（需要有效的 LP 合约地址）
    console.log('🔄 LP 价格示例:');
    try {
      const lpResults = await fetch(lpPriceExample);
      console.log(JSON.stringify(lpResults, null, 2));
    } catch (error) {
      console.log('⚠️  LP 价格查询失败（使用示例地址）:', error.message);
    }
    console.log('\n');
    
    // 测试 xpath 功能（应该失败）
    console.log('🔍 XPath 功能测试（应该失败）:');
    try {
      const xpathExample = [
        {
          type: 'xpath',
          params: {
            url: 'https://example.com',
            xpath: '//title'
          }
        }
      ];
      await fetch(xpathExample);
    } catch (error) {
      console.log('✅ 预期的错误:', error.message);
    }
    
  } catch (error) {
    console.error('❌ 示例运行失败:', error.message);
  }
}

// 如果在 Node.js 环境中运行，执行示例
if (typeof window === 'undefined') {
  runBrowserExamples();
}

// 如果在浏览器环境中，将函数暴露到全局
if (typeof window !== 'undefined') {
  window.runBrowserExamples = runBrowserExamples;
}
