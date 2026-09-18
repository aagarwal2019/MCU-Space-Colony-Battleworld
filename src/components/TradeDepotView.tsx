import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Coins, 
  Wrench, 
  Sprout, 
  Zap, 
  Users, 
  Package, 
  ShieldAlert, 
  ShoppingBag, 
  TrendingUp,
  Smile,
  Clock,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { ColonyResources } from '../types';

interface TradeDepotViewProps {
  resources: ColonyResources;
  onExecuteTrade: (tradeType: string) => void;
  onOpenMarketApi?: () => void;
}

export const TradeDepotView: React.FC<TradeDepotViewProps> = ({
  resources,
  onExecuteTrade,
  onOpenMarketApi,
}) => {
  return (
    <div className="w-full bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold tracking-wider text-slate-100 font-display">
              RAVAGER SMUGGLER BARTER POST
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            Exchange excess scrap, purchase critical hydro-rations, recruit stranded wanderers, and acquire exotic black-market supplies.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onOpenMarketApi && (
            <button
              onClick={onOpenMarketApi}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-bold font-mono-tech text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>LIVE BLACK MARKET (`/api/market`)</span>
            </button>
          )}
          <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono-tech">
            <span className="text-slate-400">TREASURY:</span>
            <span className="text-purple-400 font-bold flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> {Math.round(resources.vibraniumCredits)}
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" /> {Math.round(resources.scrap)}
            </span>
          </div>
        </div>
      </div>

      {/* Trade Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Trade: Sell Scrap for Credits */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 font-mono-tech uppercase">COMMODITY EXPORT</span>
              <Coins className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-display mt-1">
              Liquidate Nanite Scrap
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sell refined starship metal to passing junk haulers for cold galactic currency.
            </p>
            <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono-tech flex justify-between items-center">
              <span className="text-amber-400 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> 100 Scrap
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> +25 Units
              </span>
            </div>
          </div>
          <button
            disabled={resources.scrap < 100}
            onClick={() => onExecuteTrade('sell_scrap')}
            className={`mt-4 w-full py-2 rounded-lg font-bold font-mono-tech text-xs transition ${
              resources.scrap >= 100
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {resources.scrap >= 100 ? 'BARTER SCRAP' : 'NEED 100 SCRAP'}
          </button>
        </div>

        {/* Trade: Purchase Rations */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 font-mono-tech uppercase">EMERGENCY RELIEF</span>
              <Sprout className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-display mt-1">
              Import Hydro-Ration Crates
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Purchase nutrient rations from interstellar smugglers to prevent famine during bad harvests.
            </p>
            <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono-tech flex justify-between items-center">
              <span className="text-purple-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> 20 Units
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5" /> +80 Rations
              </span>
            </div>
          </div>
          <button
            disabled={resources.vibraniumCredits < 20}
            onClick={() => onExecuteTrade('buy_food')}
            className={`mt-4 w-full py-2 rounded-lg font-bold font-mono-tech text-xs transition ${
              resources.vibraniumCredits >= 20
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {resources.vibraniumCredits >= 20 ? 'BUY RATIONS' : 'NEED 20 UNITS'}
          </button>
        </div>

        {/* Trade: Recruit Refugee Laborers */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-blue-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 font-mono-tech uppercase">POPULATION EXPANSION</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-display mt-1">
              Ransom Stranded Scavengers
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Buy the freedom of enslaved technicians and engineers from Sakaaran gladiator guilds.
            </p>
            <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono-tech flex justify-between items-center">
              <span className="text-purple-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> 35 Units
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-blue-400 font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> +3 Colonists
              </span>
            </div>
          </div>
          <button
            disabled={resources.vibraniumCredits < 35 || resources.population + 3 > resources.maxPopulation}
            onClick={() => onExecuteTrade('recruit_scavengers')}
            className={`mt-4 w-full py-2 rounded-lg font-bold font-mono-tech text-xs transition ${
              resources.population + 3 > resources.maxPopulation
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : resources.vibraniumCredits >= 35
                  ? 'bg-blue-500 hover:bg-blue-400 text-slate-950'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {resources.population + 3 > resources.maxPopulation 
              ? 'HOUSING FULL' 
              : resources.vibraniumCredits >= 35 
                ? 'RECRUIT CITIZENS' 
                : 'NEED 35 UNITS'}
          </button>
        </div>

        {/* Trade: Black Market Power Battery */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-yellow-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 font-mono-tech uppercase">POWER RELIEF</span>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-display mt-1">
              Smuggled Sovereign Battery
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Stolen Anulax Batteries that instantly inject massive reserve power into the colony grid.
            </p>
            <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono-tech flex justify-between items-center">
              <span className="text-amber-400 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> 80 Scrap + 15 Cr
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-yellow-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> +250 Power
              </span>
            </div>
          </div>
          <button
            disabled={resources.scrap < 80 || resources.vibraniumCredits < 15}
            onClick={() => onExecuteTrade('buy_power')}
            className={`mt-4 w-full py-2 rounded-lg font-bold font-mono-tech text-xs transition ${
              resources.scrap >= 80 && resources.vibraniumCredits >= 15
                ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {resources.scrap >= 80 && resources.vibraniumCredits >= 15 ? 'CHARGE BATTERY' : 'INSUFFICIENT FUNDS'}
          </button>
        </div>

        {/* Trade: Sakaaran Holo-Concert */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-pink-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 font-mono-tech uppercase">MORALE CELEBRATION</span>
              <Smile className="w-4 h-4 text-pink-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-display mt-1">
              Host Cosmic Rave Festival
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Quill plays classic Earth hits on high blast, throwing an unforgettable festival that skyrockets colonist morale.
            </p>
            <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono-tech flex justify-between items-center">
              <span className="text-purple-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> 25 Units
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-pink-400 font-bold flex items-center gap-1">
                <Smile className="w-3.5 h-3.5" /> +30 Morale
              </span>
            </div>
          </div>
          <button
            disabled={resources.vibraniumCredits < 25}
            onClick={() => onExecuteTrade('host_festival')}
            className={`mt-4 w-full py-2 rounded-lg font-bold font-mono-tech text-xs transition ${
              resources.vibraniumCredits >= 25
                ? 'bg-pink-500 hover:bg-pink-400 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {resources.vibraniumCredits >= 25 ? 'THROW FESTIVAL' : 'NEED 25 UNITS'}
          </button>
        </div>

        {/* Trade: TVA Infinity Stone Paperweights */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-mono-tech uppercase">TVA CONTRABAND</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-display mt-1">
              TVA "Paperweight" Stones
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Acquire confiscated Infinity Stones deemed powerless bureaucratic desk weights by the TVA to harness pure raw power.
            </p>
            <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono-tech flex justify-between items-center">
              <span className="text-amber-400 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> 80 Scrap + 15 Cr
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-yellow-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> +350 Power
              </span>
            </div>
          </div>
          <button
            disabled={resources.scrap < 80 || resources.vibraniumCredits < 15}
            onClick={() => onExecuteTrade('trade_tva_paperweight')}
            className={`mt-4 w-full py-2 rounded-lg font-bold font-mono-tech text-xs transition ${
              resources.scrap >= 80 && resources.vibraniumCredits >= 15
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {resources.scrap >= 80 && resources.vibraniumCredits >= 15 ? 'CHANNEL STONES' : 'NEED 80 SCRAP + 15 CR'}
          </button>
        </div>

        {/* Trade: OXE Conglomerate Futures Arbitrage */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-emerald-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono-tech uppercase">OXE CONGLOMERATE</span>
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-display mt-1">
              OXE Futures Bond Arbitrage
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Invest credit capital into OXE deep-space hedge contracts, delivering high-density refined titanium alloy consignments.
            </p>
            <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono-tech flex justify-between items-center">
              <span className="text-purple-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> 40 Units
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> +250 Scrap
              </span>
            </div>
          </div>
          <button
            disabled={resources.vibraniumCredits < 40}
            onClick={() => onExecuteTrade('trade_oxe_futures')}
            className={`mt-4 w-full py-2 rounded-lg font-bold font-mono-tech text-xs transition ${
              resources.vibraniumCredits >= 40
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {resources.vibraniumCredits >= 40 ? 'ARBITRAGE FUTURES' : 'NEED 40 UNITS'}
          </button>
        </div>

        {/* Trade: Damage Control Ordnance Requisition */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between hover:border-yellow-500/40 transition">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-yellow-400 font-mono-tech uppercase">DAMAGE CONTROL</span>
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100 font-display mt-1">
              DODC Ordnance Requisition
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Purchase declassified alien weapon hulls from the Department of Damage Control to fortify colony bastions.
            </p>
            <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono-tech flex justify-between items-center">
              <span className="text-amber-400 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" /> 60 Scrap + 20 Cr
              </span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> +30 Defense
              </span>
            </div>
          </div>
          <button
            disabled={resources.scrap < 60 || resources.vibraniumCredits < 20}
            onClick={() => onExecuteTrade('trade_dodc_salvage')}
            className={`mt-4 w-full py-2 rounded-lg font-bold font-mono-tech text-xs transition ${
              resources.scrap >= 60 && resources.vibraniumCredits >= 20
                ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {resources.scrap >= 60 && resources.vibraniumCredits >= 20 ? 'REQUISITION ORDNANCE' : 'NEED 60 SCRAP + 20 CR'}
          </button>
        </div>
      </div>
    </div>
  );
};
