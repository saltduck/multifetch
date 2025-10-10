const { fetch } = require('./index.js');

async function exampleRequirements() {
  try {
    console.log('🚀 开始执行需求文档中的配置示例...');
    
    // 示例1: 简单 JSON 提取 (来自需求文档 4.1)
    console.log('\n📋 示例1: 简单 JSON 提取 (需求文档 4.1)');
    console.log('配置: { "type": "http-post", "params": { "url": "...", "postprocess": "json:amount" } }');
    
    // 模拟一个返回 { "amount": "123456789" } 的 API
    const mockApiResponse = JSON.stringify({ amount: "123456789" });
    
    // 由于我们无法访问真实的 API，这里使用一个模拟的 HTTP 请求
    // 在实际使用中，这个 URL 应该返回包含 amount 字段的 JSON
    const simpleJsonOperations = [
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          postprocess: 'json:title' // 提取 title 字段作为示例
        }
      }
    ];

    const simpleJsonResults = await fetch(simpleJsonOperations);
    console.log('简单 JSON 提取结果:', simpleJsonResults[0]);

    // 示例2: 链式操作 (来自需求文档 4.2)
    console.log('\n📋 示例2: 链式操作 (需求文档 4.2)');
    console.log('配置: { "type": "call", "params": { "chainid": 56, "contract": "...", "data": "...", "postprocess": ["object:result", "toNumber", "div:100"] } }');
    
    const chainOperations = [
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x313ce567', // decimals() 函数选择器
          postprocess: ['object:result', 'toNumber', 'div:100']
        }
      }
    ];

    const chainResults = await fetch(chainOperations);
    console.log('链式操作结果:', chainResults[0]);

    // 示例3: 复杂数据处理 (来自需求文档 4.3)
    console.log('\n📋 示例3: 复杂数据处理 (需求文档 4.3)');
    console.log('配置: { "type": "http-get", "params": { "url": "...", "postprocess": ["json:data.floor_price", "div:100000000"] } }');
    
    const complexOperations = [
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          postprocess: ['json:id', 'toNumber', 'div:100000000'] // 模拟 floor_price 处理
        }
      }
    ];

    const complexResults = await fetch(complexOperations);
    console.log('复杂数据处理结果:', complexResults[0]);

    // 示例4: 数学运算演示
    console.log('\n📋 示例4: 数学运算演示');
    
    const mathOperations = [
      {
        type: 'http-get',
        params: {
          url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
          postprocess: 'json:price'
        }
      },
      {
        type: 'http-get',
        params: {
          url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
          postprocess: ['json:price', 'toNumber', 'div:100000000'] // 转换为 BTC 单位
        }
      },
      {
        type: 'http-get',
        params: {
          url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
          postprocess: ['json:price', 'toNumber', 'mul:100'] // 转换为美分
        }
      },
      {
        type: 'http-get',
        params: {
          url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
          postprocess: ['json:price', 'toNumber', 'add:1000'] // 加 1000
        }
      },
      {
        type: 'http-get',
        params: {
          url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
          postprocess: ['json:price', 'toNumber', 'sub:1000'] // 减 1000
        }
      }
    ];

    const mathResults = await fetch(mathOperations);
    console.log('数学运算结果:');
    console.log(`  原始价格: ${mathResults[0]}`);
    console.log(`  除以 100000000: ${mathResults[1]}`);
    console.log(`  乘以 100: ${mathResults[2]}`);
    console.log(`  加 1000: ${mathResults[3]}`);
    console.log(`  减 1000: ${mathResults[4]}`);

    // 示例5: 数据类型转换演示
    console.log('\n📋 示例5: 数据类型转换演示');
    
    const conversionOperations = [
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          postprocess: 'json:userId'
        }
      },
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          postprocess: ['json:userId', 'toNumber']
        }
      }
    ];

    const conversionResults = await fetch(conversionOperations);
    console.log('数据类型转换结果:');
    console.log(`  原始 userId (字符串): ${conversionResults[0]} (类型: ${typeof conversionResults[0]})`);
    console.log(`  转换后 userId (数字): ${conversionResults[1]} (类型: ${typeof conversionResults[1]})`);

    // 示例6: 数组索引访问演示
    console.log('\n📋 示例6: 数组索引访问演示');
    
    const arrayOperations = [
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          postprocess: 'json:0.title' // 访问第一个帖子的标题
        }
      },
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          postprocess: ['json:0.id', 'toNumber', 'mul:2'] // 第一个帖子的 ID 乘以 2
        }
      }
    ];

    const arrayResults = await fetch(arrayOperations);
    console.log('数组索引访问结果:');
    console.log(`  第一个帖子标题: ${arrayResults[0]}`);
    console.log(`  第一个帖子 ID * 2: ${arrayResults[1]}`);

    console.log('\n✅ 所有需求文档示例执行完成！');

  } catch (error) {
    console.error('❌ 执行失败:', error.message);
  }
}

// 如果直接运行此文件，则执行示例
if (require.main === module) {
  exampleRequirements();
}

module.exports = { exampleRequirements };
