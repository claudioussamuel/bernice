# 🔄 Switch to Base Sepolia Network

Your wallet is still showing **Base Mainnet** instead of **Base Sepolia** because the wallet network needs to be manually switched. Here's how to fix it:

## 🚀 **Quick Fix: Use the App's Switch Button**

The app now has automatic network switching! When you connect your wallet:

1. **You'll see a blue banner** saying "Wrong Network"
2. **Click "Switch Network"** button
3. **Approve the network switch** in your wallet popup

![Network Switch Banner](https://via.placeholder.com/600x150/3B82F6/FFFFFF?text=🔄+Wrong+Network+-+Switch+to+Base+Sepolia)

## 📱 **Manual Network Switch Methods**

### **Method 1: MetaMask**
1. Open MetaMask
2. Click network dropdown (top center)
3. Look for **"Base Sepolia"** in the list
4. If not there, click **"Add Network"**
5. Enter these details:
   ```
   Network Name: Base Sepolia
   New RPC URL: https://sepolia.base.org
   Chain ID: 84532
   Currency Symbol: ETH
   Block Explorer: https://sepolia.basescan.org
   ```

### **Method 2: Coinbase Wallet**
1. Open Coinbase Wallet
2. Go to **Settings → Networks**
3. Look for **"Base Sepolia"** or **"Base Testnet"**
4. Select it, or add manually with the details above

### **Method 3: Other Wallets**
Most modern wallets have Base Sepolia built-in. Look for:
- "Base Sepolia"
- "Base Testnet" 
- Chain ID: 84532

## ✅ **How to Verify You're on Base Sepolia**

After switching, you should see:
- **Network Name**: Base Sepolia (not Base)
- **Chain ID**: 84532 (not 8453)
- **ETH Balance**: Your testnet ETH
- **No blue warning banner** in the Bernice app

## 💰 **Get Base Sepolia ETH**

Once on Base Sepolia, get testnet ETH:

1. **Coinbase Faucet** (Recommended):
   - Visit: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Connect wallet
   - Request 0.05 ETH (free)

2. **Bridge from Ethereum Sepolia**:
   - Get Sepolia ETH from: https://sepoliafaucet.com/
   - Bridge via: https://bridge.base.org/deposit

## 🎯 **Test the Integration**

After switching to Base Sepolia:

1. **Refresh the Bernice app**
2. **Blue banner should disappear**
3. **Try the BlockchainDemo component**
4. **Create a test story**

## 🐛 **Troubleshooting**

### "Switch Network button doesn't work"
- Make sure your wallet supports programmatic network switching
- Try adding Base Sepolia manually first
- Refresh the page after adding the network

### "Still shows wrong network"
- Hard refresh the browser (Ctrl+F5)
- Disconnect and reconnect wallet
- Check wallet is actually on Base Sepolia

### "Transaction fails"
- Make sure you have Base Sepolia ETH
- Check you're on the right network (Chain ID: 84532)
- Wait a moment and try again

## 🔗 **Useful Links**

- **Base Sepolia Explorer**: https://sepolia.basescan.org
- **Base Sepolia Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **Base Bridge**: https://bridge.base.org/deposit
- **Network Details**: Chain ID 84532, RPC: https://sepolia.base.org

---

**Need More Help?**
- Check the [DEPLOY_TO_SEPOLIA.md](./DEPLOY_TO_SEPOLIA.md) guide
- Review [BLOCKCHAIN_INTEGRATION.md](./BLOCKCHAIN_INTEGRATION.md) for technical details

The app is now smart enough to detect and help you switch networks! 🎉
