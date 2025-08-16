import { NextRequest, NextResponse } from 'next/server'
import { Coinbase } from '@coinbase/coinbase-sdk'

// Initialize Coinbase SDK on the server side
const initCoinbase = () => {
  const apiKey = process.env.COINBASE_API_KEY
  const privateKey = process.env.COINBASE_API_PRIVATE_KEY
  
  if (!apiKey || !privateKey) {
    throw new Error('Coinbase API credentials not configured')
  }

  return new Coinbase({
    apiKeyName: apiKey,
    privateKey: privateKey,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { action, params } = await request.json()

    switch (action) {
      case 'createWallet': {
        const coinbase = initCoinbase()
        const wallet = await coinbase.createWallet()
        const address = await wallet.getDefaultAddress()
        
        return NextResponse.json({
          success: true,
          walletId: wallet.getId(),
          address: address.getId(),
        })
      }

      case 'sendTransaction': {
        const { walletId, amount, recipientAddress } = params
        const coinbase = initCoinbase()
        const wallet = await coinbase.getWallet(walletId)
        
        const transfer = await wallet.createTransfer({
          amount,
          assetId: Coinbase.assets.Eth,
          destination: recipientAddress,
        })

        const result = await transfer.wait()
        
        return NextResponse.json({
          success: true,
          transactionHash: result.getTransactionHash(),
        })
      }

      case 'setupX402Payment': {
        const { walletId, goalId, amount, conditions } = params
        
        // Here we would integrate with x402 protocol
        // For now, we'll create a mock implementation
        const x402Config = {
          payer: walletId,
          recipient: goalId,
          amount,
          conditions,
          automationType: 'smart_contract',
          verificationOracle: 'health_data_oracle',
        }

        // In production, this would interact with x402 smart contracts
        const paymentId = `x402_${goalId}_${Date.now()}`

        return NextResponse.json({
          success: true,
          paymentId,
          config: x402Config,
        })
      }

      case 'getBalance': {
        const { walletId } = params
        const coinbase = initCoinbase()
        const wallet = await coinbase.getWallet(walletId)
        
        const balances = await wallet.listBalances()
        
        return NextResponse.json({
          success: true,
          balances: balances.map(b => ({
            asset: b.getAsset().getAssetId(),
            amount: b.getAmount(),
          })),
        })
      }

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Coinbase API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}