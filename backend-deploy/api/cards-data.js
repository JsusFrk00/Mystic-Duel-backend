// Card data for backend API - v3.0 Complete Collection
// Auto-synced from frontend /js/data/cards.js
// 418 standard cards + 10 Full Art variants = 428 total
// Last synced: 2026-02-20T19:49:05.074Z

const ALL_CARDS = [
    // ==================== LEGACY COLORLESS CARDS (150) ====================
    // These are the original cards, now marked as colorless for backwards compatibility
    
    // Common Cards (60 total)
    { name: "Goblin Scout", cost: 1, type: "creature", attack: 2, health: 1, ability: "Quick", emoji: "👺", rarity: "common", color: "colorless" },
    { name: "Fire Sprite", cost: 1, type: "creature", attack: 1, health: 2, ability: "Burn", emoji: "🔥", rarity: "common", color: "colorless" },
    { name: "Shield Bearer", cost: 2, type: "creature", attack: 1, health: 4, ability: "Taunt", emoji: "🛡️", rarity: "common", color: "colorless" },
    { name: "Forest Wolf", cost: 2, type: "creature", attack: 3, health: 2, ability: "Rush", emoji: "🐺", rarity: "common", color: "colorless" },
    { name: "Apprentice Mage", cost: 2, type: "creature", attack: 2, health: 2, ability: "Spell Power +1", emoji: "🧙", rarity: "common", color: "colorless" },
    { name: "Skeleton Warrior", cost: 1, type: "creature", attack: 1, health: 1, ability: "Deathrattle: Draw", emoji: "💀", rarity: "common", color: "colorless" },
    { name: "Arcane Missile", cost: 1, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage", emoji: "✨", rarity: "common", color: "colorless" },
    { name: "Healing Touch", cost: 1, type: "spell", attack: 0, health: 0, ability: "Restore 3 health", emoji: "💚", rarity: "common", color: "colorless" },
    { name: "Frost Bolt", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage, Freeze", emoji: "❄️", rarity: "common", color: "colorless" },
    { name: "Battle Cry", cost: 2, type: "spell", attack: 0, health: 0, ability: "All allies +1/+1", emoji: "📯", rarity: "common", color: "colorless" },
    { name: "Peasant", cost: 1, type: "creature", attack: 1, health: 1, ability: "", emoji: "👨‍🌾", rarity: "common", color: "colorless" },
    { name: "Squire", cost: 1, type: "creature", attack: 2, health: 1, ability: "", emoji: "⚔️", rarity: "common", color: "colorless" },
    { name: "Guard Dog", cost: 2, type: "creature", attack: 2, health: 3, ability: "Taunt", emoji: "🐕", rarity: "common", color: "colorless" },
    { name: "Archer", cost: 2, type: "creature", attack: 2, health: 2, ability: "Reach", emoji: "🏹", rarity: "common", color: "colorless" },
    { name: "Militia", cost: 3, type: "creature", attack: 3, health: 3, ability: "", emoji: "🗡️", rarity: "common", color: "colorless" },
    { name: "Scout", cost: 2, type: "creature", attack: 2, health: 1, ability: "Quick", emoji: "🏃", rarity: "common", color: "colorless" },
    { name: "Torch Bearer", cost: 1, type: "creature", attack: 1, health: 2, ability: "Burn", emoji: "🔦", rarity: "common", color: "colorless" },
    { name: "Medic", cost: 3, type: "creature", attack: 2, health: 3, ability: "Lifelink", emoji: "⚕️", rarity: "common", color: "colorless" },
    { name: "Footman", cost: 2, type: "creature", attack: 2, health: 2, ability: "Vigilance", emoji: "👮", rarity: "common", color: "colorless" },
    { name: "Pikeman", cost: 3, type: "creature", attack: 3, health: 2, ability: "First Strike", emoji: "🎯", rarity: "common", color: "colorless" },
    { name: "Minor Blessing", cost: 1, type: "spell", attack: 0, health: 0, ability: "Restore 3 health", emoji: "✝️", rarity: "common", color: "colorless" },
    { name: "Quick Shot", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage", emoji: "➡️", rarity: "common", color: "colorless" },
    { name: "Shield Bash", cost: 1, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage", emoji: "🛡️", rarity: "common", color: "colorless" },
    { name: "Rally", cost: 3, type: "spell", attack: 0, health: 0, ability: "All allies +1/+1", emoji: "🚩", rarity: "common", color: "colorless" },
    { name: "Heal", cost: 2, type: "spell", attack: 0, health: 0, ability: "Restore 5 health", emoji: "❤️", rarity: "common", color: "colorless" },
    { name: "Burn", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 4 damage", emoji: "🔥", rarity: "common", color: "colorless" },
    { name: "Freeze", cost: 1, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage, Freeze", emoji: "🧊", rarity: "common", color: "colorless" },
    { name: "Draw", cost: 2, type: "spell", attack: 0, health: 0, ability: "Draw 2 cards", emoji: "📜", rarity: "common", color: "colorless" },
    { name: "Blessing", cost: 2, type: "spell", attack: 0, health: 0, ability: "All allies +1/+1", emoji: "🌟", rarity: "common", color: "colorless" },
    { name: "Strike", cost: 1, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage", emoji: "⚡", rarity: "common", color: "colorless" },
    { name: "Bear", cost: 3, type: "creature", attack: 3, health: 3, ability: "", emoji: "🐻", rarity: "common", color: "colorless" },
    { name: "Spider", cost: 1, type: "creature", attack: 1, health: 2, ability: "", emoji: "🕷️", rarity: "common", color: "colorless" },
    { name: "Rat", cost: 1, type: "creature", attack: 2, health: 1, ability: "Deathrattle: If you control no other creatures, enemy discards a card", emoji: "🐀", rarity: "common", color: "colorless" },
    { name: "Snake", cost: 2, type: "creature", attack: 3, health: 1, ability: "", emoji: "🐍", rarity: "common", color: "colorless" },
    { name: "Boar", cost: 2, type: "creature", attack: 2, health: 2, ability: "", emoji: "🐗", rarity: "common", color: "colorless" },
    { name: "Crow", cost: 1, type: "creature", attack: 1, health: 1, ability: "Flying", emoji: "🦅", rarity: "common", color: "colorless" },
    { name: "Fish", cost: 1, type: "creature", attack: 1, health: 2, ability: "Cannot be blocked", emoji: "🐟", rarity: "common", color: "colorless" },
    { name: "Frog", cost: 1, type: "creature", attack: 1, health: 1, ability: "", emoji: "🐸", rarity: "common", color: "colorless" },
    { name: "Bat", cost: 2, type: "creature", attack: 2, health: 1, ability: "Flying", emoji: "🦇", rarity: "common", color: "colorless" },
    { name: "Rabbit", cost: 1, type: "creature", attack: 1, health: 1, ability: "Quick", emoji: "🐰", rarity: "common", color: "colorless" },
    { name: "Farmer", cost: 2, type: "creature", attack: 1, health: 3, ability: "", emoji: "👨‍🌾", rarity: "common", color: "colorless" },
    { name: "Merchant", cost: 3, type: "creature", attack: 2, health: 4, ability: "", emoji: "💰", rarity: "common", color: "colorless" },
    { name: "Blacksmith", cost: 3, type: "creature", attack: 3, health: 2, ability: "", emoji: "🔨", rarity: "common", color: "colorless" },
    { name: "Innkeeper", cost: 2, type: "creature", attack: 1, health: 4, ability: "Taunt", emoji: "🏠", rarity: "common", color: "colorless" },
    { name: "Thief", cost: 2, type: "creature", attack: 3, health: 1, ability: "Stealth", emoji: "🦹", rarity: "common", color: "colorless" },
    { name: "Bard", cost: 3, type: "creature", attack: 2, health: 3, ability: "Draw a card", emoji: "🎵", rarity: "common", color: "colorless" },
    { name: "Hunter", cost: 3, type: "creature", attack: 3, health: 2, ability: "Reach", emoji: "🏹", rarity: "common", color: "colorless" },
    { name: "Sailor", cost: 2, type: "creature", attack: 2, health: 2, ability: "", emoji: "⚓", rarity: "common", color: "colorless" },
    { name: "Monk", cost: 2, type: "creature", attack: 1, health: 3, ability: "Lifelink", emoji: "🧘", rarity: "common", color: "colorless" },
    { name: "Ranger", cost: 3, type: "creature", attack: 2, health: 3, ability: "Vigilance", emoji: "🏞️", rarity: "common", color: "colorless" },
    { name: "Empower", cost: 1, type: "spell", attack: 0, health: 0, ability: "All allies +1/+1", emoji: "💪", rarity: "common", color: "colorless" },
    { name: "Weaken", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage", emoji: "💔", rarity: "common", color: "colorless" },
    { name: "Fortify", cost: 2, type: "spell", attack: 0, health: 0, ability: "All allies +1/+1", emoji: "🏰", rarity: "common", color: "colorless" },
    { name: "Curse", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage", emoji: "👻", rarity: "common", color: "colorless" },
    { name: "Inspire", cost: 2, type: "spell", attack: 0, health: 0, ability: "Draw a card", emoji: "🌈", rarity: "common", color: "colorless" },
    { name: "Zap", cost: 1, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage", emoji: "⚡", rarity: "common", color: "colorless" },
    { name: "Refresh", cost: 1, type: "spell", attack: 0, health: 0, ability: "Restore 3 health", emoji: "🔄", rarity: "common", color: "colorless" },
    { name: "Energize", cost: 2, type: "spell", attack: 0, health: 0, ability: "Draw 2 cards", emoji: "⚡", rarity: "common", color: "colorless" },
    { name: "Smite", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage", emoji: "✨", rarity: "common", color: "colorless" },
    { name: "Mend", cost: 2, type: "spell", attack: 0, health: 0, ability: "Restore 5 health", emoji: "🩹", rarity: "common", color: "colorless" },
    
    // Rare Cards (50 total)
    { name: "Mystic Owl", cost: 3, type: "creature", attack: 2, health: 3, ability: "Draw a card", emoji: "🦉", rarity: "rare", color: "colorless" },
    { name: "Shadow Assassin", cost: 3, type: "creature", attack: 4, health: 2, ability: "Stealth", emoji: "🥷", rarity: "rare", color: "colorless" },
    { name: "Wind Dancer", cost: 3, type: "creature", attack: 3, health: 3, ability: "Flying", emoji: "🌪️", rarity: "rare", color: "colorless" },
    { name: "Stone Golem", cost: 4, type: "creature", attack: 3, health: 6, ability: "Taunt", emoji: "🗿", rarity: "rare", color: "colorless" },
    { name: "Ice Elemental", cost: 4, type: "creature", attack: 3, health: 5, ability: "Freeze enemy", emoji: "❄️", rarity: "rare", color: "colorless" },
    { name: "Lightning Bolt", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 4 damage", emoji: "⚡", rarity: "rare", color: "colorless" },
    { name: "Healing Potion", cost: 2, type: "spell", attack: 0, health: 0, ability: "Restore 5 health", emoji: "🧪", rarity: "rare", color: "colorless" },
    { name: "Mind Control", cost: 5, type: "spell", attack: 0, health: 0, ability: "Steal creature", emoji: "🧠", rarity: "rare", color: "colorless" },
    { name: "Phoenix", cost: 4, type: "creature", attack: 4, health: 3, ability: "Resurrect", emoji: "🦅", rarity: "rare", color: "colorless" },
    { name: "Crystal Guardian", cost: 5, type: "creature", attack: 4, health: 5, ability: "Spell Shield", emoji: "💎", rarity: "rare", color: "colorless" },
    { name: "Knight", cost: 4, type: "creature", attack: 4, health: 4, ability: "Vigilance", emoji: "♞", rarity: "rare", color: "colorless" },
    { name: "Priest", cost: 3, type: "creature", attack: 2, health: 4, ability: "Lifelink", emoji: "⛪", rarity: "rare", color: "colorless" },
    { name: "Wizard", cost: 4, type: "creature", attack: 3, health: 3, ability: "Spell Power +1", emoji: "🧙‍♂️", rarity: "rare", color: "colorless" },
    { name: "Berserker", cost: 4, type: "creature", attack: 5, health: 3, ability: "Enrage", emoji: "😤", rarity: "rare", color: "colorless" },
    { name: "Paladin", cost: 5, type: "creature", attack: 4, health: 5, ability: "Divine Shield", emoji: "🛡️", rarity: "rare", color: "colorless" },
    { name: "Rogue", cost: 3, type: "creature", attack: 4, health: 2, ability: "Poison", emoji: "🗡️", rarity: "rare", color: "colorless" },
    { name: "Shaman", cost: 4, type: "creature", attack: 3, health: 4, ability: "Windfury", emoji: "🌊", rarity: "rare", color: "colorless" },
    { name: "Druid", cost: 4, type: "creature", attack: 3, health: 5, ability: "Regenerate", emoji: "🌳", rarity: "rare", color: "colorless" },
    { name: "Warlock", cost: 4, type: "creature", attack: 4, health: 3, ability: "Lifesteal", emoji: "👹", rarity: "rare", color: "colorless" },
    { name: "Ranger Lord", cost: 5, type: "creature", attack: 4, health: 4, ability: "Reach", emoji: "🏹", rarity: "rare", color: "colorless" },
    { name: "Fireball", cost: 4, type: "spell", attack: 0, health: 0, ability: "Deal 5 damage", emoji: "🔥", rarity: "rare", color: "colorless" },
    { name: "Blizzard", cost: 5, type: "spell", attack: 0, health: 0, ability: "AOE damage", emoji: "🌨️", rarity: "rare", color: "colorless" },
    { name: "Holy Light", cost: 3, type: "spell", attack: 0, health: 0, ability: "Restore 8 health", emoji: "✨", rarity: "rare", color: "colorless" },
    { name: "Shadow Strike", cost: 4, type: "spell", attack: 0, health: 0, ability: "Deal 5 damage", emoji: "👤", rarity: "rare", color: "colorless" },
    { name: "Nature's Blessing", cost: 4, type: "spell", attack: 0, health: 0, ability: "All allies +2/+2", emoji: "🌿", rarity: "rare", color: "colorless" },
    { name: "Old Arcane Intellect", cost: 3, type: "spell", attack: 0, health: 0, ability: "Draw 2 cards", emoji: "🧠", rarity: "rare", color: "colorless" },
    { name: "Polymorph", cost: 4, type: "spell", attack: 0, health: 0, ability: "Silence", emoji: "🐏", rarity: "rare", color: "colorless" },
    { name: "Execute", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 4 damage", emoji: "⚔️", rarity: "rare", color: "colorless" },
    { name: "Consecration", cost: 4, type: "spell", attack: 0, health: 0, ability: "AOE damage", emoji: "⭐", rarity: "rare", color: "colorless" },
    { name: "Siphon Soul", cost: 5, type: "spell", attack: 0, health: 0, ability: "Deal 4 damage", emoji: "👻", rarity: "rare", color: "colorless" },
    { name: "Griffin", cost: 4, type: "creature", attack: 4, health: 4, ability: "Flying", emoji: "🦅", rarity: "rare", color: "colorless" },
    { name: "Ogre", cost: 5, type: "creature", attack: 5, health: 5, ability: "", emoji: "👹", rarity: "rare", color: "colorless" },
    { name: "Troll", cost: 4, type: "creature", attack: 3, health: 5, ability: "Regenerate", emoji: "🧌", rarity: "rare", color: "colorless" },
    { name: "Centaur", cost: 4, type: "creature", attack: 4, health: 3, ability: "Charge", emoji: "🐴", rarity: "rare", color: "colorless" },
    { name: "Minotaur", cost: 5, type: "creature", attack: 5, health: 4, ability: "Trample", emoji: "🐂", rarity: "rare", color: "colorless" },
    { name: "Harpy", cost: 3, type: "creature", attack: 3, health: 2, ability: "Flying", emoji: "🦅", rarity: "rare", color: "colorless" },
    { name: "Basilisk", cost: 4, type: "creature", attack: 2, health: 4, ability: "Deathtouch", emoji: "🐍", rarity: "rare", color: "colorless" },
    { name: "Hydra", cost: 5, type: "creature", attack: 4, health: 5, ability: "Double Strike", emoji: "🐉", rarity: "rare", color: "colorless" },
    { name: "Sphinx", cost: 5, type: "creature", attack: 4, health: 4, ability: "Flying", emoji: "🦁", rarity: "rare", color: "colorless" },
    { name: "Manticore", cost: 5, type: "creature", attack: 5, health: 3, ability: "First Strike", emoji: "🦂", rarity: "rare", color: "colorless" },
    { name: "Champion", cost: 5, type: "creature", attack: 5, health: 4, ability: "Vigilance", emoji: "🏆", rarity: "rare", color: "colorless" },
    { name: "Sorcerer", cost: 4, type: "creature", attack: 3, health: 3, ability: "Draw a card", emoji: "🔮", rarity: "rare", color: "colorless" },
    { name: "Templar", cost: 5, type: "creature", attack: 4, health: 5, ability: "Divine Shield", emoji: "✝️", rarity: "rare", color: "colorless" },
    { name: "Assassin", cost: 3, type: "creature", attack: 4, health: 1, ability: "Stealth", emoji: "🗡️", rarity: "rare", color: "colorless" },
    { name: "Elementalist", cost: 4, type: "creature", attack: 3, health: 4, ability: "Spell Power +1", emoji: "🌟", rarity: "rare", color: "colorless" },
    { name: "Barbarian", cost: 4, type: "creature", attack: 5, health: 3, ability: "Charge", emoji: "🪓", rarity: "rare", color: "colorless" },
    { name: "Cleric", cost: 3, type: "creature", attack: 2, health: 4, ability: "Heal all allies", emoji: "✨", rarity: "rare", color: "colorless" },
    { name: "Necromancer", cost: 5, type: "creature", attack: 4, health: 4, ability: "Summon skeletons", emoji: "💀", rarity: "rare", color: "colorless" },
    { name: "Pyromancer", cost: 4, type: "creature", attack: 3, health: 3, ability: "AOE damage", emoji: "🔥", rarity: "rare", color: "colorless" },
    { name: "Frost Mage", cost: 4, type: "creature", attack: 3, health: 4, ability: "Freeze enemy", emoji: "❄️", rarity: "rare", color: "colorless" },
    
    // Epic Cards (30 total)
    { name: "Fire Drake", cost: 5, type: "creature", attack: 5, health: 4, ability: "Flying", emoji: "🐲", rarity: "epic", color: "colorless" },
    { name: "Dark Knight", cost: 5, type: "creature", attack: 6, health: 5, ability: "Lifesteal", emoji: "⚔️", rarity: "epic", color: "colorless" },
    { name: "Ancient Tree", cost: 6, type: "creature", attack: 4, health: 7, ability: "Regenerate", emoji: "🌳", rarity: "epic", color: "colorless" },
    { name: "Legacy Storm Caller", cost: 6, type: "creature", attack: 5, health: 5, ability: "AOE damage", emoji: "⛈️", rarity: "epic", color: "colorless" },
    { name: "Meteor Strike", cost: 6, type: "spell", attack: 0, health: 0, ability: "Deal 8 damage", emoji: "☄️", rarity: "epic", color: "colorless" },
    { name: "Legacy Time Warp", cost: 8, type: "spell", attack: 0, health: 0, ability: "Take an extra turn. You can't play Time Warp next turn", emoji: "⏰", rarity: "epic", color: "colorless" },
    { name: "Vampire Lord", cost: 7, type: "creature", attack: 6, health: 6, ability: "Lifesteal, Flying", emoji: "🦇", rarity: "epic", color: "colorless" },
    { name: "Arcane Giant", cost: 8, type: "creature", attack: 8, health: 8, ability: "Costs 1 less per spell cast (minimum 2)", emoji: "🗿", rarity: "epic", color: "colorless" },
    { name: "Lich", cost: 5, type: "creature", attack: 4, health: 4, ability: "Summon skeletons", emoji: "💀", rarity: "epic", color: "colorless" },
    { name: "Divine Shield", cost: 4, type: "spell", attack: 0, health: 0, ability: "All allies immune", emoji: "✨", rarity: "epic", color: "colorless" },
    { name: "War Golem", cost: 7, type: "creature", attack: 7, health: 7, ability: "", emoji: "🗿", rarity: "epic", color: "colorless" },
    { name: "Sea Giant", cost: 8, type: "creature", attack: 8, health: 8, ability: "", emoji: "🌊", rarity: "epic", color: "colorless" },
    { name: "Mountain Giant", cost: 9, type: "creature", attack: 8, health: 9, ability: "Taunt", emoji: "⛰️", rarity: "epic", color: "colorless" },
    { name: "Molten Giant", cost: 10, type: "creature", attack: 10, health: 8, ability: "", emoji: "🔥", rarity: "epic", color: "colorless" },
    { name: "Frost Giant", cost: 7, type: "creature", attack: 6, health: 8, ability: "Freeze enemy", emoji: "❄️", rarity: "epic", color: "colorless" },
    { name: "Storm Giant", cost: 8, type: "creature", attack: 7, health: 7, ability: "Windfury", emoji: "⚡", rarity: "epic", color: "colorless" },
    { name: "Earth Elemental", cost: 6, type: "creature", attack: 5, health: 7, ability: "Taunt", emoji: "🪨", rarity: "epic", color: "colorless" },
    { name: "Fire Elemental", cost: 6, type: "creature", attack: 6, health: 5, ability: "Battlecry: Damage", emoji: "🔥", rarity: "epic", color: "colorless" },
    { name: "Water Elemental", cost: 5, type: "creature", attack: 4, health: 6, ability: "Freeze enemy", emoji: "💧", rarity: "epic", color: "colorless" },
    { name: "Air Elemental", cost: 5, type: "creature", attack: 5, health: 4, ability: "Flying", emoji: "🌪️", rarity: "epic", color: "colorless" },
    { name: "Whale Shark", cost: 5, type: "creature", attack: 0, health: 10, ability: "Taunt. Splash 2. Can't attack", emoji: "🦈", rarity: "epic", color: "colorless" },
    { name: "Flamestrike", cost: 7, type: "spell", attack: 0, health: 0, ability: "AOE damage", emoji: "🔥", rarity: "epic", color: "colorless" },
    { name: "Pyroblast", cost: 8, type: "spell", attack: 0, health: 0, ability: "Deal 8 damage", emoji: "💥", rarity: "epic", color: "colorless" },
    { name: "Call of the Wild", cost: 8, type: "spell", attack: 0, health: 0, ability: "Summon nature", emoji: "🦁", rarity: "epic", color: "colorless" },
    { name: "Doom", cost: 10, type: "spell", attack: 0, health: 0, ability: "Destroy all", emoji: "☠️", rarity: "epic", color: "colorless" },
    { name: "Equality", cost: 6, type: "spell", attack: 0, health: 0, ability: "All allies +2/+2", emoji: "⚖️", rarity: "epic", color: "colorless" },
    { name: "Sprint", cost: 5, type: "spell", attack: 0, health: 0, ability: "Draw 3 cards", emoji: "🏃", rarity: "epic", color: "colorless" },
    { name: "Vanish", cost: 6, type: "spell", attack: 0, health: 0, ability: "Destroy hand", emoji: "💨", rarity: "epic", color: "colorless" },
    { name: "Brawl", cost: 5, type: "spell", attack: 0, health: 0, ability: "Destroy all", emoji: "⚔️", rarity: "epic", color: "colorless" },
    { name: "Tree of Life", cost: 9, type: "spell", attack: 0, health: 0, ability: "Heal all allies", emoji: "🌳", rarity: "epic", color: "colorless" },
    { name: "Astral Communion", cost: 4, type: "spell", attack: 0, health: 0, ability: "Draw 3 cards", emoji: "🌌", rarity: "epic", color: "colorless" },
    
    // Legendary Cards (9 total) - Chaos Orb moved to Umbral
    { name: "Dragon Emperor", cost: 9, type: "creature", attack: 7, health: 7, ability: "Battlecry: Deal 5 damage to all other creatures", emoji: "🐉", rarity: "legendary", color: "colorless" },
    { name: "Archmage Solarius", cost: 7, type: "creature", attack: 5, health: 7, ability: "Double spell damage", emoji: "🧙‍♂️", rarity: "legendary", color: "colorless" },
    { name: "Legacy Death's Shadow", cost: 8, type: "creature", attack: 7, health: 5, ability: "Deathtouch", emoji: "☠️", rarity: "legendary", color: "colorless" },
    { name: "Phoenix King", cost: 8, type: "creature", attack: 7, health: 7, ability: "Resurrect all", emoji: "🔥", rarity: "legendary", color: "colorless" },
    { name: "Titan of Earth", cost: 10, type: "creature", attack: 10, health: 10, ability: "Taunt. Spell Shield. Regenerate", emoji: "⛰️", rarity: "legendary", color: "colorless" },
    { name: "Time Lord", cost: 9, type: "creature", attack: 6, health: 8, ability: "Battlecry: Return all tapped creatures to their owner's hands", emoji: "⌛", rarity: "legendary", color: "colorless" },
    { name: "Void Wanderer", cost: 6, type: "creature", attack: 5, health: 5, ability: "Destroy hand", emoji: "🌀", rarity: "legendary", color: "colorless" },
    { name: "Angel of Light", cost: 7, type: "creature", attack: 6, health: 9, ability: "Heal all allies", emoji: "😇", rarity: "legendary", color: "colorless" },
    { name: "World Tree", cost: 8, type: "creature", attack: 3, health: 12, ability: "Summon nature", emoji: "🌍", rarity: "legendary", color: "colorless" },

    // ==================== CRIMSON CARDS (50) ====================

    // CRIMSON COMMON (20)
    { name: "Flameheart Scout", cost: 1, type: "creature", attack: 2, health: 1, ability: "Attack Trigger: Deal 1 damage to enemy player", emoji: "🔥", rarity: "common", color: "crimson" },
    { name: "Crimson Raider", cost: 1, type: "creature", attack: 2, health: 1, ability: "Quick", emoji: "⚔️", rarity: "common", color: "crimson" },
    { name: "Pyro Imp", cost: 2, type: "creature", attack: 2, health: 2, ability: "Burn", emoji: "👹", rarity: "common", color: "crimson" },
    { name: "Blood Berserker", cost: 2, type: "creature", attack: 3, health: 1, ability: "Charge", emoji: "🪓", rarity: "common", color: "crimson" },
    { name: "Lava Hound", cost: 2, type: "creature", attack: 2, health: 2, ability: "Deathrattle: Deal 2 damage to enemy player", emoji: "🐕", rarity: "common", color: "crimson" },
    { name: "War Drummer", cost: 3, type: "creature", attack: 3, health: 2, ability: "Your Crimson creatures have +1 attack", emoji: "🥁", rarity: "common", color: "crimson" },
    { name: "Reckless Duelist", cost: 3, type: "creature", attack: 4, health: 2, ability: "", emoji: "🗡️", rarity: "common", color: "crimson" },
    { name: "Ember Wolf", cost: 2, type: "creature", attack: 3, health: 1, ability: "Rush", emoji: "🐺", rarity: "common", color: "crimson" },
    { name: "Fire Cultist", cost: 3, type: "creature", attack: 2, health: 3, ability: "Battlecry: Deal 2 damage", emoji: "🔥", rarity: "common", color: "crimson" },
    { name: "Magma Lizard", cost: 1, type: "creature", attack: 1, health: 2, ability: "Attack Trigger: Deal 1 damage", emoji: "🦎", rarity: "common", color: "crimson" },
    { name: "Blaze Runner", cost: 4, type: "creature", attack: 4, health: 3, ability: "Rush", emoji: "🏃", rarity: "common", color: "crimson" },
    { name: "Crimson Brute", cost: 4, type: "creature", attack: 5, health: 2, ability: "", emoji: "💪", rarity: "common", color: "crimson" },
    { name: "Ignite", cost: 1, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage. Draw a card if target dies", emoji: "🔥", rarity: "common", color: "crimson" },
    { name: "Scorch", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage", emoji: "🔥", rarity: "common", color: "crimson" },
    { name: "Flame Burst", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 4 damage", emoji: "💥", rarity: "common", color: "crimson" },
    { name: "Inferno Strike", cost: 4, type: "spell", attack: 0, health: 0, ability: "Deal 6 damage", emoji: "🔥", rarity: "common", color: "crimson" },
    { name: "Battle Frenzy", cost: 2, type: "spell", attack: 0, health: 0, ability: "Your Crimson creatures gain +2 attack this turn", emoji: "⚔️", rarity: "common", color: "crimson" },
    { name: "Raging Flames", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage to all enemies", emoji: "🔥", rarity: "common", color: "crimson" },
    { name: "Blood Oath", cost: 1, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage to yourself. Draw 2 cards", emoji: "💔", rarity: "common", color: "crimson" },
    { name: "War Cry", cost: 2, type: "spell", attack: 0, health: 0, ability: "All Crimson creatures gain +1/+1", emoji: "📯", rarity: "common", color: "crimson" },

    // CRIMSON RARE (15)
    { name: "Crimson Warlord", cost: 4, type: "creature", attack: 4, health: 3, ability: "Your Crimson creatures have Charge", emoji: "👑", rarity: "rare", color: "crimson" },
    { name: "Flame Djinn", cost: 3, type: "creature", attack: 3, health: 2, ability: "Flying. Battlecry: Deal 2 damage", emoji: "🧞", rarity: "rare", color: "crimson" },
    { name: "Molten Golem", cost: 5, type: "creature", attack: 5, health: 4, ability: "Deathrattle: Deal 3 damage to all enemies", emoji: "🗿", rarity: "rare", color: "crimson" },
    { name: "Rage Elemental", cost: 4, type: "creature", attack: 3, health: 4, ability: "Enrage. Costs 1 less for each damaged creature", emoji: "🔥", rarity: "rare", color: "crimson" },
    { name: "Bloodthirst Warrior", cost: 3, type: "creature", attack: 3, health: 3, ability: "Lifelink. Loses 1 health at end of turn", emoji: "⚔️", rarity: "rare", color: "crimson" },
    { name: "Wildfire Mage", cost: 4, type: "creature", attack: 2, health: 4, ability: "Your damage spells deal +1 damage", emoji: "🧙", rarity: "rare", color: "crimson" },
    { name: "Crimson Assassin", cost: 3, type: "creature", attack: 4, health: 1, ability: "Stealth. Attack Trigger: Draw a card", emoji: "🥷", rarity: "rare", color: "crimson" },
    { name: "Magma Wurm", cost: 5, type: "creature", attack: 6, health: 3, ability: "Trample", emoji: "🐛", rarity: "rare", color: "crimson" },
    { name: "Flameborn Champion", cost: 5, type: "creature", attack: 5, health: 4, ability: "Double Strike", emoji: "🏆", rarity: "rare", color: "crimson" },
    { name: "Volcanic Drake", cost: 6, type: "creature", attack: 5, health: 5, ability: "Flying. Costs 1 less for each enemy creature", emoji: "🐉", rarity: "rare", color: "crimson" },
    { name: "Pyroclasm", cost: 4, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage to all creatures", emoji: "💥", rarity: "rare", color: "crimson" },
    { name: "Reckless Assault", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 5 damage to target. Deal 2 damage to yourself", emoji: "⚔️", rarity: "rare", color: "crimson" },
    { name: "Chain Lightning", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage. If it kills, cast again on another target", emoji: "⚡", rarity: "rare", color: "crimson" },
    { name: "Flame Lance", cost: 5, type: "spell", attack: 0, health: 0, ability: "Deal 8 damage", emoji: "🔥", rarity: "rare", color: "crimson" },
    { name: "Warcaller's Banner", cost: 3, type: "spell", attack: 0, health: 0, ability: "All your Crimson creatures gain +2/+1", emoji: "🚩", rarity: "rare", color: "crimson" },

    // CRIMSON EPIC (10)
    { name: "Inferno Titan", cost: 7, type: "creature", attack: 7, health: 5, ability: "Attack Trigger: Deal 3 damage to enemy player", emoji: "🔥", rarity: "epic", color: "crimson" },
    { name: "Crimson Phoenix", cost: 6, type: "creature", attack: 5, health: 4, ability: "Flying. Deathrattle: Return to hand with +2/+2", emoji: "🦅", rarity: "epic", color: "crimson" },
    { name: "War Machine", cost: 7, type: "creature", attack: 8, health: 6, ability: "Trample. Whenever you cast a Crimson spell, this gains +1/+1", emoji: "🤖", rarity: "epic", color: "crimson" },
    { name: "Ragefire Colossus", cost: 7, type: "creature", attack: 6, health: 6, ability: "Double Strike. Costs 1 less for each spell cast this game", emoji: "👹", rarity: "epic", color: "crimson" },
    { name: "Bloodlord General", cost: 6, type: "creature", attack: 5, health: 5, ability: "Your Crimson creatures cost 1 less", emoji: "👑", rarity: "epic", color: "crimson" },
    { name: "Living Inferno", cost: 9, type: "creature", attack: 9, health: 7, ability: "Attack Trigger: Deal 5 damage to enemy player", emoji: "🔥", rarity: "epic", color: "crimson" },
    { name: "Chaos Dragon", cost: 8, type: "creature", attack: 7, health: 7, ability: "Flying. Battlecry: Deal 4 damage to all other creatures", emoji: "🐉", rarity: "epic", color: "crimson" },
    { name: "Cataclysm", cost: 6, type: "spell", attack: 0, health: 0, ability: "Deal 6 damage to all creatures and enemy player", emoji: "☄️", rarity: "epic", color: "crimson" },
    { name: "World Ablaze", cost: 8, type: "spell", attack: 0, health: 0, ability: "Deal 10 damage to enemy player", emoji: "🌍", rarity: "epic", color: "crimson" },
    { name: "Berserker Rage", cost: 5, type: "spell", attack: 0, health: 0, ability: "All Crimson creatures gain +3/+1 and Charge", emoji: "😤", rarity: "epic", color: "crimson" },

    // CRIMSON LEGENDARY (5)
    { name: "Infernox, the Eternal Flame", cost: 8, type: "creature", attack: 6, health: 6, ability: "Flying. Your Crimson spells deal +2 damage. Attack Trigger: Deal 3 damage to all enemies", emoji: "🔥", rarity: "legendary", color: "crimson" },
    { name: "Warlord Kragath", cost: 7, type: "creature", attack: 6, health: 6, ability: "All your Crimson creatures have Charge and +2 attack", emoji: "⚔️", rarity: "legendary", color: "crimson" },
    { name: "Phoenix Eternal", cost: 9, type: "creature", attack: 8, health: 8, ability: "Flying. Whenever this dies, return it to play at end of turn", emoji: "🦅", rarity: "legendary", color: "crimson" },
    { name: "Ragnar the Destroyer", cost: 10, type: "creature", attack: 10, health: 8, ability: "Trample. Attack Trigger: Deal damage equal to this creature's attack to all enemies", emoji: "👹", rarity: "legendary", color: "crimson" },
    { name: "Crimson Apocalypse", cost: 8, type: "spell", attack: 0, health: 0, ability: "Deal 8 damage. Summon three 3/1 Crimson Flames", emoji: "☄️", rarity: "legendary", color: "crimson" },

    // ==================== AZURE CARDS (47 total - 3 cards removed) ====================

    // AZURE COMMON (19 - Counterspell removed)
    { name: "Azure Initiate", cost: 1, type: "creature", attack: 1, health: 2, ability: "Draw a card when played", emoji: "📚", rarity: "common", color: "azure" },
    { name: "Tide Caller", cost: 2, type: "creature", attack: 2, health: 2, ability: "Battlecry: Return enemy creature to hand (3+ cost)", emoji: "🌊", rarity: "common", color: "azure" },
    { name: "Sky Watcher", cost: 2, type: "creature", attack: 1, health: 3, ability: "Flying", emoji: "👁️", rarity: "common", color: "azure" },
    { name: "Mist Walker", cost: 3, type: "creature", attack: 2, health: 3, ability: "Stealth. Draw a card when attacking", emoji: "👻", rarity: "common", color: "azure" },
    { name: "Arcane Scholar", cost: 2, type: "creature", attack: 2, health: 1, ability: "Your Azure spells cost 1 less", emoji: "📖", rarity: "common", color: "azure" },
    { name: "Frost Sprite", cost: 1, type: "creature", attack: 1, health: 1, ability: "Freeze enemy when attacking", emoji: "❄️", rarity: "common", color: "azure" },
    { name: "Cloudkin Scout", cost: 3, type: "creature", attack: 2, health: 3, ability: "Flying. Draw a card", emoji: "☁️", rarity: "common", color: "azure" },
    { name: "Spellweaver", cost: 3, type: "creature", attack: 2, health: 2, ability: "Spell Power +1", emoji: "🧙", rarity: "common", color: "azure" },
    { name: "Dream Walker", cost: 4, type: "creature", attack: 3, health: 4, ability: "Battlecry: Return creature to hand", emoji: "💭", rarity: "common", color: "azure" },
    { name: "Azure Serpent", cost: 4, type: "creature", attack: 3, health: 3, ability: "Your Azure cards cost 1 less", emoji: "🐍", rarity: "common", color: "azure" },
    { name: "Tide Shifter", cost: 2, type: "creature", attack: 2, health: 1, ability: "Bounce enemy creature (2- cost)", emoji: "🌊", rarity: "common", color: "azure" },
    { name: "Wind Rider", cost: 3, type: "creature", attack: 3, health: 2, ability: "Flying", emoji: "🌬️", rarity: "common", color: "azure" },
    { name: "Temporal Shift", cost: 1, type: "spell", attack: 0, health: 0, ability: "Return creature to hand", emoji: "⏰", rarity: "common", color: "azure" },
    { name: "Mind Read", cost: 2, type: "spell", attack: 0, health: 0, ability: "Draw 2 cards", emoji: "🧠", rarity: "common", color: "azure" },
    { name: "Frost Nova", cost: 3, type: "spell", attack: 0, health: 0, ability: "Freeze all enemy creatures", emoji: "❄️", rarity: "common", color: "azure" },
    { name: "Arcane Blast", cost: 1, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage. Draw a card", emoji: "✨", rarity: "common", color: "azure" },
    { name: "Mana Drain", cost: 3, type: "spell", attack: 0, health: 0, ability: "Enemy discards 2 cards. You draw 1", emoji: "💧", rarity: "common", color: "azure" },
    { name: "Rewind", cost: 2, type: "spell", attack: 0, health: 0, ability: "Return target creature to owner's hand", emoji: "⏮️", rarity: "common", color: "azure" },
    { name: "Insight", cost: 1, type: "spell", attack: 0, health: 0, ability: "Draw 2 cards. Your Azure spells cost 1 more next turn", emoji: "💡", rarity: "common", color: "azure" },

    // AZURE RARE (14 - Counterstorm removed)
    { name: "Azure Archmage", cost: 3, type: "creature", attack: 3, health: 3, ability: "Your spells cost 1 less", emoji: "🧙‍♂️", rarity: "rare", color: "azure" },
    { name: "Crystalline Elemental", cost: 3, type: "creature", attack: 2, health: 4, ability: "Spell Shield. Draw a card when targeted", emoji: "💎", rarity: "rare", color: "azure" },
    { name: "Thought Stealer", cost: 4, type: "creature", attack: 3, health: 4, ability: "Stealth. Attack Trigger: Enemy discards a card", emoji: "🧠", rarity: "rare", color: "azure" },
    { name: "Azure Storm Caller", cost: 5, type: "creature", attack: 4, health: 4, ability: "Battlecry: Deal 3 damage. Draw a card", emoji: "⛈️", rarity: "rare", color: "azure" },
    { name: "Tidal Kraken", cost: 6, type: "creature", attack: 4, health: 6, ability: "Battlecry: Return all other creatures to hand", emoji: "🐙", rarity: "rare", color: "azure" },
    { name: "Azure Phoenix", cost: 5, type: "creature", attack: 4, health: 3, ability: "Flying. Deathrattle: Draw 2 cards", emoji: "🦅", rarity: "rare", color: "azure" },
    { name: "Sapphire Drake", cost: 5, type: "creature", attack: 3, health: 5, ability: "Flying. Your Azure cards cost 1 less", emoji: "🐉", rarity: "rare", color: "azure" },
    { name: "Mirror Mage", cost: 4, type: "creature", attack: 2, health: 4, ability: "Whenever you cast a spell, draw a card", emoji: "🪞", rarity: "rare", color: "azure" },
    { name: "Illusionist", cost: 3, type: "creature", attack: 1, health: 4, ability: "Stealth. Your spells cost 1 less", emoji: "🎭", rarity: "rare", color: "azure" },
    { name: "Frost Lord", cost: 6, type: "creature", attack: 4, health: 6, ability: "Freeze all enemy creatures when played", emoji: "❄️", rarity: "rare", color: "azure" },
    { name: "Mass Recall", cost: 5, type: "spell", attack: 0, health: 0, ability: "Return all creatures to their owner's hands", emoji: "🔄", rarity: "rare", color: "azure" },
    { name: "Deep Freeze", cost: 4, type: "spell", attack: 0, health: 0, ability: "Freeze creature. It can't unfreeze", emoji: "🧊", rarity: "rare", color: "azure" },
    { name: "Arcane Intellect", cost: 3, type: "spell", attack: 0, health: 0, ability: "Draw 3 cards", emoji: "🧠", rarity: "rare", color: "azure" },
    { name: "Time Warp", cost: 6, type: "spell", attack: 0, health: 0, ability: "Take an extra turn", emoji: "⏰", rarity: "rare", color: "azure" },

    // AZURE EPIC (10)
    { name: "Grand Archmage", cost: 7, type: "creature", attack: 5, health: 6, ability: "Your spells cost 2 less and draw a card", emoji: "🧙", rarity: "epic", color: "azure" },
    { name: "Leviathan", cost: 8, type: "creature", attack: 6, health: 8, ability: "Battlecry: Return all other creatures to hand", emoji: "🐋", rarity: "epic", color: "azure" },
    { name: "Storm Titan", cost: 8, type: "creature", attack: 7, health: 7, ability: "Flying. Battlecry: Draw cards equal to Azure creatures you control", emoji: "⛈️", rarity: "epic", color: "azure" },
    { name: "Azure Colossus", cost: 9, type: "creature", attack: 6, health: 10, ability: "Spell Shield. Costs 1 less for each spell cast", emoji: "🗿", rarity: "epic", color: "azure" },
    { name: "Chronomancer", cost: 7, type: "creature", attack: 5, health: 5, ability: "Battlecry: Take an extra turn after this one", emoji: "⏰", rarity: "epic", color: "azure" },
    { name: "Dream Weaver", cost: 6, type: "creature", attack: 4, health: 6, ability: "Your hand size is unlimited. Draw 2 cards", emoji: "💭", rarity: "epic", color: "azure" },
    { name: "Tidecaller Ancient", cost: 8, type: "creature", attack: 5, health: 8, ability: "All your Azure cards cost 2 less", emoji: "🌊", rarity: "epic", color: "azure" },
    { name: "Omniscience", cost: 8, type: "spell", attack: 0, health: 0, ability: "Draw 5 cards. Your spells cost 0 this turn", emoji: "🔮", rarity: "epic", color: "azure" },
    { name: "Temporal Mastery", cost: 7, type: "spell", attack: 0, health: 0, ability: "Take two extra turns", emoji: "⏰", rarity: "epic", color: "azure" },
    { name: "Mass Polymorph", cost: 6, type: "spell", attack: 0, health: 0, ability: "Transform all creatures into 1/1 Frogs", emoji: "🐸", rarity: "epic", color: "azure" },

    // AZURE LEGENDARY (5)
    { name: "Thalassor, Lord of Tides", cost: 7, type: "creature", attack: 6, health: 8, ability: "All your Azure cards cost 2 less. Battlecry: Return all other creatures to hand. Draw 3 cards", emoji: "🌊", rarity: "legendary", color: "azure" },
    { name: "Chronos, Time Weaver", cost: 9, type: "creature", attack: 7, health: 7, ability: "Your spells cost 2 less. Draw 3 cards", emoji: "⏰", rarity: "legendary", color: "azure" },
    { name: "Azure Infinity", cost: 7, type: "creature", attack: 5, health: 7, ability: "Your maximum hand size is unlimited. Whenever you draw a card, reduce a random card's cost by 1", emoji: "♾️", rarity: "legendary", color: "azure" },
    { name: "Stormcaller Zephyr", cost: 8, type: "creature", attack: 6, health: 6, ability: "Flying. Spell Power +3. Whenever you cast a spell, draw a card and deal 2 damage to all enemies", emoji: "⛈️", rarity: "legendary", color: "azure" },
    { name: "Perfect Recall", cost: 8, type: "spell", attack: 0, health: 0, ability: "Draw 5 cards. They cost 2 less", emoji: "🧠", rarity: "legendary", color: "azure" },

    // ==================== VERDANT CARDS (50) ====================

    // VERDANT COMMON (20)
    { name: "Sapling Guardian", cost: 1, type: "creature", attack: 0, health: 3, ability: "Taunt", emoji: "🌱", rarity: "common", color: "verdant" },
    { name: "Forest Sprite", cost: 1, type: "creature", attack: 1, health: 1, ability: "Deathrattle: Gain 2 health", emoji: "🧚", rarity: "common", color: "verdant" },
    { name: "Moss Bear", cost: 3, type: "creature", attack: 3, health: 4, ability: "", emoji: "🐻", rarity: "common", color: "verdant" },
    { name: "Vine Strangler", cost: 2, type: "creature", attack: 2, health: 2, ability: "Your Verdant creatures have +0/+1", emoji: "🌿", rarity: "common", color: "verdant" },
    { name: "Wild Boar", cost: 2, type: "creature", attack: 3, health: 2, ability: "Charge", emoji: "🐗", rarity: "common", color: "verdant" },
    { name: "Nature's Sentinel", cost: 3, type: "creature", attack: 2, health: 4, ability: "Taunt. Gain 2 health when played", emoji: "🌳", rarity: "common", color: "verdant" },
    { name: "Thornback Turtle", cost: 2, type: "creature", attack: 1, health: 4, ability: "Taunt", emoji: "🐢", rarity: "common", color: "verdant" },
    { name: "Grove Protector", cost: 4, type: "creature", attack: 3, health: 5, ability: "Taunt", emoji: "🌲", rarity: "common", color: "verdant" },
    { name: "Earthroot Elk", cost: 4, type: "creature", attack: 4, health: 4, ability: "Battlecry: Gain 3 health", emoji: "🦌", rarity: "common", color: "verdant" },
    { name: "Verdant Warrior", cost: 3, type: "creature", attack: 3, health: 3, ability: "", emoji: "⚔️", rarity: "common", color: "verdant" },
    { name: "Bloom Keeper", cost: 2, type: "creature", attack: 2, health: 3, ability: "Battlecry: Gain 2 health", emoji: "🌸", rarity: "common", color: "verdant" },
    { name: "Ancient Roots", cost: 5, type: "creature", attack: 4, health: 6, ability: "Taunt", emoji: "🌳", rarity: "common", color: "verdant" },
    { name: "Nourish", cost: 1, type: "spell", attack: 0, health: 0, ability: "Restore 4 health", emoji: "🍃", rarity: "common", color: "verdant" },
    { name: "Wild Growth", cost: 2, type: "spell", attack: 0, health: 0, ability: "All Verdant creatures gain +1/+1", emoji: "🌿", rarity: "common", color: "verdant" },
    { name: "Nature's Wrath", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage. Gain 3 health", emoji: "🌿", rarity: "common", color: "verdant" },
    { name: "Overgrowth", cost: 3, type: "spell", attack: 0, health: 0, ability: "All your creatures gain +2/+2", emoji: "🌳", rarity: "common", color: "verdant" },
    { name: "Root Bind", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage. Freeze target", emoji: "🌱", rarity: "common", color: "verdant" },
    { name: "Rejuvenate", cost: 2, type: "spell", attack: 0, health: 0, ability: "Restore all Verdant creatures to full health", emoji: "💚", rarity: "common", color: "verdant" },
    { name: "Entangle", cost: 1, type: "spell", attack: 0, health: 0, ability: "Freeze target creature", emoji: "🌿", rarity: "common", color: "verdant" },
    { name: "Flourish", cost: 3, type: "spell", attack: 0, health: 0, ability: "Summon two 1/1 Saplings with Taunt", emoji: "🌱", rarity: "common", color: "verdant" },

    // VERDANT RARE (15)
    { name: "Elder Treant", cost: 5, type: "creature", attack: 4, health: 7, ability: "Taunt. Regenerate", emoji: "🌳", rarity: "rare", color: "verdant" },
    { name: "Ironbark Protector", cost: 6, type: "creature", attack: 6, health: 6, ability: "Taunt", emoji: "🌲", rarity: "rare", color: "verdant" },
    { name: "Wildwood Colossus", cost: 7, type: "creature", attack: 7, health: 7, ability: "Trample", emoji: "🐻", rarity: "rare", color: "verdant" },
    { name: "Verdant Hydra", cost: 6, type: "creature", attack: 5, health: 5, ability: "Whenever this takes damage, summon a 2/2 Verdant Spawn", emoji: "🐍", rarity: "rare", color: "verdant" },
    { name: "Nature's Champion", cost: 5, type: "creature", attack: 5, health: 5, ability: "All your Verdant creatures have +1/+1", emoji: "🏆", rarity: "rare", color: "verdant" },
    { name: "Forest Guardian", cost: 4, type: "creature", attack: 3, health: 5, ability: "Taunt. Battlecry: Restore 5 health", emoji: "🌲", rarity: "rare", color: "verdant" },
    { name: "Thornmail Beast", cost: 5, type: "creature", attack: 4, health: 6, ability: "Whenever this takes damage, deal 2 damage to attacker", emoji: "🦏", rarity: "rare", color: "verdant" },
    { name: "Lifecrafter", cost: 4, type: "creature", attack: 3, health: 4, ability: "Battlecry: All allies gain +1/+2", emoji: "🧚", rarity: "rare", color: "verdant" },
    { name: "Verdant Phoenix", cost: 6, type: "creature", attack: 5, health: 5, ability: "Flying. Deathrattle: Heal all allies to full", emoji: "🦅", rarity: "rare", color: "verdant" },
    { name: "Ancient Protector", cost: 7, type: "creature", attack: 6, health: 8, ability: "Taunt. You take no damage while this is alive", emoji: "🗿", rarity: "rare", color: "verdant" },
    { name: "Rampage", cost: 4, type: "spell", attack: 0, health: 0, ability: "All Verdant creatures gain +3/+3 and Trample", emoji: "🌿", rarity: "rare", color: "verdant" },
    { name: "Circle of Life", cost: 5, type: "spell", attack: 0, health: 0, ability: "Restore 10 health to all allies", emoji: "♻️", rarity: "rare", color: "verdant" },
    { name: "Primordial Roar", cost: 3, type: "spell", attack: 0, health: 0, ability: "Summon three 2/2 Verdant Beasts", emoji: "🦁", rarity: "rare", color: "verdant" },
    { name: "Nature's Grasp", cost: 4, type: "spell", attack: 0, health: 0, ability: "Deal 6 damage. Restore 6 health", emoji: "🌿", rarity: "rare", color: "verdant" },
    { name: "Savage Roar", cost: 3, type: "spell", attack: 0, health: 0, ability: "All your creatures gain +2 attack this turn", emoji: "😤", rarity: "rare", color: "verdant" },

    // VERDANT EPIC (10)
    { name: "Worldtree Colossus", cost: 9, type: "creature", attack: 10, health: 10, ability: "Taunt. Costs 1 less for each Verdant creature you control", emoji: "🌳", rarity: "epic", color: "verdant" },
    { name: "Primal Guardian", cost: 8, type: "creature", attack: 8, health: 8, ability: "Trample. Regenerate. All your Verdant creatures have +2/+2", emoji: "🦖", rarity: "epic", color: "verdant" },
    { name: "Ancient of War", cost: 7, type: "creature", attack: 7, health: 7, ability: "Taunt. Battlecry: Gain +4/+4 or Summon two 2/2 Treants", emoji: "🌲", rarity: "epic", color: "verdant" },
    { name: "Nature's Avatar", cost: 8, type: "creature", attack: 6, health: 10, ability: "Taunt. All your creatures have Regenerate", emoji: "🌿", rarity: "epic", color: "verdant" },
    { name: "Verdant Titan", cost: 9, type: "creature", attack: 9, health: 9, ability: "Trample. Attack Trigger: All allies gain +1/+1", emoji: "💚", rarity: "epic", color: "verdant" },
    { name: "Eternal Treant", cost: 7, type: "creature", attack: 6, health: 8, ability: "Taunt. Deathrattle: Summon three 3/3 Treants", emoji: "🌳", rarity: "epic", color: "verdant" },
    { name: "Worldshaker", cost: 8, type: "creature", attack: 7, health: 9, ability: "Trample. Costs 1 less for each friendly creature", emoji: "🌍", rarity: "epic", color: "verdant" },
    { name: "Genesis", cost: 7, type: "spell", attack: 0, health: 0, ability: "Summon four 4/4 Verdant Beasts with Taunt", emoji: "🌍", rarity: "epic", color: "verdant" },
    { name: "Primal Fury", cost: 6, type: "spell", attack: 0, health: 0, ability: "All creatures gain +5/+5 and Trample", emoji: "😤", rarity: "epic", color: "verdant" },
    { name: "Nature's Vengeance", cost: 8, type: "spell", attack: 0, health: 0, ability: "Deal 10 damage. Restore 10 health. Summon a 5/5 Treant", emoji: "🌿", rarity: "epic", color: "verdant" },

    // VERDANT LEGENDARY (5)
    { name: "Cenarius, Ancient Protector", cost: 8, type: "creature", attack: 8, health: 10, ability: "Taunt. Regenerate. All your Verdant creatures cost 2 less and have +2/+2", emoji: "🌳", rarity: "legendary", color: "verdant" },
    { name: "Gaia's Wrath", cost: 8, type: "creature", attack: 7, health: 9, ability: "Trample. Attack Trigger: All allies gain +2/+2. You gain 5 health", emoji: "🌍", rarity: "legendary", color: "verdant" },
    { name: "Worldtree Eternal", cost: 10, type: "creature", attack: 10, health: 12, ability: "Taunt. Your Verdant creatures have 'Deathrattle: Return to hand'", emoji: "🌳", rarity: "legendary", color: "verdant" },
    { name: "Primal Alpha", cost: 7, type: "creature", attack: 6, health: 8, ability: "All your Verdant creatures have Charge and +2 attack", emoji: "🦁", rarity: "legendary", color: "verdant" },
    { name: "Force of Nature", cost: 6, type: "spell", attack: 0, health: 0, ability: "Summon three 5/5 Treants with Charge and Trample", emoji: "🌲", rarity: "legendary", color: "verdant" },

    // ==================== UMBRAL CARDS (51 total - Chaos Orb added) ====================

    // UMBRAL COMMON (20)
    { name: "Shadow Wisp", cost: 1, type: "creature", attack: 1, health: 1, ability: "Deathrattle: Enemy loses 1 health", emoji: "👻", rarity: "common", color: "umbral" },
    { name: "Grave Rat", cost: 1, type: "creature", attack: 2, health: 1, ability: "Deathrattle: Summon a 1/1 Skeleton", emoji: "🐀", rarity: "common", color: "umbral" },
    { name: "Necro Acolyte", cost: 2, type: "creature", attack: 2, health: 2, ability: "Deathrattle: Draw a card", emoji: "💀", rarity: "common", color: "umbral" },
    { name: "Void Walker", cost: 2, type: "creature", attack: 1, health: 3, ability: "Taunt. Lifesteal", emoji: "👤", rarity: "common", color: "umbral" },
    { name: "Shadow Fiend", cost: 3, type: "creature", attack: 3, health: 2, ability: "Stealth. Deathrattle: Deal 2 damage", emoji: "😈", rarity: "common", color: "umbral" },
    { name: "Plague Bearer", cost: 2, type: "creature", attack: 2, health: 1, ability: "Poison", emoji: "🦠", rarity: "common", color: "umbral" },
    { name: "Dark Cultist", cost: 3, type: "creature", attack: 2, health: 3, ability: "Deathrattle: Summon a 2/2 Shadow", emoji: "🕯️", rarity: "common", color: "umbral" },
    { name: "Bone Collector", cost: 3, type: "creature", attack: 3, health: 3, ability: "Costs 1 less for each friendly creature that died", emoji: "💀", rarity: "common", color: "umbral" },
    { name: "Umbral Shade", cost: 4, type: "creature", attack: 3, health: 4, ability: "Stealth. Lifesteal", emoji: "🌑", rarity: "common", color: "umbral" },
    { name: "Death's Herald", cost: 4, type: "creature", attack: 4, health: 3, ability: "Deathrattle: All enemies lose 2 health", emoji: "💀", rarity: "common", color: "umbral" },
    { name: "Shadow Stalker", cost: 2, type: "creature", attack: 3, health: 1, ability: "Stealth", emoji: "👻", rarity: "common", color: "umbral" },
    { name: "Carrion Feeder", cost: 1, type: "creature", attack: 1, health: 2, ability: "Gains +1/+1 when ally dies", emoji: "🦅", rarity: "common", color: "umbral" },
    { name: "Drain Life", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage. Restore 2 health", emoji: "💀", rarity: "common", color: "umbral" },
    { name: "Shadow Bolt", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 4 damage", emoji: "🌑", rarity: "common", color: "umbral" },
    { name: "Plague", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage to all enemies", emoji: "🦠", rarity: "common", color: "umbral" },
    { name: "Sacrifice", cost: 1, type: "spell", attack: 0, health: 0, ability: "Destroy ally. Draw 2 cards", emoji: "🗡️", rarity: "common", color: "umbral" },
    { name: "Dark Pact", cost: 2, type: "spell", attack: 0, health: 0, ability: "Destroy ally. Gain 8 health", emoji: "💔", rarity: "common", color: "umbral" },
    { name: "Reanimate", cost: 3, type: "spell", attack: 0, health: 0, ability: "Return creature from your graveyard to play", emoji: "💀", rarity: "common", color: "umbral" },
    { name: "Haunt", cost: 1, type: "spell", attack: 0, health: 0, ability: "Enemy loses 2 health. You gain 2 health", emoji: "👻", rarity: "common", color: "umbral" },
    { name: "Curse of Weakness", cost: 2, type: "spell", attack: 0, health: 0, ability: "All enemy creatures get -2/-2", emoji: "😈", rarity: "common", color: "umbral" },

    // UMBRAL RARE (15)
    { name: "Lich Apprentice", cost: 3, type: "creature", attack: 2, health: 3, ability: "Deathrattle: Return to hand with +2/+2", emoji: "💀", rarity: "rare", color: "umbral" },
    { name: "Umbral Reaper", cost: 4, type: "creature", attack: 4, health: 3, ability: "Whenever a creature dies, gain +1/+1", emoji: "⚰️", rarity: "rare", color: "umbral" },
    { name: "Dark Ritualist", cost: 4, type: "creature", attack: 3, health: 4, ability: "Your Umbral creatures cost 1 less", emoji: "🕯️", rarity: "rare", color: "umbral" },
    { name: "Shadow Dragon", cost: 5, type: "creature", attack: 5, health: 4, ability: "Flying. Lifesteal", emoji: "🐉", rarity: "rare", color: "umbral" },
    { name: "Plague Doctor", cost: 4, type: "creature", attack: 2, health: 5, ability: "All enemy creatures have -1/-1", emoji: "🩺", rarity: "rare", color: "umbral" },
    { name: "Death Knight", cost: 5, type: "creature", attack: 5, health: 5, ability: "Deathrattle: Deal 5 damage to all enemies", emoji: "⚔️", rarity: "rare", color: "umbral" },
    { name: "Soul Harvester", cost: 5, type: "creature", attack: 4, health: 4, ability: "Whenever creature dies, you gain 2 health", emoji: "👻", rarity: "rare", color: "umbral" },
    { name: "Void Terror", cost: 6, type: "creature", attack: 3, health: 3, ability: "Battlecry: Destroy all allies. Gain their stats", emoji: "😈", rarity: "rare", color: "umbral" },
    { name: "Umbral Phoenix", cost: 6, type: "creature", attack: 5, health: 3, ability: "Flying. Deathrattle: Return to hand", emoji: "🦅", rarity: "rare", color: "umbral" },
    { name: "Grave Lord", cost: 6, type: "creature", attack: 5, health: 6, ability: "Whenever ally dies, summon 1/1 Skeleton", emoji: "💀", rarity: "rare", color: "umbral" },
    { name: "Mass Drain", cost: 5, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage to all enemies. Gain 3 health for each", emoji: "💀", rarity: "rare", color: "umbral" },
    { name: "Necrotic Plague", cost: 4, type: "spell", attack: 0, health: 0, ability: "Deal 5 damage. If target dies, cast this on another", emoji: "🦠", rarity: "rare", color: "umbral" },
    { name: "Shadow Word: Death", cost: 3, type: "spell", attack: 0, health: 0, ability: "Destroy creature with 5+ attack", emoji: "💀", rarity: "rare", color: "umbral" },
    { name: "Resurrection", cost: 4, type: "spell", attack: 0, health: 0, ability: "Return two creatures from graveyard to play", emoji: "⚰️", rarity: "rare", color: "umbral" },
    { name: "Hellfire", cost: 4, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage to all creatures and heroes", emoji: "🔥", rarity: "rare", color: "umbral" },

    // UMBRAL EPIC (10)
    { name: "Umbral Colossus", cost: 8, type: "creature", attack: 7, health: 8, ability: "Lifesteal. Costs 1 less for each creature that died this game", emoji: "👤", rarity: "epic", color: "umbral" },
    { name: "Necrolord", cost: 7, type: "creature", attack: 6, health: 6, ability: "Deathrattle: Summon all Umbral creatures that died this game", emoji: "💀", rarity: "epic", color: "umbral" },
    { name: "Plague Titan", cost: 7, type: "creature", attack: 6, health: 7, ability: "All enemy creatures have -2/-2", emoji: "🦠", rarity: "epic", color: "umbral" },
    { name: "Death's Shadow", cost: 6, type: "creature", attack: 9, health: 9, ability: "Costs health instead of mana (1 health per mana)", emoji: "👤", rarity: "epic", color: "umbral" },
    { name: "Void Lord", cost: 9, type: "creature", attack: 8, health: 8, ability: "Taunt. Deathrattle: Summon three 3/3 Voidlings with Taunt", emoji: "😈", rarity: "epic", color: "umbral" },
    { name: "Soul Devourer", cost: 8, type: "creature", attack: 7, health: 7, ability: "Lifesteal. Attack Trigger: Destroy random enemy creature", emoji: "👻", rarity: "epic", color: "umbral" },
    { name: "Eternal Lich", cost: 7, type: "creature", attack: 6, health: 9, ability: "Cannot be destroyed. Loses 2 health at end of turn", emoji: "💀", rarity: "epic", color: "umbral" },
    { name: "Apocalypse", cost: 8, type: "spell", attack: 0, health: 0, ability: "Deal 5 damage to all creatures. Summon 2/2 Zombie for each death", emoji: "☠️", rarity: "epic", color: "umbral" },
    { name: "Soul Exchange", cost: 6, type: "spell", attack: 0, health: 0, ability: "Destroy all creatures. You gain health equal to their total attack", emoji: "💀", rarity: "epic", color: "umbral" },
    { name: "Dark Bargain", cost: 7, type: "spell", attack: 0, health: 0, ability: "Draw 5 cards. Lose 5 health", emoji: "📜", rarity: "epic", color: "umbral" },

    // UMBRAL LEGENDARY (6 - includes Chaos Orb)
    { name: "Morthul, Death's Master", cost: 9, type: "creature", attack: 8, health: 8, ability: "Lifesteal. Deathrattle: Return all Umbral creatures from graveyard with +2/+2", emoji: "💀", rarity: "legendary", color: "umbral" },
    { name: "Void Emperor", cost: 8, type: "creature", attack: 7, health: 9, ability: "Your Umbral creatures cost 2 less (minimum 1)", emoji: "😈", rarity: "legendary", color: "umbral" },
    { name: "Eternal Necromancer", cost: 7, type: "creature", attack: 5, health: 7, ability: "Whenever creature dies, summon copy of it for you", emoji: "💀", rarity: "legendary", color: "umbral" },
    { name: "Shadow Infinity", cost: 10, type: "creature", attack: 10, health: 10, ability: "Lifesteal. Deal 7 damage to all enemies when attacking", emoji: "🌑", rarity: "legendary", color: "umbral" },
    { name: "End of Days", cost: 9, type: "spell", attack: 0, health: 0, ability: "Destroy all creatures. Deal 1 damage to enemy player for each", emoji: "☠️", rarity: "legendary", color: "umbral" },
    { name: "Chaos Orb", cost: 10, type: "spell", attack: 0, health: 0, ability: "Random effect. Then, if a player has exactly 3 health left, that player wins the game", emoji: "🔮", rarity: "legendary", color: "umbral" },

    // ==================== DUAL-COLOR CARDS (48) ====================

    // CRIMSON-AZURE (8)
    { name: "Stormfire Mage", cost: 3, type: "creature", attack: 2, health: 3, ability: "Spell Power +1. If you control both Crimson and Azure creatures, +2 instead", emoji: "⚡", rarity: "common", color: "crimson-azure" },
    { name: "Volatile Spell", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage. If Azure card in hand, draw a card", emoji: "🔥", rarity: "common", color: "crimson-azure" },
    { name: "Ember Scholar", cost: 2, type: "creature", attack: 2, health: 2, ability: "Draw a card. If Crimson creature on board, deal 2 damage", emoji: "📚", rarity: "common", color: "crimson-azure" },
    { name: "Phoenix Archmage", cost: 5, type: "creature", attack: 4, health: 4, ability: "Your Crimson spells draw a card. Your Azure spells deal 2 damage", emoji: "🦅", rarity: "rare", color: "crimson-azure" },
    { name: "Storm's Fury", cost: 4, type: "spell", attack: 0, health: 0, ability: "Deal 4 damage. Draw a card. If both colors on board, repeat", emoji: "⚡", rarity: "rare", color: "crimson-azure" },
    { name: "Firestorm Titan", cost: 7, type: "creature", attack: 6, health: 6, ability: "Flying. Your spells cost 1 less and deal +2 damage", emoji: "🔥", rarity: "epic", color: "crimson-azure" },
    { name: "Azure Inferno", cost: 6, type: "spell", attack: 0, health: 0, ability: "Deal 6 damage. Draw 3 cards. If both colors, cost 0", emoji: "🔥", rarity: "epic", color: "crimson-azure" },
    { name: "Pyroclast Archon", cost: 8, type: "creature", attack: 7, health: 7, ability: "Flying. Spell Power +2. Whenever you cast spell, deal 3 damage and draw card", emoji: "🔥", rarity: "legendary", color: "crimson-azure" },

    // CRIMSON-VERDANT (8)
    { name: "Raging Treant", cost: 3, type: "creature", attack: 3, health: 3, ability: "Charge. If you control both Crimson and Verdant, +2/+2", emoji: "🌳", rarity: "common", color: "crimson-verdant" },
    { name: "Wild Assault", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage. Gain 3 health", emoji: "🌿", rarity: "common", color: "crimson-verdant" },
    { name: "Blood Blossom", cost: 2, type: "creature", attack: 2, health: 2, ability: "Gain 2 health. If Crimson on board, deal 2 damage", emoji: "🌸", rarity: "common", color: "crimson-verdant" },
    { name: "Primal Warlord", cost: 6, type: "creature", attack: 5, health: 5, ability: "Trample. Charge", emoji: "🏆", rarity: "rare", color: "crimson-verdant" },
    { name: "Nature's Wrath", cost: 6, type: "spell", attack: 0, health: 0, ability: "Deal 5 damage. Summon 3/3 Treant. If both colors, repeat", emoji: "🌿", rarity: "rare", color: "crimson-verdant" },
    { name: "Verdant Phoenix", cost: 8, type: "creature", attack: 6, health: 7, ability: "Flying. Charge. Deathrattle: Deal 5 damage to all enemies", emoji: "🦅", rarity: "epic", color: "crimson-verdant" },
    { name: "Primal Inferno", cost: 6, type: "spell", attack: 0, health: 0, ability: "Deal 6 damage to all enemies. All allies gain +3/+3", emoji: "🔥", rarity: "epic", color: "crimson-verdant" },
    { name: "Ragnar the Wild", cost: 10, type: "creature", attack: 8, health: 8, ability: "Trample. Charge. Attack Trigger: All Crimson/Verdant allies +1/+1", emoji: "🐉", rarity: "legendary", color: "crimson-verdant" },

    // CRIMSON-UMBRAL (8)
    { name: "Blood Cultist", cost: 2, type: "creature", attack: 2, health: 2, ability: "Deathrattle: Deal 2 damage to enemy. If both colors, 4 instead", emoji: "🩸", rarity: "common", color: "crimson-umbral" },
    { name: "Drain Strike", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage. Gain 2 health", emoji: "💀", rarity: "common", color: "crimson-umbral" },
    { name: "Shadow Berserker", cost: 3, type: "creature", attack: 3, health: 2, ability: "Charge. Lifesteal", emoji: "⚔️", rarity: "common", color: "crimson-umbral" },
    { name: "Crimson Reaper", cost: 5, type: "creature", attack: 5, health: 4, ability: "Lifesteal. Attack Trigger: Deal 2 damage to all enemies", emoji: "⚰️", rarity: "rare", color: "crimson-umbral" },
    { name: "Blood Ritual", cost: 4, type: "spell", attack: 0, health: 0, ability: "Deal 5 damage. Gain 5 health. If both colors, repeat", emoji: "🩸", rarity: "rare", color: "crimson-umbral" },
    { name: "Infernal Lich", cost: 7, type: "creature", attack: 6, health: 6, ability: "Lifesteal. Deathrattle: Deal 6 damage to all enemies", emoji: "💀", rarity: "epic", color: "crimson-umbral" },
    { name: "Necrotic Firestorm", cost: 6, type: "spell", attack: 0, health: 0, ability: "Deal 4 damage to all. You gain 2 health for each death", emoji: "🔥", rarity: "epic", color: "crimson-umbral" },
    { name: "Morthul the Destroyer", cost: 9, type: "creature", attack: 8, health: 7, ability: "Lifesteal. Attack Trigger: Deal 4 damage to all enemies. Deathrattle: Resurrect all Crimson/Umbral creatures", emoji: "💀", rarity: "legendary", color: "crimson-umbral" },

    // AZURE-VERDANT (10 - includes 2 new commons)
    { name: "Verdant Disciple", cost: 2, type: "creature", attack: 2, health: 3, ability: "If you control an Azure card, gain Taunt", emoji: "🌿", rarity: "common", color: "azure-verdant" },
    { name: "Azure Seedling", cost: 1, type: "creature", attack: 1, health: 2, ability: "Battlecry: If you control a Verdant creature, draw a card", emoji: "🌱", rarity: "common", color: "azure-verdant" },
    { name: "Tide Treant", cost: 3, type: "creature", attack: 2, health: 4, ability: "Taunt. Draw a card. If both colors, +2/+2", emoji: "🌊", rarity: "common", color: "azure-verdant" },
    { name: "Growth Surge", cost: 2, type: "spell", attack: 0, health: 0, ability: "Draw 2 cards. Gain 4 health", emoji: "🌿", rarity: "common", color: "azure-verdant" },
    { name: "Wisdom Keeper", cost: 2, type: "creature", attack: 1, health: 3, ability: "Draw card. If Verdant on board, gain 3 health", emoji: "📚", rarity: "common", color: "azure-verdant" },
    { name: "Ancient Sage", cost: 4, type: "creature", attack: 4, health: 5, ability: "Taunt. Draw card. All Verdant creatures cost 1 less", emoji: "🧙", rarity: "rare", color: "azure-verdant" },
    { name: "Nature's Wisdom", cost: 4, type: "spell", attack: 0, health: 0, ability: "Draw 3 cards. Restore 6 health. If both colors, cost 0", emoji: "🌿", rarity: "rare", color: "azure-verdant" },
    { name: "Tidal Colossus", cost: 5, type: "creature", attack: 5, health: 7, ability: "Taunt. Battlecry: Draw cards equal to Verdant creatures. They cost 1", emoji: "🌊", rarity: "epic", color: "azure-verdant" },
    { name: "Primordial Growth", cost: 5, type: "spell", attack: 0, health: 0, ability: "Summon three 3/3 Treants with Taunt. Draw 2 cards", emoji: "🌳", rarity: "epic", color: "azure-verdant" },
    { name: "Cenarius the Wise", cost: 7, type: "creature", attack: 7, health: 9, ability: "Taunt. Regenerate. Your Azure and Verdant cards cost 2 less. Draw 2 cards each turn", emoji: "🌳", rarity: "legendary", color: "azure-verdant" },

    // AZURE-UMBRAL (8)
    { name: "Shadow Scholar", cost: 2, type: "creature", attack: 2, health: 1, ability: "Draw card. If both colors, enemy loses 2 health", emoji: "📚", rarity: "common", color: "azure-umbral" },
    { name: "Void Drain", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage. Draw card. Gain 2 health", emoji: "💀", rarity: "common", color: "azure-umbral" },
    { name: "Dark Seer", cost: 3, type: "creature", attack: 2, health: 3, ability: "Stealth. Draw card when played", emoji: "👁️", rarity: "common", color: "azure-umbral" },
    { name: "Necro Archmage", cost: 5, type: "creature", attack: 4, health: 4, ability: "Your Azure spells drain 2 health. Your Umbral creatures cost 1 less", emoji: "🧙", rarity: "rare", color: "azure-umbral" },
    { name: "Shadow Recall", cost: 4, type: "spell", attack: 0, health: 0, ability: "Draw 3 cards. Enemy loses 3 health. If both colors, repeat", emoji: "🌑", rarity: "rare", color: "azure-umbral" },
    { name: "Void Archmage", cost: 7, type: "creature", attack: 5, health: 7, ability: "Lifesteal. Your spells cost 2 less and drain 2 health", emoji: "💀", rarity: "epic", color: "azure-umbral" },
    { name: "Necrotic Wisdom", cost: 6, type: "spell", attack: 0, health: 0, ability: "Draw 5 cards. Deal 5 damage to all enemies", emoji: "💀", rarity: "epic", color: "azure-umbral" },
    { name: "Morthul the Wise", cost: 9, type: "creature", attack: 7, health: 8, ability: "Lifesteal. Your Azure and Umbral cards cost 0. Draw 2 cards each turn", emoji: "💀", rarity: "legendary", color: "azure-umbral" },

    // VERDANT-UMBRAL (8)
    { name: "Deathroot Treant", cost: 3, type: "creature", attack: 3, health: 3, ability: "Taunt. Deathrattle: Gain 3 health", emoji: "🌳", rarity: "common", color: "verdant-umbral" },
    { name: "Life Drain", cost: 2, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage. Restore 3 health", emoji: "💀", rarity: "common", color: "verdant-umbral" },
    { name: "Shadow Bloom", cost: 2, type: "creature", attack: 2, health: 2, ability: "Lifesteal. Gain 2 health when played", emoji: "🌸", rarity: "common", color: "verdant-umbral" },
    { name: "Eternal Guardian", cost: 5, type: "creature", attack: 4, health: 6, ability: "Taunt. Lifesteal. Regenerate", emoji: "🌳", rarity: "rare", color: "verdant-umbral" },
    { name: "Cycle of Death", cost: 4, type: "spell", attack: 0, health: 0, ability: "Destroy creature. Summon 4/4 Treant. Gain 5 health", emoji: "♻️", rarity: "rare", color: "verdant-umbral" },
    { name: "Necro Colossus", cost: 8, type: "creature", attack: 7, health: 9, ability: "Taunt. Lifesteal. Deathrattle: Summon all Verdant/Umbral creatures", emoji: "💀", rarity: "epic", color: "verdant-umbral" },
    { name: "Nature's Rebirth", cost: 6, type: "spell", attack: 0, health: 0, ability: "Return all creatures from graveyard. They gain +2/+2", emoji: "🌿", rarity: "epic", color: "verdant-umbral" },
    { name: "Gaia's Shadow", cost: 9, type: "creature", attack: 8, health: 10, ability: "Taunt. Lifesteal. Regenerate. Your creatures can't die. You gain 3 health each turn", emoji: "🌳", rarity: "legendary", color: "verdant-umbral" },

    // ==================== SPLASH-FRIENDLY CARDS (15 total - Countermeasure removed) ====================

    // CRIMSON SPLASH (4)
    { name: "Cauterize", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 4 damage to any target", splashBonus: "If this is your 3rd color, restore 3 health", splashFriendly: true, emoji: "🔥", rarity: "rare", color: "crimson" },
    { name: "Reckless Gambit", cost: 4, type: "spell", attack: 0, health: 0, ability: "Deal 6 damage to any target. Deal 2 damage to yourself", splashBonus: "If this is your 3rd color, don't take the self-damage", splashFriendly: true, emoji: "💥", rarity: "common", color: "crimson" },
    { name: "Battle Triage", cost: 2, type: "spell", attack: 0, health: 0, ability: "Restore 4 health. Draw a card if you're below 15 health", splashBonus: "If this is your 3rd color, always draw a card regardless of health", splashFriendly: true, emoji: "⚕️", rarity: "common", color: "crimson" },
    { name: "Flame Barrier", cost: 3, type: "spell", attack: 0, health: 0, ability: "Deal 3 damage to all enemy creatures", splashBonus: "If this is your 3rd color, also gain +5 armor this turn", splashFriendly: true, emoji: "🛡️", rarity: "rare", color: "crimson" },

    // AZURE SPLASH (3 - Countermeasure removed)
    { name: "Tactical Retreat", cost: 2, type: "spell", attack: 0, health: 0, ability: "Return target creature to its owner's hand", splashBonus: "If this is your 3rd color, draw a card", splashFriendly: true, emoji: "🌊", rarity: "common", color: "azure" },
    { name: "Mana Tide", cost: 3, type: "spell", attack: 0, health: 0, ability: "Draw 2 cards. Your spells cost 1 more next turn", splashBonus: "If this is your 3rd color, ignore the cost penalty", splashFriendly: true, emoji: "💧", rarity: "rare", color: "azure" },
    { name: "Frost Ward", cost: 2, type: "spell", attack: 0, health: 0, ability: "Freeze target creature", splashBonus: "If this is your 3rd color, also freeze 2 additional enemy creatures", splashFriendly: true, emoji: "❄️", rarity: "common", color: "azure" },

    // VERDANT SPLASH (4)
    { name: "Emergency Roots", cost: 4, type: "spell", attack: 0, health: 0, ability: "Summon a 3/3 Treant with Taunt", splashBonus: "If this is your 3rd color, also restore 5 health", splashFriendly: true, emoji: "🌱", rarity: "common", color: "verdant" },
    { name: "Life Graft", cost: 3, type: "spell", attack: 0, health: 0, ability: "Restore 8 health", splashBonus: "If this is your 3rd color, draw a card", splashFriendly: true, emoji: "💚", rarity: "rare", color: "verdant" },
    { name: "Primal Intervention", cost: 5, type: "spell", attack: 0, health: 0, ability: "Destroy target creature with 5+ attack. Costs 1 more for each creature you control", splashBonus: "If this is your 3rd color, ignore the cost penalty", splashFriendly: true, emoji: "🦖", rarity: "rare", color: "verdant" },
    { name: "Verdant Sanctuary", cost: 5, type: "spell", attack: 0, health: 0, ability: "All friendly creatures gain +2/+2. You take 2 damage", splashBonus: "If this is your 3rd color, don't take damage and also restore 3 health", splashFriendly: true, emoji: "🌳", rarity: "epic", color: "verdant" },

    // UMBRAL SPLASH (4)
    { name: "Desperation Pact", cost: 3, type: "spell", attack: 0, health: 0, ability: "Destroy target creature. Lose 3 health", splashBonus: "If this is your 3rd color, don't lose health", splashFriendly: true, emoji: "💀", rarity: "common", color: "umbral" },
    { name: "Soul Bargain", cost: 4, type: "spell", attack: 0, health: 0, ability: "Draw 3 cards. Lose 5 health", splashBonus: "If this is your 3rd color, only lose 2 health", splashFriendly: true, emoji: "📜", rarity: "rare", color: "umbral" },
    { name: "Shadow Escape", cost: 3, type: "spell", attack: 0, health: 0, ability: "Return target creature from your graveyard to your hand. It costs 2 more", splashBonus: "If this is your 3rd color, it doesn't cost more", splashFriendly: true, emoji: "👻", rarity: "rare", color: "umbral" },
    { name: "Plague Wind", cost: 7, type: "spell", attack: 0, health: 0, ability: "Deal 2 damage to all creatures. Lose 2 health for each enemy creature destroyed", splashBonus: "If this is your 3rd color, don't lose health", splashFriendly: true, emoji: "🦠", rarity: "epic", color: "umbral" },

    // COLORLESS FLEX (2)
    { name: "Prismatic Golem", cost: 6, type: "creature", attack: 5, health: 5, ability: "Battlecry: Gain random keyword (Charge/Flying/Taunt/Lifesteal)", emoji: "💎", rarity: "epic", color: "colorless" },
    { name: "The Nexus", cost: 8, type: "creature", attack: 6, health: 6, ability: "Has all four color identities. Your cards cost 1 less. Draw a card each turn", emoji: "🌈", rarity: "legendary", color: "colorless-crimson-azure-verdant-umbral" },

    // ==================== FULL ART VARIANTS (10) ====================
    // Premium aesthetic variants - SEPARATE from base cards
    // Only obtainable from Legendary Pack or Starter Bundle (5% chance each)
    // variant: "Full Art" makes them distinct instances
    // Worth 5x market value of base card
    
    { name: "Whale Shark", cost: 5, type: "creature", attack: 0, health: 10, ability: "Taunt. Splash 2. Can't attack", emoji: "🦈", rarity: "epic", color: "colorless", fullArt: true, variant: "Full Art" },
    { name: "Titan of Earth", cost: 10, type: "creature", attack: 10, health: 10, ability: "Taunt. Spell Shield. Regenerate", emoji: "⛰️", rarity: "legendary", color: "colorless", fullArt: true, variant: "Full Art" },
    { name: "Ragnar the Destroyer", cost: 10, type: "creature", attack: 10, health: 8, ability: "Trample. Attack Trigger: Deal damage equal to this creature's attack to all enemies", emoji: "👹", rarity: "legendary", color: "crimson", fullArt: true, variant: "Full Art" },
    { name: "Molten Golem", cost: 5, type: "creature", attack: 5, health: 4, ability: "Deathrattle: Deal 3 damage to all enemies", emoji: "🗿", rarity: "rare", color: "crimson", fullArt: true, variant: "Full Art" },
    { name: "Dream Walker", cost: 4, type: "creature", attack: 3, health: 4, ability: "Battlecry: Return creature to hand", emoji: "💭", rarity: "common", color: "azure", fullArt: true, variant: "Full Art" },
    { name: "Stormcaller Zephyr", cost: 8, type: "creature", attack: 6, health: 6, ability: "Flying. Spell Power +3. Whenever you cast a spell, draw a card and deal 2 damage to all enemies", emoji: "⛈️", rarity: "legendary", color: "azure", fullArt: true, variant: "Full Art" },
    { name: "Earthroot Elk", cost: 4, type: "creature", attack: 4, health: 4, ability: "Battlecry: Gain 3 health", emoji: "🦌", rarity: "common", color: "verdant", fullArt: true, variant: "Full Art" },
    { name: "Cenarius, Ancient Protector", cost: 8, type: "creature", attack: 8, health: 10, ability: "Taunt. Regenerate. All your Verdant creatures cost 2 less and have +2/+2", emoji: "🌳", rarity: "legendary", color: "verdant", fullArt: true, variant: "Full Art" },
    { name: "Void Walker", cost: 2, type: "creature", attack: 1, health: 3, ability: "Taunt. Lifesteal", emoji: "👤", rarity: "common", color: "umbral", fullArt: true, variant: "Full Art" },
    { name: "Shadow Infinity", cost: 10, type: "creature", attack: 10, health: 10, ability: "Lifesteal. Deal 7 damage to all enemies when attacking", emoji: "🌑", rarity: "legendary", color: "umbral", fullArt: true, variant: "Full Art" }

];

// Add variant field to cards that don't have it (defaults to 'standard')
ALL_CARDS.forEach(card => {
    if (!card.variant) {
        card.variant = 'standard';
    }
    if (!card.color) {
        card.color = 'colorless';
    }
});

// Create lookup objects
const cardsByName = {};
const cardsByRarity = {
    common: [],
    rare: [],
    epic: [],
    legendary: []
};

ALL_CARDS.forEach(card => {
    // Store all cards in cardsByName (including Full Art with special key)
    const key = card.variant === 'Full Art' ? `${card.name}|Full Art` : card.name;
    cardsByName[key] = card;
    
    // Only add standard variants to rarity pools
    // (Full Art should NOT appear in random pack generation - only via 5% upgrade)
    if (card.variant !== 'Full Art' && card.rarity && cardsByRarity[card.rarity]) {
        cardsByRarity[card.rarity].push(card);
    }
});

console.log(`✅ Backend cards loaded: ${ALL_CARDS.length} total cards`);
console.log(`🎴 Standard cards: ${ALL_CARDS.filter(c => c.variant !== 'Full Art').length}`);
console.log(`✨ Full Art variants: ${ALL_CARDS.filter(c => c.fullArt).length}`);
console.log(`🔢 Cards by rarity:`);
console.log(`   Common: ${cardsByRarity.common.length}`);
console.log(`   Rare: ${cardsByRarity.rare.length}`);
console.log(`   Epic: ${cardsByRarity.epic.length}`);
console.log(`   Legendary: ${cardsByRarity.legendary.length}`);

module.exports = {
    ALL_CARDS,
    cardsByName,
    cardsByRarity,
    CARD_PRICES: {
        common: 50,
        rare: 150,
        epic: 400,
        legendary: 1000
    },
    PACK_PRICES: {
        basic: { gold: 100, gems: 0, cards: 5, rates: { common: 0.65, rare: 0.25, epic: 0.08, legendary: 0.02 } },
        rare: { gold: 300, gems: 0, cards: 5, rates: { common: 0.40, rare: 0.40, epic: 0.15, legendary: 0.05 } },
        epic: { gold: 0, gems: 5, cards: 5, rates: { common: 0.20, rare: 0.40, epic: 0.30, legendary: 0.10 } },
        legendary: { gold: 0, gems: 10, cards: 5, rates: { common: 0, rare: 0.30, epic: 0.50, legendary: 0.20 } }
    }
};
