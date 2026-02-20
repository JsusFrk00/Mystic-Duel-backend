// Server-side Cards Database - Node.js compatible version of src/js/data/cards.js

const ALL_CARDS = [
    // Common creatures with abilities
    { name: "Goblin Scout", cost: 1, type: "creature", attack: 2, health: 1, ability: "Quick", emoji: "👺", rarity: "common" },
    { name: "Fire Sprite", cost: 1, type: "creature", attack: 1, health: 2, ability: "Burn", emoji: "🔥", rarity: "common" },
    { name: "Shield Bearer", cost: 2, type: "creature", attack: 1, health: 4, ability: "Taunt", emoji: "🛡️", rarity: "common" },
    { name: "Forest Wolf", cost: 2, type: "creature", attack: 3, health: 2, ability: "Rush", emoji: "🐺", rarity: "common" },
    { name: "Apprentice Mage", cost: 2, type: "creature", attack: 2, health: 2, ability: "Spell Power +1", emoji: "🧙", rarity: "common" },
    { name: "Skeleton Warrior", cost: 1, type: "creature", attack: 1, health: 1, ability: "Deathrattle: Draw", emoji: "💀", rarity: "common" },
    { name: "Guard Dog", cost: 2, type: "creature", attack: 2, health: 3, ability: "Taunt", emoji: "🐕", rarity: "common" },
    { name: "Archer", cost: 2, type: "creature", attack: 2, health: 2, ability: "Reach", emoji: "🏹", rarity: "common" },
    { name: "Peasant", cost: 1, type: "creature", attack: 1, health: 1, ability: "", emoji: "👨‍🌾", rarity: "common" },
    { name: "Squire", cost: 1, type: "creature", attack: 2, health: 1, ability: "", emoji: "⚔️", rarity: "common" },
    { name: "Militia", cost: 3, type: "creature", attack: 3, health: 3, ability: "", emoji: "🗡️", rarity: "common" },
    { name: "Bear", cost: 3, type: "creature", attack: 3, health: 3, ability: "", emoji: "🐻", rarity: "common" },
    { name: "Wolf Pup", cost: 2, type: "creature", attack: 2, health: 2, ability: "", emoji: "🐺", rarity: "common" },
    { name: "Forest Sprite", cost: 1, type: "creature", attack: 1, health: 1, ability: "", emoji: "🧚", rarity: "common" },
    
    // Common spells with abilities
    { name: "Arcane Missile", cost: 1, type: "spell", ability: "Deal 2 damage", emoji: "✨", rarity: "common" },
    { name: "Lightning Bolt", cost: 2, type: "spell", ability: "Deal 3 damage", emoji: "⚡", rarity: "common" },
    { name: "Healing Touch", cost: 1, type: "spell", ability: "Restore 3 health", emoji: "💚", rarity: "common" },
    { name: "Frost Bolt", cost: 2, type: "spell", ability: "Deal 3 damage, Freeze", emoji: "❄️", rarity: "common" },
    { name: "Battle Cry", cost: 2, type: "spell", ability: "All allies +1/+1", emoji: "📯", rarity: "common" },
    { name: "Draw Power", cost: 2, type: "spell", ability: "Draw 2 cards", emoji: "📜", rarity: "common" },
    
    // Rare creatures with abilities
    { name: "Mystic Owl", cost: 3, type: "creature", attack: 2, health: 3, ability: "Draw a card", emoji: "🦉", rarity: "rare" },
    { name: "Shadow Assassin", cost: 3, type: "creature", attack: 4, health: 2, ability: "Stealth", emoji: "🥷", rarity: "rare" },
    { name: "Wind Dancer", cost: 3, type: "creature", attack: 3, health: 3, ability: "Flying", emoji: "🌪️", rarity: "rare" },
    { name: "Stone Golem", cost: 4, type: "creature", attack: 3, health: 6, ability: "Taunt", emoji: "🗿", rarity: "rare" },
    { name: "Ice Elemental", cost: 4, type: "creature", attack: 3, health: 5, ability: "Freeze enemy", emoji: "❄️", rarity: "rare" },
    { name: "Phoenix", cost: 4, type: "creature", attack: 4, health: 3, ability: "Resurrect", emoji: "🦅", rarity: "rare" },
    { name: "Crystal Guardian", cost: 5, type: "creature", attack: 4, health: 5, ability: "Spell Shield", emoji: "💎", rarity: "rare" },
    { name: "Knight", cost: 4, type: "creature", attack: 4, health: 4, ability: "Vigilance", emoji: "♞", rarity: "rare" },
    { name: "Berserker", cost: 3, type: "creature", attack: 3, health: 2, ability: "Enrage", emoji: "🪓", rarity: "rare" },
    { name: "Holy Priest", cost: 3, type: "creature", attack: 2, health: 4, ability: "Lifesteal", emoji: "✨", rarity: "rare" },
    
    // Rare spells
    { name: "Lightning Storm", cost: 3, type: "spell", ability: "Deal 4 damage", emoji: "⚡", rarity: "rare" },
    { name: "Healing Potion", cost: 2, type: "spell", ability: "Restore 5 health", emoji: "🧪", rarity: "rare" },
    { name: "Mass Blessing", cost: 3, type: "spell", ability: "All allies +2/+2", emoji: "✨", rarity: "rare" },
    { name: "Arcane Intellect", cost: 3, type: "spell", ability: "Draw 3 cards", emoji: "📚", rarity: "rare" },
    
    // Epic creatures with abilities
    { name: "Fire Drake", cost: 5, type: "creature", attack: 5, health: 4, ability: "Flying", emoji: "🐲", rarity: "epic" },
    { name: "Dark Knight", cost: 5, type: "creature", attack: 6, health: 5, ability: "Lifesteal", emoji: "⚔️", rarity: "epic" },
    { name: "Ancient Tree", cost: 6, type: "creature", attack: 4, health: 7, ability: "Regenerate", emoji: "🌳", rarity: "epic" },
    { name: "Storm Caller", cost: 6, type: "creature", attack: 5, health: 5, ability: "AOE damage", emoji: "⛈️", rarity: "epic" },
    { name: "Vampire Lord", cost: 7, type: "creature", attack: 6, health: 6, ability: "Lifesteal", emoji: "🦇", rarity: "epic" },
    { name: "Angel of War", cost: 6, type: "creature", attack: 5, health: 6, ability: "Flying, Divine Shield", emoji: "👼", rarity: "epic" },
    { name: "Demon Hunter", cost: 5, type: "creature", attack: 7, health: 3, ability: "First Strike", emoji: "😈", rarity: "epic" },
    
    // Epic spells
    { name: "Meteor", cost: 5, type: "spell", ability: "Deal 6 damage", emoji: "☄️", rarity: "epic" },
    { name: "Mass Heal", cost: 4, type: "spell", ability: "Restore 8 health", emoji: "💫", rarity: "epic" },
    { name: "Polymorph", cost: 4, type: "spell", ability: "Silence", emoji: "🐑", rarity: "epic" },
    { name: "Mind Control", cost: 6, type: "spell", ability: "Steal creature", emoji: "🧠", rarity: "epic" },
    
    // Legendary creatures
    { name: "Dragon Emperor", cost: 9, type: "creature", attack: 9, health: 9, ability: "Destroy all", emoji: "🐉", rarity: "legendary" },
    { name: "Time Mage", cost: 8, type: "creature", attack: 4, health: 8, ability: "Extra turn", emoji: "⏰", rarity: "legendary" },
    { name: "Chaos Lord", cost: 7, type: "creature", attack: 8, health: 6, ability: "Random chaos", emoji: "🌀", rarity: "legendary" },
    
    // Legendary spells
    { name: "Time Warp", cost: 8, type: "spell", ability: "Extra turn", emoji: "🌀", rarity: "legendary" },
    { name: "Apocalypse", cost: 8, type: "spell", ability: "Destroy all", emoji: "💥", rarity: "legendary" }
];

const CARD_POWER = {
    'common': 1,
    'rare': 2,
    'epic': 4,
    'legendary': 8
};

module.exports = {
    ALL_CARDS,
    CARD_POWER
};