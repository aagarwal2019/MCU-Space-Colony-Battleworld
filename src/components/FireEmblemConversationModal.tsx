import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Sparkles, 
  X, 
  ChevronRight, 
  FastForward, 
  Volume2, 
  ShieldAlert, 
  Award, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { MCUHero } from '../types';
import { HeroPairSupportData, SupportRank, SupportDialogueLine } from '../data/fireEmblemSupports';
import { soundFx } from '../utils/audio';
import { HeroAvatar } from './HeroAvatar';

interface FireEmblemConversationModalProps {
  isOpen: boolean;
  pairData: HeroPairSupportData | null;
  targetRank: 'C' | 'B' | 'A' | 'S' | null;
  hero1: MCUHero | null;
  hero2: MCUHero | null;
  onClose: () => void;
  onCompleteConversation: (pairId: string, rank: SupportRank) => void;
}

export const FireEmblemConversationModal: React.FC<FireEmblemConversationModalProps> = ({
  isOpen,
  pairData,
  targetRank,
  hero1,
  hero2,
  onClose,
  onCompleteConversation,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showRankUpBanner, setShowRankUpBanner] = useState<boolean>(false);

  const tier = (pairData && targetRank) ? pairData.tiers[targetRank] : null;
  const dialogueLines: SupportDialogueLine[] = tier ? tier.dialogue : [];

  useEffect(() => {
    if (isOpen) {
      setCurrentLineIndex(0);
      setIsCompleted(false);
      setShowRankUpBanner(false);
      soundFx.playSupportHeart();
    }
  }, [isOpen, pairData?.pairId, targetRank]);

  if (!isOpen || !pairData || !targetRank || !tier || !hero1 || !hero2) {
    return null;
  }

  const currentLine = dialogueLines[currentLineIndex];
  const isSpeakingHero1 = currentLine ? currentLine.speakerId === hero1.id : false;

  const handleNextLine = () => {
    soundFx.playDialogueAdvance();
    if (currentLineIndex < dialogueLines.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    } else {
      // Conversation complete!
      setIsCompleted(true);
      setShowRankUpBanner(true);
      if (targetRank === 'S') {
        soundFx.playSupportFanfare();
      } else {
        soundFx.playSupportLevelUp();
      }
    }
  };

  const handleSkip = () => {
    soundFx.buttonClick();
    setCurrentLineIndex(dialogueLines.length - 1);
    setIsCompleted(true);
    setShowRankUpBanner(true);
    if (targetRank === 'S') {
      soundFx.playSupportFanfare();
    } else {
      soundFx.playSupportLevelUp();
    }
  };

  const handleFinishRankUp = () => {
    soundFx.playSuccess();
    onCompleteConversation(pairData.pairId, targetRank);
    onClose();
  };

  const getRankBadgeStyle = (rank: 'C' | 'B' | 'A' | 'S') => {
    switch (rank) {
      case 'C':
        return 'bg-amber-800 text-amber-200 border-amber-600';
      case 'B':
        return 'bg-slate-700 text-cyan-200 border-cyan-400';
      case 'A':
        return 'bg-yellow-600 text-yellow-100 border-yellow-300';
      case 'S':
        return 'bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 text-white border-pink-300 animate-pulse';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      {/* Visual Novel Theater Frame */}
      <div className="relative w-full max-w-4xl bg-slate-950 border-2 border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[580px] sm:min-h-[640px]">
        
        {/* Fire Emblem Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400 fill-pink-500 animate-pulse" />
            <span className="font-mono-tech uppercase tracking-widest text-xs sm:text-sm font-bold text-amber-300">
              Fire Emblem Support Conversation
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-black border font-mono ${getRankBadgeStyle(targetRank)}`}>
              RANK {targetRank}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!showRankUpBanner && (
              <button
                onClick={handleSkip}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1 border border-slate-700"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>SKIP</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Area: Character Sprites / Visual Showcase */}
        <div className="relative flex-1 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 p-4 sm:p-8 flex items-center justify-between overflow-hidden">
          
          {/* Subtle Ambient Multiversal Dust / Fire Emblem Particles */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent" />

          {/* Left Hero (Hero 1) */}
          <div className={`relative flex flex-col items-center transition-all duration-300 ${isSpeakingHero1 ? 'scale-105 z-10' : 'opacity-65 scale-95 z-0'}`}>
            <div className="relative">
              {hero1 && (
                <HeroAvatar 
                  hero={hero1} 
                  size="stage" 
                  border={`border-4 ${isSpeakingHero1 ? 'border-amber-400 shadow-2xl shadow-amber-500/50 ring-4 ring-amber-500/30' : 'border-slate-700 opacity-90'}`}
                />
              )}

              {/* Active Speaking Indicator */}
              {isSpeakingHero1 && (
                <div className="absolute -bottom-2 inset-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-center font-mono font-black text-[11px] py-0.5 rounded-full tracking-widest uppercase shadow-lg shadow-amber-500/30">
                  Speaking
                </div>
              )}
            </div>

            <div className="mt-3 text-center">
              <h3 className="text-sm sm:text-base font-bold text-white font-display">{hero1?.heroName}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{hero1?.name}</p>
            </div>
          </div>

          {/* Center Bond / Fire Emblem Crest Emblem */}
          <div className="flex flex-col items-center justify-center px-2 sm:px-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-900 border-2 border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-500/20 relative">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 fill-pink-500/80 animate-pulse" />
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-spin" />
            </div>
            <div className="mt-2 text-center">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                {pairData.title}
              </span>
              <p className="text-[9px] text-slate-400 max-w-[140px] truncate hidden sm:block">
                {tier.title}
              </p>
            </div>
          </div>

          {/* Right Hero (Hero 2) */}
          <div className={`relative flex flex-col items-center transition-all duration-300 ${!isSpeakingHero1 ? 'scale-105 z-10' : 'opacity-65 scale-95 z-0'}`}>
            <div className="relative">
              {hero2 && (
                <HeroAvatar 
                  hero={hero2} 
                  size="stage" 
                  border={`border-4 ${!isSpeakingHero1 ? 'border-cyan-400 shadow-2xl shadow-cyan-500/50 ring-4 ring-cyan-500/30' : 'border-slate-700 opacity-90'}`}
                />
              )}

              {/* Active Speaking Indicator */}
              {!isSpeakingHero1 && (
                <div className="absolute -bottom-2 inset-x-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 text-center font-mono font-black text-[11px] py-0.5 rounded-full tracking-widest uppercase shadow-lg shadow-cyan-500/30">
                  Speaking
                </div>
              )}
            </div>

            <div className="mt-3 text-center">
              <h3 className="text-sm sm:text-base font-bold text-white font-display">{hero2?.heroName}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{hero2?.name}</p>
            </div>
          </div>
        </div>

        {/* Lower Dialogue Box (Classic Fire Emblem Dialogue Scroll Frame) */}
        {!showRankUpBanner ? (
          <div 
            onClick={handleNextLine}
            className="cursor-pointer border-t-2 border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-4 sm:p-6 min-h-[160px] relative flex flex-col justify-between hover:bg-slate-900/90 transition select-none"
          >
            <div>
              {/* Speaker Name Banner */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold font-mono tracking-wider text-slate-950 ${isSpeakingHero1 ? 'bg-amber-400' : 'bg-cyan-400'}`}>
                  {currentLine?.speakerName}
                </span>
                {currentLine?.emotion && (
                  <span className="text-[10px] font-mono uppercase text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {currentLine.emotion}
                  </span>
                )}
              </div>

              {/* Dialogue Text */}
              <p className="text-sm sm:text-lg text-slate-100 font-sans leading-relaxed tracking-wide min-h-[50px]">
                "{currentLine?.text}"
              </p>
            </div>

            {/* Tap to Advance Prompt */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400 font-mono">
              <span>{currentLineIndex + 1} / {dialogueLines.length}</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
                <span>CLICK OR TAP TO ADVANCE</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ) : (
          /* Fire Emblem Support Level Up Celebration Banner */
          <div className="border-t-2 border-amber-500/40 bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950 p-6 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-pink-400">
              <Heart className="w-6 h-6 fill-pink-500 animate-bounce" />
              <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
              <Heart className="w-6 h-6 fill-pink-500 animate-bounce" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider font-display uppercase">
                Support Rank Increased to {targetRank}!
              </h2>
              <p className="text-sm font-mono text-slate-300 mt-1">
                {hero1.heroName} & {hero2.heroName} forged Rank {targetRank}: "{tier.title}"
              </p>
            </div>

            {/* Unlocked Perk Card */}
            <div className="w-full max-w-lg bg-slate-900/90 border border-amber-500/40 rounded-xl p-3.5 shadow-xl text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono mb-1">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Unlocked Support Synergy Perk</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200">
                {tier.unlockedPerkDescription}
              </p>
              {targetRank === 'S' && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-pink-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>SOULBOUND ALLIANCE ACTIVE: Permanent Multiverse Duo bonuses conferred to colony!</span>
                </div>
              )}
            </div>

            <button
              onClick={handleFinishRankUp}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black font-mono-tech text-sm shadow-xl shadow-amber-500/25 transition cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>SEAL SUPPORT BOND (RANK {targetRank})</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
