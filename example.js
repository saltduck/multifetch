const { fetch } = require('./index');

// 定义一个操作数组
const operations = [
  {
    name: 'todo',
    type: 'http-get',
    params: { url: 'https://jsonplaceholder.typicode.com/todos/1' }
  },
  {
    name: 'new_post',
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
    name: 'usdc_balance',
    type: 'balanceOf',
    params: {
      chainid: 1, // 以太坊主网
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC 合约地址
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'   // 一个持有USDC的地址 (vitalik.eth)
    }
  },
  {
    name: 'cake_balance',
    type: 'balanceOf',
    params: {
      chainid: 56, // BNB Chain
      contract: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', // CAKE 合约地址
      address: '0x000000000000000000000000000000000000dead'   // 一个公开的CAKE持有地址
    }
  },
  {
    name: 'user_data',
    type: 'http-get',
    params: { url: 'https://jsonplaceholder.typicode.com/users/1' }
  },
  {
    name: 'btc_balance',
    type: 'balanceOf',
    params: {
      chainid: 'BTC',
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
    }
  }
];

// 异步执行函数并处理结果
async function main() {
  console.log('开始执行操作...');
  try {
    const results = await fetch(operations);
    console.log('所有操作成功完成！');
    console.log('结果:');
    results.forEach((result, index) => {
      const name = Object.keys(result)[0];
      const value = result[name];
      console.log(`--- 操作 ${index + 1} (name: ${name}, type: ${operations[index].type}) 的结果 ---`);
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



