# bcfetch

[![npm version](https://badge.fury.io/js/bcfetch.svg)](https://badge.fury.io/js/bcfetch)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A powerful library to perform multiple fetch operations based on type, including HTTP requests, blockchain data fetching, and AMM LP token price calculations. Supports both Node.js and browser environments.

## Features

- 🌐 **HTTP Operations**: GET and POST requests
- 🔗 **Blockchain Integration**: Balance queries for ERC20 tokens and Bitcoin, smart contract calls
- 💰 **Price Data**: Binance API integration for cryptocurrency prices
- 🏦 **AMM Support**: Calculate LP token prices for Uniswap and other AMM protocols
- ⚡ **Concurrent Execution**: All operations run in parallel for maximum performance
- 🔧 **Type-based**: Easy to extend with new operation types
- 🔄 **Postprocess Support**: Flexible data transformation and formatting with chainable operations

## Installation

```bash
npm install bcfetch
```

## Environment Support

- **Node.js**: Full functionality
- **Browser**: All features

## Quick Start

### Node.js Environment

```javascript
const { fetch } = require('bcfetch');

const operations = [
  {
    type: 'http-get',
    params: { url: 'https://jsonplaceholder.typicode.com/users/1' }
  },
  {
    type: 'balanceOf',
    params: {
      chainid: 1,
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  },
  {
    type: 'binance',
    params: { symbol: 'BTCUSDT' }
  },
  {
    type: 'lpPrice',
    params: {
      chainid: 1,
      contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
      reverse: true
    }
  }
];

async function main() {
  try {
    const results = await fetch(operations);
    console.log('Results:', results);
    // results is now an array of strings in the same order as operations
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### Browser Environment

For browser usage, the library automatically uses the browser-compatible version:

```javascript
// In browser, use the browser-compatible version
const { fetch } = require('bcfetch/browser-compatible');

const operations = [
  {
    type: 'binance',
    params: { symbol: 'BTCUSDT' }
  },
  {
    type: 'balanceOf',
    params: {
      chainid: 1,
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  }
];

async function fetchData() {
  try {
    const results = await fetch(operations);
    console.log('Results:', results);
    // results is now an array of strings in the same order as operations
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchData();
```


## Postprocess Feature

The `postprocess` parameter allows you to transform and format data after fetching it. It supports various operations that can be chained together for complex data processing.

### Supported Postprocess Operations

#### JSON Data Extraction
Extract values from JSON responses using dot notation.

**Syntax:** `json:path.to.property`

**Examples:**
- `json:data.floor_price` - Extract `data.floor_price` value
- `json:0.airdrop_stake_counts` - Extract `airdrop_stake_counts` from first array element

#### Mathematical Operations
Perform mathematical calculations on numeric data.

**Division:** `div:number`
- Example: `div:100000000` - Divide by 100000000 (common for unit conversion)

**Multiplication:** `mul:number`
- Example: `mul:100` - Multiply by 100

**Addition:** `add:number`
- Example: `add:1000` - Add 1000

**Subtraction:** `sub:number`
- Example: `sub:500` - Subtract 500

#### Data Type Conversion
Convert data to different types.

**Number Conversion:** `toNumber`
- Converts string to number
- Example: "123" → 123

#### Object Property Extraction
Extract properties from objects using dot notation.

**Syntax:** `object:path.to.property`

**Example:** `object:result` - Extract `result` property

### Chainable Operations

You can chain multiple operations together using an array:

```javascript
{
  type: 'http-get',
  params: {
    url: 'https://api.example.com/data',
    postprocess: ['json:data.price', 'toNumber', 'div:100000000']
  }
}
```

### Postprocess Examples

#### Simple JSON Extraction
```javascript
{
  type: 'http-post',
  params: {
    url: 'https://api.example.com/stake',
    postprocess: 'json:amount'
  }
}
```

#### Chainable Operations
```javascript
{
  type: 'call',
  params: {
    chainid: 56,
    contract: '0x5fC1c0121Cd0438f78e31EA20422c09eaFfcC068',
    data: '0x6a8a5f3d0000000000000000000000000000000000000000000000000000000000000000',
    postprocess: ['object:result', 'toNumber', 'div:100']
  }
}
```

#### Complex Data Processing
```javascript
{
  type: 'http-get',
  params: {
    url: 'https://bazaar-api.example.com/api/assets/asset-id',
    postprocess: ['json:data.floor_price', 'div:100000000']
  }
}
```

## Supported Operations

### HTTP Operations

#### `http-get`
Perform HTTP GET requests.

**Parameters:**
- `url` (string): The URL to fetch

**Example:**
```javascript
{
  type: 'http-get',
  params: { url: 'https://api.example.com/data' }
}
```

#### `http-post`
Perform HTTP POST requests.

**Parameters:**
- `url` (string): The URL to send the request to
- `body` (object): The request body (will be JSON stringified)

**Example:**
```javascript
{
  type: 'http-post',
  params: {
    url: 'https://api.example.com/users',
    body: { name: 'John Doe', email: 'john@example.com' }
  }
}
```

### Blockchain Operations

#### `balanceOf`
Get ERC20 token balance or Bitcoin balance.

**Parameters:**
- `chainid` (number|string): Chain ID (1 for Ethereum, 56 for BSC, 137 for Polygon, 'BTC' for Bitcoin)
- `contract` (string): ERC20 contract address (not required for Bitcoin)
- `address` (string): Wallet address to query

**Supported Chains:**
- Ethereum Mainnet (1)
- Binance Smart Chain (56)
- Polygon (137)
- Bitcoin ('BTC')

**Example:**
```javascript
// ERC20 token balance
{
  type: 'balanceOf',
  params: {
    chainid: 1,
    contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  }
}

// Bitcoin balance
{
  type: 'balanceOf',
  params: {
    chainid: 'BTC',
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
  }
}
```

#### `call`
Execute smart contract calls using raw hex data.

**Parameters:**
- `chainid` (number): Chain ID (1 for Ethereum, 56 for BSC, 137 for Polygon)
- `contract` (string): Smart contract address
- `data` (string): Raw hex data for the contract call (with or without 0x prefix)

**Supported Chains:**
- Ethereum Mainnet (1)
- Binance Smart Chain (56)
- Polygon (137)

**Example:**
```javascript
// Call ERC20 token name() method
// Function selector for name() is 0x06fdde03
{
  type: 'call',
  params: {
    chainid: 1,
    contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    data: '0x06fdde03'
  }
}

// Call ERC20 token symbol() method
// Function selector for symbol() is 0x95d89b41
{
  type: 'call',
  params: {
    chainid: 1,
    contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    data: '0x95d89b41'
  }
}

// Call ERC20 token balanceOf(address) method
// Function selector for balanceOf(address) is 0x70a08231
// Parameter: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
{
  type: 'call',
  params: {
    chainid: 1,
    contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    data: '0x70a08231000000000000000000000000d8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  }
}
```

### Price Operations

#### `binance`
Get cryptocurrency prices from Binance API.

**Parameters:**
- `symbol` (string): Trading pair symbol (e.g., 'BTCUSDT', 'ETHUSDT')

**Example:**
```javascript
{
  type: 'binance',
  params: { symbol: 'BTCUSDT' }
}
```

#### `lpPrice`
Calculate AMM LP token prices for Uniswap and other AMM protocols.

**Parameters:**
- `chainid` (number): Chain ID (1 for Ethereum, 56 for BSC, 137 for Polygon)
- `contract` (string): LP contract address
- `reverse` (boolean): Price calculation direction
  - `false`: Calculate token0/token1 price
  - `true`: Calculate token1/token0 price

**Example:**
```javascript
// Calculate USDC/WETH price (token0/token1)
{
  type: 'lpPrice',
  params: {
    chainid: 1,
    contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
    reverse: false
  }
}

// Calculate WETH/USDC price (token1/token0)
{
  type: 'lpPrice',
  params: {
    chainid: 1,
    contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
    reverse: true
  }
}
```


## API Reference

### `fetch(operations)`

Execute multiple operations concurrently and return results in the same order.

**Parameters:**
- `operations` (Array): Array of operation objects

**Returns:**
- `Promise<Array<string>>`: Array of string results in the same order as input operations

**Operation Object Structure:**
```javascript
{
  type: string,        // Operation type (http-get, http-post, balanceOf, call, binance, lpPrice)
  params: object       // Operation-specific parameters
}
```

**Result Array Structure:**
```javascript
[
  "result1",  // First operation result
  "result2",  // Second operation result
  // ... more results in order
]
```

## Error Handling

The library provides detailed error messages for different failure scenarios:

- **Invalid input**: "输入必须是一个操作数组。"
- **Missing parameters**: Specific error for each operation type
- **Network errors**: HTTP and RPC call failures
- **Unsupported operations**: "不支持的操作类型: [type]"

## Examples

### Complete Example

```javascript
const { fetch } = require('bcfetch');

const operations = [
  // HTTP GET request
  {
    type: 'http-get',
    params: { url: 'https://jsonplaceholder.typicode.com/users/1' }
  },
  
  // HTTP POST request
  {
    type: 'http-post',
    params: {
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: { title: 'New Post', body: 'Content here', userId: 1 }
    }
  },
  
  // ERC20 token balance
  {
    type: 'balanceOf',
    params: {
      chainid: 1,
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  },
  
  // Smart contract call
  {
    type: 'call',
    params: {
      chainid: 1,
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      data: '0x06fdde03' // name() function selector
    }
  },
  
  // Bitcoin balance
  {
    type: 'balanceOf',
    params: {
      chainid: 'BTC',
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
    }
  },
  
  // Cryptocurrency price
  {
    type: 'binance',
    params: { symbol: 'ETHUSDT' }
  },
  
  // AMM LP price
  {
    type: 'lpPrice',
    params: {
      chainid: 1,
      contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
      reverse: true
    }
  },
  
];

async function main() {
  console.log('Starting operations...');
  
  try {
    const results = await fetch(operations);
    
    console.log('All operations completed successfully!');
    results.forEach((value, index) => {
      console.log(`Result ${index + 1}:`, value);
    });
    
  } catch (error) {
    console.error('Operation failed:', error.message);
  }
}

main();
```

### DeFi Portfolio Example

```javascript
const { fetch } = require('bcfetch');

// Check multiple token balances and prices
const portfolioOperations = [
  // Token balances
  {
    type: 'balanceOf',
    params: {
      chainid: 1,
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      address: '0xYourWalletAddress'
    }
  },
  {
    type: 'balanceOf',
    params: {
      chainid: 1,
      contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      address: '0xYourWalletAddress'
    }
  },
  
  // Current prices
  {
    type: 'binance',
    params: { symbol: 'USDCUSDT' }
  },
  {
    type: 'binance',
    params: { symbol: 'ETHUSDT' }
  },
  
  // LP token prices
  {
    type: 'lpPrice',
    params: {
      chainid: 1,
      contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
      reverse: false
    }
  }
];

async function checkPortfolio() {
  try {
    const results = await fetch(portfolioOperations);
    
    // Calculate portfolio value
    const usdcBalance = parseFloat(results[0]);
    const wethBalance = parseFloat(results[1]);
    const usdcPrice = parseFloat(results[2]);
    const ethPrice = parseFloat(results[3]);
    
    const totalValue = (usdcBalance * usdcPrice) + (wethBalance * ethPrice);
    
    console.log('Portfolio Summary:');
    console.log(`USDC: ${usdcBalance.toFixed(2)} ($${(usdcBalance * usdcPrice).toFixed(2)})`);
    console.log(`WETH: ${wethBalance.toFixed(4)} ($${(wethBalance * ethPrice).toFixed(2)})`);
    console.log(`Total Value: $${totalValue.toFixed(2)}`);
    console.log(`USDC/WETH LP Price: ${results[4]}`);
    
  } catch (error) {
    console.error('Portfolio check failed:', error.message);
  }
}

checkPortfolio();
```

## Dependencies

- [ethers](https://www.npmjs.com/package/ethers) ^6.15.0 - Ethereum library for blockchain interactions
- [gemini-code](https://www.npmjs.com/package/gemini-code) ^0.2.4 - Additional utilities
- [cheerio](https://www.npmjs.com/package/cheerio) ^1.0.0-rc.12 - Server-side jQuery implementation for HTML parsing

## Supported Networks

### Ethereum
- **Chain ID**: 1
- **RPC**: https://ethereum.publicnode.com

### Binance Smart Chain
- **Chain ID**: 56
- **RPC**: https://bsc-dataseed.binance.org/

### Polygon
- **Chain ID**: 137
- **RPC**: https://polygon-rpc.com

### Bitcoin
- **Chain ID**: 'BTC'
- **API**: https://blockstream.info/api/

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.4.0
- **NEW**: Added `postprocess` parameter for data transformation and formatting
- Added JSON data extraction with dot notation (`json:path.to.property`)
- Added mathematical operations (`div:number`, `mul:number`, `add:number`, `sub:number`)
- Added data type conversion (`toNumber`)
- Added object property extraction (`object:path.to.property`)
- Added support for chainable operations using arrays
- Enhanced error handling for postprocess operations
- All operation types now support postprocess parameter

### v0.6.0
- **NEW**: Added `call` operation type for smart contract calls using raw hex data
- Added support for direct contract calls with 16-bit hex data strings
- Added automatic 0x prefix handling for hex data
- Enhanced error handling for hex data validation

### v0.5.0
- **BREAKING CHANGE**: `fetch()` function now returns an array of strings instead of an array of objects
- Removed `name` field requirement from operation objects
- Simplified API - results are returned in the same order as input operations
- Updated all examples and documentation to reflect the new API

### v0.4.0
- Added support for extracting text content and attributes from web pages
- Added cheerio dependency for HTML parsing

### v0.3.1
- Fixed parameter naming consistency (chainId → chainid)

### v0.3.0
- Added `lpPrice` operation type for AMM LP token price calculations
- Added support for Uniswap V2 LP contracts
- Updated keywords and description

### v0.2.0
- Added `binance` operation type for cryptocurrency prices
- Added Bitcoin balance support
- Improved error handling

### v0.1.0
- Initial release
- HTTP GET/POST operations
- ERC20 token balance queries
- Concurrent execution support

## Support

If you encounter any issues or have questions, please open an issue on the [GitHub repository](https://github.com/your-username/bcfetch).

---

Made with ❤️ by [Gemini](https://github.com/your-username)
