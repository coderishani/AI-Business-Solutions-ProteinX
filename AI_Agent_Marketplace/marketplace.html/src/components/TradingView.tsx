import React, { useState, useEffect } from 'react';
import {
  TradingPair,
  OrderBookEntry,
  TradeOrder,
  StrategyBot,
} from '../types';
import {
  TRADING_PAIRS,
  INITIAL_ORDER_BOOK,
  INITIAL_TRADES,
  STRATEGY_BOTS,
} from '../data/mockData';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  DollarSign,
  Shield,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { calculateOrderSlippage, generateTxHash, formatTelemetryLatency } from '../utils/orchestratorLogic';

export const TradingView: React.FC = () => {
  const [pairs] = useState<TradingPair[]>(TRADING_PAIRS);
  const [selectedPair, setSelectedPair] = useState<TradingPair>(TRADING_PAIRS[0]);
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '1h' | '1D'>('5m');
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'twap'>('market');
  const [isBuy, setIsBuy] = useState<boolean>(true);
  const [tradeAmount, setTradeAmount] = useState<number>(10);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.1);
  const [strategyBots, setStrategyBots] = useState<StrategyBot[]>(STRATEGY_BOTS);
  const [trades, setTrades] = useState<TradeOrder[]>(INITIAL_TRADES);
  const [orderBook, setOrderBook] = useState(INITIAL_ORDER_BOOK);
  const [livePrice, setLivePrice] = useState<number>(selectedPair.price);
  const [orderStatusToast, setOrderStatusToast] = useState<string | null>(null);

  // When selected pair changes, update price
  useEffect(() => {
    setLivePrice(selectedPair.price);
  }, [selectedPair]);

  // Periodic micro-tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * 0.15;
      setLivePrice((prev) => Number((prev + delta).toFixed(2)));

      // Add random trade occasionally
      if (Math.random() > 0.4) {
        const isRandomBuy = Math.random() > 0.5;
        const newTrade: TradeOrder = {
          id: `tx-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100),
          pairSymbol: selectedPair.symbol,
          type: isRandomBuy ? 'buy' : 'sell',
          price: Number((selectedPair.price + (isRandomBuy ? 0.05 : -0.05)).toFixed(2)),
          amount: Number((Math.random() * 20 + 2).toFixed(1)),
          total: Number(((selectedPair.price) * (Math.random() * 20 + 2)).toFixed(2)),
          latencyMs: Number((Math.random() * 6 + 7).toFixed(1)),
          txHash: generateTxHash().slice(0, 10) + '...',
          status: 'filled',
        };
        setTrades((prev) => [newTrade, ...prev.slice(0, 7)]);
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [selectedPair]);

  // Slippage estimation using pure logic
  const totalAvailableDepth = 250;
  const { estimatedPrice, slippagePct } = calculateOrderSlippage(
    tradeAmount,
    totalAvailableDepth,
    livePrice,
    isBuy
  );

  const handleToggleBot = (botId: string) => {
    setStrategyBots((prev) =>
      prev.map((bot) => (bot.id === botId ? { ...bot, active: !bot.active } : bot))
    );
  };

  const handleExecuteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeAmount <= 0) return;

    const newTx: TradeOrder = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 900 + 100),
      pairSymbol: selectedPair.symbol,
      type: isBuy ? 'buy' : 'sell',
      price: estimatedPrice,
      amount: tradeAmount,
      total: Number((estimatedPrice * tradeAmount).toFixed(2)),
      latencyMs: 11.4,
      txHash: generateTxHash().slice(0, 10) + '...',
      status: 'filled',
    };

    setTrades((prev) => [newTx, ...prev.slice(0, 7)]);
    setOrderStatusToast(
      `Algorithm Filled: ${isBuy ? 'BUY' : 'SELL'} ${tradeAmount} ${selectedPair.baseAsset} @ $${estimatedPrice} (${slippagePct}% impact)`
    );
    setTimeout(() => setOrderStatusToast(null), 4000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Toast Notification */}
      {orderStatusToast && (
        <div className="p-3 rounded bg-[#10E896]/10 border border-[#10E896]/40 text-[#10E896] text-xs font-mono flex items-center justify-between shadow-[0_0_16px_rgba(16,232,150,0.2)] animate-pulse">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>{orderStatusToast}</span>
          </div>
          <button onClick={() => setOrderStatusToast(null)} className="text-[#849495] hover:text-white">✕</button>
        </div>
      )}

      {/* Top Asset Pair Ticker Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {pairs.map((pair) => {
          const isSelected = pair.id === selectedPair.id;
          const isPositive = pair.change24h >= 0;
          return (
            <button
              key={pair.id}
              onClick={() => setSelectedPair(pair)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-[#161D2E] border-[#00F0FF] shadow-[0_0_16px_rgba(0,240,255,0.2)]'
                  : 'bg-[#101522] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-[#849495] mb-1">
                <span className="font-bold text-white">{pair.symbol}</span>
                <span
                  className={`flex items-center gap-0.5 text-[11px] font-semibold ${
                    isPositive ? 'text-[#10E896]' : 'text-[#FF453A]'
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {isPositive ? '+' : ''}{pair.change24h}%
                </span>
              </div>
              <div className="text-lg font-bold font-mono text-white tabular-nums">
                ${pair.id === selectedPair.id ? livePrice.toFixed(2) : pair.price.toFixed(2)}
              </div>
              <div className="text-[10px] font-mono text-[#849495] mt-1 flex justify-between">
                <span>VOL: {pair.volume24h}</span>
                <span>SPREAD: {pair.spread}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Trading Floor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================================= */}
        {/* LEFT & CENTER: Interactive SVG Candlestick / Area Chart & Bots (8 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-5">
          {/* Chart Card */}
          <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3">
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-white">
                  {selectedPair.symbol} REAL-TIME EXECUTION CHART
                </h3>
                <span className="text-xs font-mono text-[#10E896] bg-[rgba(16,232,150,0.1)] px-2 py-0.5 rounded border border-[rgba(16,232,150,0.25)]">
                  LIVE FEED
                </span>
              </div>

              {/* Timeframe Selectors */}
              <div className="flex items-center gap-1 bg-[#0A0D14] p-1 rounded border border-[rgba(255,255,255,0.06)] text-xs font-mono">
                {(['1m', '5m', '1h', '1D'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded transition-all ${
                      timeframe === tf
                        ? 'bg-[#161D2E] text-[#00F0FF] font-semibold'
                        : 'text-[#849495] hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Visual Candlestick & Volume Area Chart */}
            <div className="w-full h-72 bg-[#0A0D14] rounded border border-[rgba(255,255,255,0.04)] relative overflow-hidden flex flex-col justify-between p-3 select-none">
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 pointer-events-none opacity-20">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border-b border-r border-[rgba(255,255,255,0.1)]" />
                ))}
              </div>

              {/* Top chart metrics */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#849495]">
                <div className="flex items-center gap-4">
                  <span>HIGH: <strong className="text-white">${selectedPair.high24h.toFixed(2)}</strong></span>
                  <span>LOW: <strong className="text-white">${selectedPair.low24h.toFixed(2)}</strong></span>
                  <span>MA(20): <strong className="text-[#00F0FF]">${(livePrice * 0.994).toFixed(2)}</strong></span>
                </div>
                <div className="text-[#10E896]">TICK DRIFT: +0.04%</div>
              </div>

              {/* Synthetic Candlesticks & Area SVG */}
              <div className="relative z-10 flex-1 flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area fill */}
                  <path
                    d="M 20,130 Q 80,110 140,120 T 260,95 T 380,105 T 500,75 T 620,60 L 680,50 L 680,180 L 20,180 Z"
                    fill="url(#areaGradient)"
                  />

                  {/* MA Line */}
                  <path
                    d="M 20,130 Q 80,110 140,120 T 260,95 T 380,105 T 500,75 T 620,60 L 680,50"
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="2.5"
                  />

                  {/* Candlestick visual bars */}
                  {[
                    { x: 50, o: 135, c: 125, h: 140, l: 120, up: true },
                    { x: 110, o: 125, c: 115, h: 130, l: 110, up: true },
                    { x: 170, o: 115, c: 122, h: 128, l: 112, up: false },
                    { x: 230, o: 122, c: 105, h: 125, l: 100, up: true },
                    { x: 290, o: 105, c: 98, h: 110, l: 94, up: true },
                    { x: 350, o: 98, c: 106, h: 112, l: 95, up: false },
                    { x: 410, o: 106, c: 90, h: 108, l: 88, up: true },
                    { x: 470, o: 90, c: 82, h: 95, l: 78, up: true },
                    { x: 530, o: 82, c: 74, h: 86, l: 70, up: true },
                    { x: 590, o: 74, c: 62, h: 78, l: 58, up: true },
                    { x: 650, o: 62, c: 50, h: 65, l: 48, up: true },
                  ].map((bar, i) => (
                    <g key={i}>
                      {/* Wick */}
                      <line
                        x1={bar.x}
                        y1={bar.h}
                        x2={bar.x}
                        y2={bar.l}
                        stroke={bar.up ? '#10E896' : '#FF453A'}
                        strokeWidth="1.5"
                      />
                      {/* Candle Body */}
                      <rect
                        x={bar.x - 6}
                        y={Math.min(bar.o, bar.c)}
                        width="12"
                        height={Math.max(6, Math.abs(bar.o - bar.c))}
                        fill={bar.up ? '#10E896' : '#FF453A'}
                        rx="1"
                      />
                    </g>
                  ))}

                  {/* Current Price Horizontal Ray */}
                  <line x1="20" y1="50" x2="680" y2="50" stroke="#00F0FF" strokeDasharray="3 3" strokeWidth="1" />
                </svg>
              </div>

              {/* Bottom Volume Bars */}
              <div className="relative z-10 flex items-end justify-between h-8 pt-1 border-t border-[rgba(255,255,255,0.06)]">
                {Array.from({ length: 28 }).map((_, idx) => {
                  const h = Math.floor(Math.sin(idx * 0.4) * 16 + 18);
                  return (
                    <div
                      key={idx}
                      className="w-1.5 rounded-t bg-[#00F0FF]/30 hover:bg-[#00F0FF] transition-all"
                      style={{ height: `${h}px` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Autonomous Strategy Bots Matrix */}
          <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#7B61FF]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#849495] font-semibold">
                  AUTONOMOUS STRATEGY ENGINES
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#10E896]">
                AGGREGATE APY: +31.2%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {strategyBots.map((bot) => (
                <div
                  key={bot.id}
                  className={`p-3 rounded border transition-all ${
                    bot.active
                      ? 'bg-[#161D2E] border-[rgba(123,97,255,0.4)] shadow-[0_0_12px_rgba(123,97,255,0.15)]'
                      : 'bg-[#101522] border-[rgba(255,255,255,0.04)] opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-white">
                      {bot.name}
                    </span>
                    {/* Active toggle button */}
                    <button
                      onClick={() => handleToggleBot(bot.id)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer ${
                        bot.active
                          ? 'bg-[#10E896]/15 text-[#10E896] border border-[#10E896]/30'
                          : 'bg-[#849495]/20 text-[#849495] border border-transparent'
                      }`}
                    >
                      {bot.active ? 'ACTIVE' : 'HALTED'}
                    </button>
                  </div>

                  <p className="text-[11px] text-[#b9cacb] line-clamp-1 mb-2">
                    {bot.description}
                  </p>

                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[rgba(255,255,255,0.04)] text-[10px] font-mono">
                    <div>
                      <span className="text-[#849495]">YIELD:</span>
                      <div className="text-[#10E896] font-bold">+{bot.apy}% APY</div>
                    </div>
                    <div>
                      <span className="text-[#849495]">WIN RATE:</span>
                      <div className="text-white font-bold">{bot.winRate}%</div>
                    </div>
                    <div>
                      <span className="text-[#849495]">LATENCY:</span>
                      <div className="text-[#00F0FF] font-bold">{bot.latencyMs}ms</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT: Order Book & Algorithmic Order Entry (4 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Algorithmic Order Entry Box */}
          <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#849495] font-semibold">
                EXECUTION DESK
              </span>
              <span className="text-[11px] font-mono text-[#00F0FF]">
                ZERO-SLIPPAGE ROUTER
              </span>
            </div>

            {/* Buy / Sell Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-[#0A0D14] p-1 rounded font-mono text-xs">
              <button
                onClick={() => setIsBuy(true)}
                className={`py-1.5 rounded font-bold transition-all ${
                  isBuy
                    ? 'bg-[#10E896] text-[#0A0D14] shadow-[0_0_12px_rgba(16,232,150,0.3)]'
                    : 'text-[#849495] hover:text-white'
                }`}
              >
                BUY / LONG
              </button>
              <button
                onClick={() => setIsBuy(false)}
                className={`py-1.5 rounded font-bold transition-all ${
                  !isBuy
                    ? 'bg-[#FF453A] text-white shadow-[0_0_12px_rgba(255,69,58,0.3)]'
                    : 'text-[#849495] hover:text-white'
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            {/* Order Type: Market / Limit / TWAP */}
            <div className="flex gap-1 text-[11px] font-mono">
              {(['market', 'limit', 'twap'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  className={`flex-1 py-1 rounded border uppercase ${
                    orderType === type
                      ? 'bg-[#161D2E] text-[#00F0FF] border-[#00F0FF]/40'
                      : 'bg-[#101522] text-[#849495] border-[rgba(255,255,255,0.06)]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleExecuteOrder} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[11px] text-[#849495] mb-1">
                  ORDER SIZE ({selectedPair.baseAsset}):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="1000"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded input-obsidian text-white font-bold"
                  />
                  <span className="absolute right-3 top-2 text-[#849495]">
                    {selectedPair.baseAsset}
                  </span>
                </div>
              </div>

              {/* Quick % buttons */}
              <div className="flex gap-1 text-[10px]">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTradeAmount(pct * 0.5)}
                    className="flex-1 py-1 rounded bg-[#161D2E] text-[#b9cacb] hover:text-white border border-[rgba(255,255,255,0.06)]"
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              {/* Slippage & Route calculation */}
              <div className="p-2.5 rounded bg-[#161D2E] border border-[rgba(255,255,255,0.04)] space-y-1.5 text-[11px]">
                <div className="flex justify-between text-[#849495]">
                  <span>EST. FILL PRICE:</span>
                  <span className="text-white font-bold tabular-nums">${estimatedPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#849495]">
                  <span>EST. SLIPPAGE:</span>
                  <span className="text-[#10E896] tabular-nums">{slippagePct}%</span>
                </div>
                <div className="flex justify-between text-[#849495]">
                  <span>TOTAL ESTIMATE:</span>
                  <span className="text-[#00F0FF] font-bold tabular-nums">
                    ${(estimatedPrice * tradeAmount).toFixed(2)} {selectedPair.quoteAsset}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className={`w-full py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  isBuy
                    ? 'bg-[#10E896] text-[#0A0D14] hover:bg-[#34f3a7] shadow-[0_0_16px_rgba(16,232,150,0.35)]'
                    : 'bg-[#FF453A] text-white hover:bg-[#ff6157] shadow-[0_0_16px_rgba(255,69,58,0.35)]'
                }`}
              >
                {isBuy ? 'EXECUTE BUY ORDER' : 'EXECUTE SELL ORDER'}
              </button>
            </form>
          </div>

          {/* Real-time Order Book & Trades */}
          <div className="bg-[#101522] rounded-lg border border-[rgba(255,255,255,0.08)] p-4 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-xs uppercase tracking-wider text-[#849495] font-semibold">
                L2 ORDER BOOK
              </span>
              <span className="text-[10px] text-[#849495]">
                SPREAD: <strong className="text-white">${selectedPair.spread}</strong>
              </span>
            </div>

            {/* Header */}
            <div className="grid grid-cols-3 text-[10px] text-[#849495] font-semibold uppercase">
              <span>PRICE</span>
              <span className="text-right">SIZE</span>
              <span className="text-right">TOTAL</span>
            </div>

            {/* Asks (Red) */}
            <div className="space-y-1">
              {orderBook.asks.map((ask, idx) => (
                <div key={idx} className="relative grid grid-cols-3 text-[11px] py-0.5">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-[#FF453A]/10 pointer-events-none"
                    style={{ width: `${ask.depthPct}%` }}
                  />
                  <span className="text-[#FF453A] tabular-nums font-semibold">${ask.price.toFixed(2)}</span>
                  <span className="text-right text-[#b9cacb] tabular-nums">{ask.amount.toFixed(1)}</span>
                  <span className="text-right text-[#849495] tabular-nums">${ask.total.toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Mid Market Indicator */}
            <div className="py-1.5 px-2 rounded bg-[#0A0D14] border border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-bold">
              <span className="text-[#00F0FF]">${livePrice.toFixed(2)}</span>
              <span className="text-[10px] text-[#10E896] font-normal">MID SPREAD (0.01%)</span>
            </div>

            {/* Bids (Green) */}
            <div className="space-y-1">
              {orderBook.bids.map((bid, idx) => (
                <div key={idx} className="relative grid grid-cols-3 text-[11px] py-0.5">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-[#10E896]/10 pointer-events-none"
                    style={{ width: `${bid.depthPct}%` }}
                  />
                  <span className="text-[#10E896] tabular-nums font-semibold">${bid.price.toFixed(2)}</span>
                  <span className="text-right text-[#b9cacb] tabular-nums">{bid.amount.toFixed(1)}</span>
                  <span className="text-right text-[#849495] tabular-nums">${bid.total.toFixed(0)}</span>
                </div>
              ))}
            </div>

            {/* Recent Executed Trades Stream */}
            <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] space-y-1">
              <div className="text-[10px] text-[#849495] font-semibold uppercase mb-1">
                LIVE EXECUTION LOG:
              </div>
              {trades.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between text-[10px] py-0.5 text-[#b9cacb]">
                  <span className={tx.type === 'buy' ? 'text-[#10E896]' : 'text-[#FF453A]'}>
                    {tx.type.toUpperCase()}
                  </span>
                  <span className="tabular-nums">${tx.price.toFixed(2)}</span>
                  <span className="tabular-nums">{tx.amount} {selectedPair.baseAsset}</span>
                  <span className="text-[#849495] tabular-nums">{tx.latencyMs}ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
