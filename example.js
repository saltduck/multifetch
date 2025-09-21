const { fetch } = require('./index');

// 定义一个操作数组
const operations = [
  {
    type: 'http-get',
    params: { url: 'https://jsonplaceholder.typicode.com/todos/1' }
  },
  {
    type: 'http-post',
    params: {
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: {
        title: 'foo',
        body: 'bar',
        userId: 1
      }
    }
  },
  {
    type: 'balanceOf',
    params: {
      chainid: 1, // 以太坊主网
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC 合约地址
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'   // 一个持有USDC的地址 (vitalik.eth)
    }
  },
  {
    type: 'balanceOf',
    params: {
      chainid: 56, // BNB Chain
      contract: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // CAKE 合约地址
      address: '0x000000000000000000000000000000000000dead'   // 一个公开的CAKE持有地址
    }
  },
  {
    type: 'http-get',
    params: { url: 'https://jsonplaceholder.typicode.com/users/1' }
  },
  {
    type: 'balanceOf',
    params: {
      chainid: 'BTC',
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
    }
  },
  { 
    type: 'binance',
    params: {
      symbol: 'BTCUSDT'
    }
  },
  {
    type: 'lpPrice',
    params: {
      chainid: 1, // 以太坊主网
      contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc', // USDC/WETH Uniswap V2 LP 合约
      reverse: false // 计算 USDC/WETH 价格 (token0/token1)
    }
  },
  {
    type: 'lpPrice',
    params: {
      chainid: 1, // 以太坊主网
      contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc', // USDC/WETH Uniswap V2 LP 合约
      reverse: true // 计算 WETH/USDC 价格 (token1/token0)
    }
  },
];

// 异步执行函数并处理结果
async function main() {
  console.log('开始执行操作...');
  try {
    const results = await fetch(operations);
    console.log('所有操作成功完成！');
    console.log(results);
    console.log('结果:');
    results.forEach((value, index) => {
      const operation = operations[index];
      console.log(`--- 操作 ${index + 1} (type: ${operation.type}) 的结果 ---`);
      // 尝试将结果解析为JSON以美化输出，如果失败则直接打印字符串
      try {
        console.log(JSON.parse(value));
      } catch (e) {
        console.log(value);
      }
      console.log('--------------------------------------------------\n');
    });
  } catch (error) {
    console.error('执行操作时发生错误:', error.message);
  }
}

main();



