const { fetch } = require('./index.js');

async function exampleCall() {
  try {
    console.log('🚀 开始执行合约调用示例...');
    
    // 示例1: 调用 ERC20 合约的基本方法
    const erc20Operations = [
      {
        type: 'call',
        params: {
          chainid: 1, // 以太坊主网
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC 合约地址
          data: '0x06fdde03' // name() 函数选择器
        }
      },
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x95d89b41' // symbol() 函数选择器
        }
      },
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x313ce567' // decimals() 函数选择器
        }
      },
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x18160ddd' // totalSupply() 函数选择器
        }
      }
    ];

    console.log('\n📋 示例1: ERC20 基本方法调用');
    const erc20Results = await fetch(erc20Operations);
    
    erc20Results.forEach((result, index) => {
      const methods = ['name()', 'symbol()', 'decimals()', 'totalSupply()'];
      console.log(`\n${methods[index]}:`);
      console.log(`  合约: ${result.contract}`);
      console.log(`  数据: ${result.data}`);
      console.log(`  结果: ${result.result}`);
    });

    // 示例2: 调用带参数的合约方法
    console.log('\n📋 示例2: 带参数的合约方法调用');
    
    const addressOperations = [
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x70a08231000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // balanceOf(Vitalik地址)
        }
      },
      {
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH 合约
          data: '0x70a08231000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // balanceOf(Vitalik地址)
        }
      }
    ];

    const addressResults = await fetch(addressOperations);
    
    addressResults.forEach((result, index) => {
      const tokens = ['USDC', 'WETH'];
      console.log(`\n${tokens[index]} balanceOf(Vitalik):`);
      console.log(`  合约: ${result.contract}`);
      console.log(`  数据: ${result.data}`);
      console.log(`  结果: ${result.result}`);
    });

    // 示例3: 不同链上的合约调用
    console.log('\n📋 示例3: 不同链上的合约调用');
    
    const multiChainOperations = [
      {
        type: 'call',
        params: {
          chainid: 1, // 以太坊主网
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

    // 示例4: 错误处理演示
    console.log('\n📋 示例4: 错误处理演示');
    
    try {
      await fetch([{
        type: 'call',
        params: {
          chainid: 1,
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: 'invalid-hex-data' // 无效的16进制数据
        }
      }]);
    } catch (error) {
      console.log(`❌ 预期的错误: ${error.message}`);
    }

    try {
      await fetch([{
        type: 'call',
        params: {
          chainid: 999, // 不支持的链ID
          contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          data: '0x06fdde03'
        }
      }]);
    } catch (error) {
      console.log(`❌ 预期的错误: ${error.message}`);
    }

    console.log('\n✅ 所有示例执行完成！');

  } catch (error) {
    console.error('❌ 执行失败:', error.message);
  }
}

// 辅助函数：解析16进制结果为字符串
function parseHexString(hexString) {
  try {
    // 移除 0x 前缀
    const hex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    
    // 检查是否是动态长度字符串的格式
    if (hex.length > 64) {
      // 提取长度信息（前32字节）
      const lengthHex = hex.slice(0, 64);
      const length = parseInt(lengthHex, 16);
      
      // 提取字符串数据（从第33字节开始）
      const stringHex = hex.slice(64, 64 + length * 2);
      
      // 转换为字符串
      let result = '';
      for (let i = 0; i < stringHex.length; i += 2) {
        const byte = stringHex.substr(i, 2);
        const charCode = parseInt(byte, 16);
        if (charCode > 0) {
          result += String.fromCharCode(charCode);
        }
      }
      return result;
    } else {
      // 直接解析为数字
      return parseInt(hex, 16).toString();
    }
  } catch (error) {
    return hexString; // 如果解析失败，返回原始字符串
  }
}

// 如果直接运行此文件，则执行示例
if (require.main === module) {
  exampleCall();
}

module.exports = { exampleCall, parseHexString };
