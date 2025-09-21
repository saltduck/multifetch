const { fetch } = require('./index.js');

async function exampleSimpleCall() {
  try {
    console.log('🚀 简单的合约调用示例...');
    
    // 示例1: 基本的 ERC20 方法调用
    console.log('\n📋 示例1: ERC20 基本方法调用');
    console.log('='.repeat(50));
    
    const basicOperations = [
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
          data: '0x06fdde03' // name()
        }
      },
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x95d89b41' // symbol()
        }
      },
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x313ce567' // decimals()
        }
      }
    ];

    const basicResults = await fetch(basicOperations);
    
    basicResults.forEach((result, index) => {
      const methods = ['name()', 'symbol()', 'decimals()'];
      console.log(`\n${methods[index]}:`);
      console.log(`  合约: ${result.contract}`);
      console.log(`  数据: ${result.data}`);
      console.log(`  结果: ${result.result}`);
    });

    // 示例2: 带参数的调用
    console.log('\n📋 示例2: 带参数的合约调用');
    console.log('='.repeat(50));
    
    const paramOperations = [
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x70a08231000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // balanceOf(Vitalik)
        }
      },
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
          data: '0x70a08231000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // balanceOf(Vitalik)
        }
      }
    ];

    const paramResults = await fetch(paramOperations);
    
    paramResults.forEach((result, index) => {
      const tokens = ['USDC', 'WETH'];
      console.log(`\n${tokens[index]} balanceOf(Vitalik):`);
      console.log(`  合约: ${result.contract}`);
      console.log(`  数据: ${result.data}`);
      console.log(`  结果: ${result.result}`);
    });

    // 示例3: 不同链上的调用
    console.log('\n📋 示例3: 不同链上的合约调用');
    console.log('='.repeat(50));
    
    const multiChainOperations = [
      {
        type: 'call',
        params: {
          chainid: 1, // 以太坊
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x06fdde03' // name()
        }
      },
      {
        type: 'call',
        params: {
          chainid: 56, // BSC
          contract: '0x55d398326f99059fF775485246999027B3197955', // USDT on BSC
          data: '0x06fdde03' // name()
        }
      },
      {
        type: 'call',
        params: {
          chainid: 137, // Polygon
          contract: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
          data: '0x06fdde03' // name()
        }
      }
    ];

    const multiChainResults = await fetch(multiChainOperations);
    
    multiChainResults.forEach((result, index) => {
      const chains = ['Ethereum', 'BSC', 'Polygon'];
      console.log(`\n${chains[index]} name():`);
      console.log(`  链ID: ${result.chainid}`);
      console.log(`  合约: ${result.contract}`);
      console.log(`  结果: ${result.result}`);
    });

    // 示例4: 错误处理
    console.log('\n📋 示例4: 错误处理演示');
    console.log('='.repeat(50));
    
    try {
      await fetch([{
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: 'invalid-hex' // 无效的16进制数据
        }
      }]);
    } catch (error) {
      console.log(`❌ 无效16进制数据错误: ${error.message}`);
    }

    try {
      await fetch([{
        type: 'call',
        params: {
          chainid: 999, // 不支持的链
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x06fdde03'
        }
      }]);
    } catch (error) {
      console.log(`❌ 不支持的链ID错误: ${error.message}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ 所有示例执行完成！');
    console.log('\n💡 使用提示:');
    console.log('- data 参数必须是16进制字符串');
    console.log('- 可以带或不带 0x 前缀');
    console.log('- 支持所有已配置的链（1, 56, 137）');
    console.log('- 返回的结果是16进制格式，需要根据合约ABI解析');

  } catch (error) {
    console.error('❌ 执行失败:', error.message);
  }
}

// 如果直接运行此文件，则执行示例
if (require.main === module) {
  exampleSimpleCall();
}

module.exports = { exampleSimpleCall };
