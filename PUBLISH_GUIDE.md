# bcfetch 发布指南

## 当前状态
- ✅ 代码已合并并测试通过
- ✅ Git提交已完成 (commit: c43c4b3)
- ✅ 版本已更新到 v1.2.0
- ✅ Git标签已推送到远程仓库
- ⏳ 等待npm发布（需要一次性密码）

## 完成npm发布

由于启用了2FA（双因素认证），需要一次性密码来完成发布：

```bash
# 方法1: 使用OTP参数
npm publish --otp=<你的验证码>

# 方法2: 交互式输入
npm publish
# 然后输入你的验证码
```

## 发布内容摘要

### v1.2.0 主要变更
- 🗑️ **移除xpath功能** - 删除了需要Puppeteer的非浏览器兼容功能
- 🔄 **合并文件** - 将browser-compatible.js合并到index.js中
- 📦 **统一入口** - 现在main和browser字段都指向index.js
- 🧹 **清理依赖** - 移除了Puppeteer相关依赖
- 📚 **更新文档** - 更新README移除xpath相关内容
- ✅ **保持兼容** - 所有其他功能完全保留

### 支持的操作类型
- `http-get` - HTTP GET请求
- `http-post` - HTTP POST请求  
- `balanceOf` - 代币余额查询（ERC20 + BTC）
- `binance` - 币安价格查询
- `lpPrice` - AMM LP代币价格计算
- `call` - 智能合约调用

### 环境支持
- ✅ Node.js环境
- ✅ 浏览器环境
- ✅ 统一API接口

## 验证发布
发布完成后，可以通过以下方式验证：

```bash
# 检查版本
npm view bcfetch version

# 安装测试
npm install bcfetch@1.2.0

# 测试功能
node -e "const { fetch } = require('bcfetch'); console.log('✅ 发布成功！');"
```

## 回滚计划
如果发布后发现问题，可以：

1. 修复问题并发布补丁版本 (1.2.1)
2. 或者回滚到上一个稳定版本 (1.1.0)

```bash
# 回滚到1.1.0
npm deprecate bcfetch@1.2.0 "有问题的版本，请使用1.1.0"
```