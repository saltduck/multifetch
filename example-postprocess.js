const { fetch } = require('./index.js');

async function examplePostprocess() {
  try {
    console.log('🚀 开始执行 postprocess 功能示例...');
    
    // 示例1: 简单 JSON 提取
    console.log('\n📋 示例1: 简单 JSON 提取');
    const jsonOperations = [
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          postprocess: 'json:title'
        }
      },
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/users/1',
          postprocess: 'json:address.street'
        }
      }
    ];

    const jsonResults = await fetch(jsonOperations);
    console.log('JSON 提取结果:');
    jsonResults.forEach((result, index) => {
      console.log(`  操作 ${index + 1}: ${result}`);
    });

    // 示例2: 链式操作
    console.log('\n📋 示例2: 链式操作');
    const chainOperations = [
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          postprocess: ['json:userId', 'toNumber', 'mul:100']
        }
      },
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts/2',
          postprocess: ['json:id', 'toNumber', 'add:1000', 'div:10']
        }
      }
    ];

    const chainResults = await fetch(chainOperations);
    console.log('链式操作结果:');
    chainResults.forEach((result, index) => {
      console.log(`  操作 ${index + 1}: ${result}`);
    });

    // 示例3: 数学运算
    console.log('\n📋 示例3: 数学运算');
    const mathOperations = [
      {
        type: 'http-get',
        params: {
          url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
          postprocess: ['json:price', 'toNumber', 'div:1000']
        }
      }
    ];

    const mathResults = await fetch(mathOperations);
    console.log('数学运算结果:');
    mathResults.forEach((result, index) => {
      console.log(`  操作 ${index + 1}: ${result} (BTC价格/1000)`);
    });

    // 示例4: 对象属性提取
    console.log('\n📋 示例4: 对象属性提取');
    const objectOperations = [
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x06fdde03', // name() 函数选择器
          postprocess: 'object:result'
        }
      }
    ];

    const objectResults = await fetch(objectOperations);
    console.log('对象属性提取结果:');
    objectResults.forEach((result, index) => {
      console.log(`  操作 ${index + 1}: ${result}`);
    });

    // 示例5: 复杂链式操作
    console.log('\n📋 示例5: 复杂链式操作');
    const complexOperations = [
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          postprocess: ['json:0.id', 'toNumber', 'mul:2', 'add:100']
        }
      }
    ];

    const complexResults = await fetch(complexOperations);
    console.log('复杂链式操作结果:');
    complexResults.forEach((result, index) => {
      console.log(`  操作 ${index + 1}: ${result} (第一个帖子的ID * 2 + 100)`);
    });

    // 示例6: 错误处理演示
    console.log('\n📋 示例6: 错误处理演示');
    const errorOperations = [
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          postprocess: 'json:nonexistent.property'
        }
      },
      {
        type: 'http-get',
        params: {
          url: 'https://jsonplaceholder.typicode.com/posts/1',
          postprocess: ['json:title', 'toNumber', 'div:0']
        }
      }
    ];

    try {
      const errorResults = await fetch(errorOperations);
      console.log('错误处理结果:');
      errorResults.forEach((result, index) => {
        console.log(`  操作 ${index + 1}: ${result} (应该返回原始数据)`);
      });
    } catch (error) {
      console.log(`❌ 预期的错误: ${error.message}`);
    }

    console.log('\n✅ 所有 postprocess 示例执行完成！');

  } catch (error) {
    console.error('❌ 执行失败:', error.message);
  }
}

// 如果直接运行此文件，则执行示例
if (require.main === module) {
  examplePostprocess();
}

module.exports = { examplePostprocess };
