# bcfetch

[![npm version](https://badge.fury.io/js/bcfetch.svg)](https://badge.fury.io/js/bcfetch)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A powerful library to perform multiple fetch operations based on type, including HTTP requests, blockchain data fetching, and AMM LP token price calculations. Supports both Node.js and browser environments.

## Features

- 🌐 **HTTP Operations**: GET and POST requests
- 🔗 **Blockchain Integration**: Balance queries for ERC20 tokens and Bitcoin
- 💰 **Price Data**: Binance API integration for cryptocurrency prices
- 🏦 **AMM Support**: Calculate LP token prices for Uniswap and other AMM protocols
- 🎯 **XPath Support**: Extract content from web pages using XPath selectors (Node.js only)
- ⚡ **Concurrent Execution**: All operations run in parallel for maximum performance
- 🔧 **Type-based**: Easy to extend with new operation types

## Installation

```bash
npm install bcfetch
```

### Optional Dependencies

For XPath functionality (Node.js only), you may need to install Puppeteer:

```bash
npm install puppeteer
```

## Environment Support

- **Node.js**: Full functionality including XPath support
- **Browser**: All features except XPath (requires Puppeteer)

## Quick Start

### Node.js Environment

```javascript
const { fetch } = require('bcfetch');

const operations = [
  {
    name: 'user_data',
    type: 'http-get',
    params: { url: 'https://jsonplaceholder.typicode.com/users/1' }
  },
  {
    name: 'usdc_balance',
    type: 'balanceOf',
    params: {
      chainid: 1,
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  },
  {
    name: 'btc_price',
    type: 'binance',
    params: { symbol: 'BTCUSDT' }
  },
  {
    name: 'weth_usdc_price',
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
    console.log(results);
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
    name: 'btc_price',
    type: 'binance',
    params: { symbol: 'BTCUSDT' }
  },
  {
    name: 'eth_balance',
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
    console.log(results);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchData();
```

**Note**: XPath operations are not available in browser environments as they require Puppeteer.

## Supported Operations

### HTTP Operations

#### `http-get`
Perform HTTP GET requests.

**Parameters:**
- `url` (string): The URL to fetch

**Example:**
```javascript
{
  name: 'api_data',
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
  name: 'create_user',
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
  name: 'usdc_balance',
  type: 'balanceOf',
  params: {
    chainid: 1,
    contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  }
}

// Bitcoin balance
{
  name: 'btc_balance',
  type: 'balanceOf',
  params: {
    chainid: 'BTC',
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
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
  name: 'btc_price',
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
  name: 'usdc_weth_price',
  type: 'lpPrice',
  params: {
    chainid: 1,
    contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
    reverse: false
  }
}

// Calculate WETH/USDC price (token1/token0)
{
  name: 'weth_usdc_price',
  type: 'lpPrice',
  params: {
    chainid: 1,
    contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
    reverse: true
  }
}
```

### Web Scraping Operations

#### `xpath`
Extract content from web pages using XPath selectors.

**Parameters:**
- `url` (string): The URL of the web page to scrape
- `xpath` (string): XPath selector to find elements
- `attribute` (string, optional): Specific attribute to extract (e.g., 'href', 'src', 'class'). If not provided, returns text content.
- `waitFor` (number, optional): Wait time in milliseconds for dynamic content to load (default: 3000ms)

**Example:**
```javascript
// Extract text content from a specific element
{
  name: 'page_title',
  type: 'xpath',
  params: {
    url: 'https://example.com',
    xpath: '//h1[@class="title"]'
  }
}

// Extract href attribute from links
{
  name: 'main_link',
  type: 'xpath',
  params: {
    url: 'https://example.com',
    xpath: '//a[@class="main-link"]',
    attribute: 'href'
  }
}

// Extract multiple elements' text content
{
  name: 'all_titles',
  type: 'xpath',
  params: {
    url: 'https://example.com',
    xpath: '//h2'
  }
}

// Extract content from dynamic page (with wait time)
{
  name: 'dynamic_content',
  type: 'xpath',
  params: {
    url: 'https://transcription.bihelix.io/zh',
    xpath: '/html/body/div[1]/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[1]/div[2]',
    waitFor: 5000
  }
}
```

## API Reference

### `fetch(operations)`

Execute multiple operations concurrently and return results in the same order.

**Parameters:**
- `operations` (Array): Array of operation objects

**Returns:**
- `Promise<Array>`: Array of result objects with operation names as keys

**Operation Object Structure:**
```javascript
{
  name: string,        // Unique name for the operation
  type: string,        // Operation type (http-get, http-post, balanceOf, binance, lpPrice, xpath)
  params: object       // Operation-specific parameters
}
```

**Result Object Structure:**
```javascript
{
  [operationName]: resultValue  // Key is the operation name, value is the result
}
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
    name: 'user_profile',
    type: 'http-get',
    params: { url: 'https://jsonplaceholder.typicode.com/users/1' }
  },
  
  // HTTP POST request
  {
    name: 'create_post',
    type: 'http-post',
    params: {
      url: 'https://jsonplaceholder.typicode.com/posts',
      body: { title: 'New Post', body: 'Content here', userId: 1 }
    }
  },
  
  // ERC20 token balance
  {
    name: 'usdc_balance',
    type: 'balanceOf',
    params: {
      chainid: 1,
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    }
  },
  
  // Bitcoin balance
  {
    name: 'btc_balance',
    type: 'balanceOf',
    params: {
      chainid: 'BTC',
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
    }
  },
  
  // Cryptocurrency price
  {
    name: 'eth_price',
    type: 'binance',
    params: { symbol: 'ETHUSDT' }
  },
  
  // AMM LP price
  {
    name: 'weth_usdc_price',
    type: 'lpPrice',
    params: {
      chainid: 1,
      contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc',
      reverse: true
    }
  },
  
  // XPath scraping
  {
    name: 'page_title',
    type: 'xpath',
    params: {
      url: 'https://example.com',
      xpath: '//h1'
    }
  }
];

async function main() {
  console.log('Starting operations...');
  
  try {
    const results = await fetch(operations);
    
    console.log('All operations completed successfully!');
    results.forEach((result, index) => {
      const name = Object.keys(result)[0];
      const value = result[name];
      console.log(`${name}:`, value);
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
    name: 'usdc_balance',
    type: 'balanceOf',
    params: {
      chainid: 1,
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      address: '0xYourWalletAddress'
    }
  },
  {
    name: 'weth_balance',
    type: 'balanceOf',
    params: {
      chainid: 1,
      contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      address: '0xYourWalletAddress'
    }
  },
  
  // Current prices
  {
    name: 'usdc_price',
    type: 'binance',
    params: { symbol: 'USDCUSDT' }
  },
  {
    name: 'eth_price',
    type: 'binance',
    params: { symbol: 'ETHUSDT' }
  },
  
  // LP token prices
  {
    name: 'usdc_weth_lp_price',
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
    const usdcBalance = parseFloat(results[0].usdc_balance);
    const wethBalance = parseFloat(results[1].weth_balance);
    const usdcPrice = parseFloat(results[2].usdc_price);
    const ethPrice = parseFloat(results[3].eth_price);
    
    const totalValue = (usdcBalance * usdcPrice) + (wethBalance * ethPrice);
    
    console.log('Portfolio Summary:');
    console.log(`USDC: ${usdcBalance.toFixed(2)} ($${(usdcBalance * usdcPrice).toFixed(2)})`);
    console.log(`WETH: ${wethBalance.toFixed(4)} ($${(wethBalance * ethPrice).toFixed(2)})`);
    console.log(`Total Value: $${totalValue.toFixed(2)}`);
    console.log(`USDC/WETH LP Price: ${results[4].usdc_weth_lp_price}`);
    
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

### v0.4.0
- Added `xpath` operation type for web scraping using XPath selectors
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
