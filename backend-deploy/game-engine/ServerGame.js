// Server-side Game Engine - Node.js compatible version of Game.js
const Card = require('./Card.js');
const { ALL_CARDS, CARD_POWER } = require('./cards.js');

class ServerGame {
    constructor(roomId) {
        console.log('[VERSION] ServerGame.js loaded - Version with proper game logic 1.0');
        
        this.roomId = roomId;
        this.players = [
            {
                health: 30,
                maxHealth: 30,
                mana: 1,
                maxMana: 1,
                hand: [],
                deck: [],
                field: [],
                graveyard: [],
                spellsCount: 0,
                spellPower: 0
            },
            {
                health: 30,
                maxHealth: 30,
                mana: 0,  // Player 2 starts with 0 mana
                maxMana: 0,
                hand: [],
                deck: [],
                field: [],
                graveyard: [],
                spellsCount: 0,
                spellPower: 0
            }
        ];
        
        this.currentTurn = 0;  // Player 1 (index 0) starts
        this.turnNumber = 1;
        this.totalTurns = 1;
        this.gameOver = false;
        this.winner = null;
        this.gameLog = [];
    }

    initPlayerDeck(playerIndex, deckCards) {
        if (this.players[playerIndex].deck.length > 0) {
            console.log(`⚠️ Player ${playerIndex + 1} deck already initialized, skipping`);
            return false;
        }

        console.log(`📋 Initializing deck for Player ${playerIndex + 1}: ${deckCards.length} cards`);
        
        // Convert to Card instances and shuffle
        const cardInstances = deckCards.map(cardData => new Card(cardData));
        this.shuffleDeck(cardInstances);
        this.players[playerIndex].deck = cardInstances;
        
        // Draw initial hand of exactly 5 cards
        for (let i = 0; i < 5; i++) {
            this.drawCard(playerIndex);
        }
        
        console.log(`✅ Player ${playerIndex + 1} ready: ${this.players[playerIndex].hand.length} cards in hand`);
        
        // Check if both players ready
        const bothReady = this.players.every(p => p.deck.length > 0);
        return bothReady;
    }

    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    drawCard(playerIndex) {
        const player = this.players[playerIndex];
        if (player.deck.length > 0 && player.hand.length < 10) {
            const card = player.deck.shift();
            player.hand.push(card);
            console.log(`Player ${playerIndex + 1} drew: ${card.name}`);
            this.addLog(`Player ${playerIndex + 1} drew ${card.name}`);
        }
    }

    playCard(playerIndex, cardIndex, target = null, actualCost = null) {
        const player = this.players[playerIndex];
        
        if (cardIndex < 0 || cardIndex >= player.hand.length) {
            console.log(`❌ Invalid card index: ${cardIndex}`);
            return false;
        }

        const card = player.hand[cardIndex];
        const cost = actualCost !== null ? actualCost : this.getCardCost(card, playerIndex);
        
        console.log(`🃏 Player ${playerIndex + 1} playing ${card.name} (cost: ${cost})`);
        
        if (cost > player.mana) {
            console.log(`❌ Not enough mana! Cost: ${cost}, Available: ${player.mana}`);
            return false;
        }
        
        if (card.type === 'creature' && player.field.length >= 7) {
            console.log(`❌ Field is full!`);
            return false;
        }
        
        // Remove from hand and spend mana
        player.hand.splice(cardIndex, 1);
        player.mana -= cost;
        
        if (card.type === 'creature') {
            this.playCreature(playerIndex, card);
        } else if (card.type === 'spell') {
            player.spellsCount++;
            this.handleSpell(playerIndex, card, target);
            player.graveyard.push(card);
        }
        
        this.addLog(`Player ${playerIndex + 1} played ${card.name}`);
        return true;
    }

    playCreature(playerIndex, card) {
        const player = this.players[playerIndex];
        
        // CRITICAL: Proper summoning sickness logic from Game.js
        card.tapped = true;  // All creatures enter tapped by default
        card.frozen = false;
        card.hasAttackedThisTurn = false;
        card.doubleStrikeUsed = false;
        
        // Handle abilities that override summoning sickness
        if (card.ability === 'Rush') {
            card.tapped = false;
            card.canOnlyAttackCreatures = true;
            console.log(`  ${card.name} has Rush - can attack creatures immediately!`);
        } else if (card.ability === 'Quick' || card.ability === 'Charge' || card.ability === 'Haste') {
            card.tapped = false;
            console.log(`  ${card.name} can attack immediately (${card.ability})!`);
        } else {
            console.log(`  ${card.name} enters tapped (summoning sickness)`);
        }
        
        // Set ability properties
        if (card.ability === 'Vigilance') {
            card.vigilance = true;
        }
        if (card.ability === 'Taunt') {
            card.taunt = true;
        }
        if (card.ability === 'Divine Shield') {
            card.divineShield = true;
        }
        if (card.ability === 'Stealth') {
            card.stealth = true;
        }
        if (card.ability === 'Spell Shield') {
            card.spellShield = true;
        }
        
        player.field.push(card);
        
        // Handle enter-play abilities
        this.handleEnterPlayAbilities(playerIndex, card);
        
        // Update spell power
        this.updateSpellPower();
    }

    handleEnterPlayAbilities(playerIndex, card) {
        const ability = card.ability;
        
        if (ability === 'Draw a card' || ability === 'Draw 2 cards' || ability === 'Draw 3 cards') {
            const drawCount = parseInt(ability.match(/\d+/)?.[0] || 1);
            for (let i = 0; i < drawCount; i++) {
                this.drawCard(playerIndex);
            }
            console.log(`  Drew ${drawCount} card(s) from ${card.name}'s ability`);
        } else if (ability === 'Battlecry: Damage') {
            const opponent = this.players[1 - playerIndex];
            opponent.health -= 2;
            this.addLog(`${card.name}'s Battlecry deals 2 damage!`);
            console.log(`  Battlecry dealt 2 damage to opponent`);
            this.checkGameOver();
        } else if (ability === 'AOE damage') {
            const opponent = this.players[1 - playerIndex];
            let totalDamage = 0;
            opponent.field.forEach(creature => {
                const damage = creature.takeDamage(2);
                totalDamage += damage;
                if (damage > 0) {
                    this.addLog(`${creature.name} takes ${damage} AOE damage!`);
                }
            });
            this.checkCreatureDeaths();
            console.log(`  AOE dealt ${totalDamage} total damage`);
        } else if (ability === 'Summon skeletons') {
            const player = this.players[playerIndex];
            for (let i = 0; i < 2 && player.field.length < 7; i++) {
                const skeleton = new Card({
                    name: "Skeleton",
                    cost: 0,
                    type: "creature",
                    attack: 1,
                    health: 1,
                    ability: "",
                    emoji: "💀",
                    rarity: "common"
                });
                skeleton.tapped = true;
                player.field.push(skeleton);
            }
            this.addLog("Summoned 2 Skeleton tokens!");
        } else if (ability === 'Spell Power +1') {
            this.updateSpellPower();
            console.log(`  Spell Power increased for Player ${playerIndex + 1}`);
        }
    }

    updateSpellPower() {
        // Calculate spell power from creatures on field
        this.players[0].spellPower = this.players[0].field.filter(c => c.ability === 'Spell Power +1').length;
        this.players[1].spellPower = this.players[1].field.filter(c => c.ability === 'Spell Power +1').length;
    }

    handleSpell(playerIndex, card, target = null) {
        const ability = card.ability;
        const player = this.players[playerIndex];
        const opponent = this.players[1 - playerIndex];
        
        console.log(`🎯 Applying spell: ${card.name} - ${ability}`);
        
        if (ability.includes('Deal')) {
            const baseDamage = parseInt(ability.match(/\d+/)[0]);
            const spellPower = player.spellPower;
            const damage = baseDamage + spellPower;
            
            if (target === 'opponent' || target === undefined || target === -1) {
                opponent.health -= damage;
                this.addLog(`${card.name} deals ${damage} damage to opponent!`);
                console.log(`  Spell dealt ${damage} damage to opponent`);
                this.checkGameOver();
            } else if (typeof target === 'number' && target >= 0 && target < opponent.field.length) {
                const targetCreature = opponent.field[target];
                const actualDamage = targetCreature.takeDamage(damage);
                this.addLog(`${card.name} deals ${actualDamage} damage to ${targetCreature.name}!`);
                console.log(`  Spell dealt ${actualDamage} damage to ${targetCreature.name}`);
                
                if (ability.includes('Freeze')) {
                    targetCreature.frozen = true;
                    this.addLog(`${targetCreature.name} is frozen!`);
                }
                
                this.checkCreatureDeaths();
            }
        } else if (ability.includes('Restore')) {
            const heal = parseInt(ability.match(/\d+/)[0]);
            player.health = Math.min(player.maxHealth, player.health + heal);
            this.addLog(`Restored ${heal} health!`);
            console.log(`  Restored ${heal} health to Player ${playerIndex + 1}`);
        } else if (ability === 'All allies +1/+1' || ability === 'All allies +2/+2') {
            const buff = ability.includes('+2/+2') ? 2 : 1;
            player.field.forEach(creature => {
                creature.attack += buff;
                creature.health += buff;
                creature.maxHealth += buff;
            });
            this.addLog(`All allies get +${buff}/+${buff}!`);
            console.log(`  All Player ${playerIndex + 1} creatures buffed +${buff}/+${buff}`);
        } else if (ability.includes('Draw')) {
            const drawCount = parseInt(ability.match(/\d+/)?.[0] || 2);
            for (let i = 0; i < drawCount; i++) {
                this.drawCard(playerIndex);
            }
            console.log(`  Drew ${drawCount} cards`);
        }
    }

    getCardCost(card, playerIndex) {
        let cost = card.cost;
        if (card.ability === 'Costs less per spell') {
            const spellsCount = this.players[playerIndex].spellsCount;
            cost = Math.max(0, card.cost - spellsCount);
        }
        return cost;
    }

    processAttack(playerIndex, attackerIndex, targetIndex) {
        const player = this.players[playerIndex];
        const opponent = this.players[1 - playerIndex];
        
        console.log(`⚔️ Player ${playerIndex + 1} attacking with creature ${attackerIndex} at target ${targetIndex}`);
        
        if (attackerIndex < 0 || attackerIndex >= player.field.length) {
            console.log(`❌ Invalid attacker index: ${attackerIndex}`);
            return false;
        }

        const attacker = player.field[attackerIndex];
        
        // CRITICAL: Use Card class canAttack method
        if (!attacker.canAttack()) {
            console.log(`❌ ${attacker.name} cannot attack: tapped=${attacker.tapped}, frozen=${attacker.frozen}, hasAttacked=${attacker.hasAttackedThisTurn}`);
            this.addLog(`${attacker.name} cannot attack right now!`);
            return false;
        }
        
        // Check Rush restriction for face attacks
        if (targetIndex === -1 && attacker.canOnlyAttackCreatures) {
            console.log(`❌ ${attacker.name} with Rush can only attack creatures this turn!`);
            this.addLog(`${attacker.name} with Rush can only attack creatures this turn!`);
            return false;
        }
        
        // Check Taunt creatures
        const taunts = opponent.field.filter(c => c.ability === 'Taunt' || c.taunt);
        if (taunts.length > 0) {
            if (targetIndex === -1) {
                console.log(`❌ Must attack Taunt creatures first!`);
                this.addLog(`Must attack Taunt creatures first!`);
                return false;
            } else if (targetIndex >= 0 && targetIndex < opponent.field.length) {
                const target = opponent.field[targetIndex];
                if (!target.taunt && target.ability !== 'Taunt') {
                    console.log(`❌ Must attack Taunt creatures first!`);
                    this.addLog(`Must attack Taunt creatures first!`);
                    return false;
                }
            }
        }
        
        // Validate creature target
        if (targetIndex >= 0 && targetIndex < opponent.field.length) {
            const target = opponent.field[targetIndex];
            
            // Check if target can be attacked
            if (!target.tapped && !target.taunt && target.ability !== 'Taunt') {
                console.log(`❌ Cannot attack ${target.name} - defending creatures must be tapped or have Taunt!`);
                this.addLog(`Cannot attack defending creatures!`);
                return false;
            }
            
            // Check Stealth
            if (target.stealth) {
                console.log(`❌ Cannot attack ${target.name} - stealthed!`);
                this.addLog(`Cannot attack stealthed creatures!`);
                return false;
            }
            
            // Check Flying
            if (target.ability === 'Flying') {
                if (attacker.ability !== 'Flying' && attacker.ability !== 'Reach') {
                    console.log(`❌ Cannot reach ${target.name} - need Flying or Reach!`);
                    this.addLog(`Cannot reach flying creatures without Flying or Reach!`);
                    return false;
                }
            }
        }
        
        // Remove stealth when attacking
        if (attacker.stealth) {
            attacker.stealth = false;
            this.addLog(`${attacker.name} loses stealth!`);
        }
        
        // CRITICAL: Use Card class markAttacked method
        attacker.markAttacked();
        console.log(`✅ ${attacker.name} marked as having attacked this turn`);
        
        if (targetIndex === -1) {
            // Attack opponent directly
            const damage = attacker.attack || 0;
            opponent.health -= damage;
            this.addLog(`${attacker.name} attacks for ${damage} damage!`);
            console.log(`  Direct attack: ${damage} damage to Player ${(1 - playerIndex) + 1}`);
            
            // Handle lifesteal
            if (attacker.ability?.includes('Lifesteal') || attacker.ability?.includes('Lifelink')) {
                player.health = Math.min(player.maxHealth, player.health + damage);
                this.addLog(`Lifesteal heals for ${damage}!`);
            }
            
            this.checkGameOver();
        } else if (targetIndex >= 0 && targetIndex < opponent.field.length) {
            // Creature combat using Game.js logic
            this.creatureCombat(playerIndex, attacker, opponent.field[targetIndex]);
        }
        
        return true;
    }

    creatureCombat(attackerOwner, attacker, target) {
        console.log(`[COMBAT] ${attacker.name} (${attacker.attack}/${attacker.health}) attacks ${target.name} (${target.attack}/${target.health})`);
        
        const attackerPlayer = this.players[attackerOwner];
        const defenderPlayer = this.players[1 - attackerOwner];
        
        if (target.immune || target.tempImmune) {
            this.addLog(`${target.name} is Immune!`);
            return;
        }
        
        let attackerDamage = attacker.attack;
        let targetDamage = target.attack;
        
        // Handle Divine Shield
        if (target.divineShield) {
            target.divineShield = false;
            this.addLog(`${target.name}'s Divine Shield absorbs the damage!`);
            attackerDamage = 0;
        }
        
        if (attacker.divineShield && targetDamage > 0) {
            attacker.divineShield = false;
            this.addLog(`${attacker.name}'s Divine Shield absorbs the damage!`);
            targetDamage = 0;
        }
        
        // Handle First Strike
        if (attacker.ability === 'First Strike' && !target.ability?.includes('First Strike')) {
            const damageDealt = target.takeDamage(attackerDamage);
            if (target.ability === 'Enrage' && target.health > 0) {
                this.addLog(`${target.name} enrages! +2 attack!`);
            }
            if (target.health > 0) {
                const damageTaken = attacker.takeDamage(targetDamage);
                if (attacker.ability === 'Enrage' && attacker.health > 0) {
                    this.addLog(`${attacker.name} enrages! +2 attack!`);
                }
            }
        } else if (target.ability === 'First Strike' && !attacker.ability?.includes('First Strike')) {
            const damageTaken = attacker.takeDamage(targetDamage);
            if (attacker.ability === 'Enrage' && attacker.health > 0) {
                this.addLog(`${attacker.name} enrages! +2 attack!`);
            }
            if (attacker.health > 0) {
                const damageDealt = target.takeDamage(attackerDamage);
                if (target.ability === 'Enrage' && target.health > 0) {
                    this.addLog(`${target.name} enrages! +2 attack!`);
                }
            }
        } else {
            // Normal combat - both take damage simultaneously
            const targetDamageDealt = target.takeDamage(attackerDamage);
            const attackerDamageTaken = attacker.takeDamage(targetDamage);
            
            // Check if Enrage triggered
            if (target.ability === 'Enrage' && target.health > 0 && targetDamageDealt > 0) {
                this.addLog(`${target.name} enrages! +2 attack!`);
            }
            if (attacker.ability === 'Enrage' && attacker.health > 0 && attackerDamageTaken > 0) {
                this.addLog(`${attacker.name} enrages! +2 attack!`);
            }
        }
        
        // Handle Poison/Deathtouch/Instant kill
        if ((attacker.ability === 'Poison' || attacker.ability === 'Deathtouch' || 
             attacker.ability === 'Instant kill' || attacker.instantKill) && attackerDamage > 0) {
            target.health = 0;
            this.addLog(`${attacker.name}'s deadly ability destroys ${target.name}!`);
        }
        
        if ((target.ability === 'Poison' || target.ability === 'Deathtouch') && targetDamage > 0) {
            attacker.health = 0;
            this.addLog(`${target.name}'s deadly ability destroys ${attacker.name}!`);
        }
        
        // Handle Freeze enemy
        if (attacker.ability === 'Freeze enemy' && target.health > 0) {
            target.frozen = true;
            this.addLog(`${target.name} is frozen!`);
        }
        
        // Handle Trample
        if (attacker.ability === 'Trample' && target.health <= 0) {
            const excess = Math.abs(target.health);
            if (excess > 0) {
                defenderPlayer.health -= excess;
                this.addLog(`Trample deals ${excess} excess damage!`);
                this.checkGameOver();
            }
        }
        
        // Handle Lifesteal/Lifelink
        if ((attacker.ability?.includes('Lifesteal') || attacker.ability?.includes('Lifelink')) && attackerDamage > 0) {
            const healAmount = Math.min(attackerDamage, target.maxHealth || attackerDamage);
            attackerPlayer.health = Math.min(attackerPlayer.maxHealth, attackerPlayer.health + healAmount);
            this.addLog(`Lifesteal heals for ${healAmount}!`);
        }
        
        this.addLog(`${attacker.name} battles ${target.name}!`);
        this.checkCreatureDeaths();
    }

    checkCreatureDeaths() {
        // Check both players' fields for dead creatures
        for (let playerIndex = 0; playerIndex < 2; playerIndex++) {
            const player = this.players[playerIndex];
            player.field = player.field.filter(creature => {
                if (creature.health <= 0) {
                    this.addLog(`${creature.name} was destroyed!`);
                    
                    // Handle Deathrattle: Draw
                    if (creature.ability === 'Deathrattle: Draw') {
                        this.drawCard(playerIndex);
                        this.addLog("Deathrattle: Drew a card!");
                    }
                    
                    // Handle Resurrect
                    if (creature.ability === 'Resurrect') {
                        const newCard = new Card({
                            name: creature.name,
                            cost: creature.cost,
                            type: creature.type,
                            attack: creature.attack,
                            health: creature.maxHealth,
                            ability: creature.ability,
                            emoji: creature.emoji,
                            rarity: creature.rarity
                        });
                        if (player.hand.length < 10) {
                            player.hand.push(newCard);
                            this.addLog(`${creature.name} returns to hand!`);
                        }
                    }
                    
                    // Add to graveyard
                    player.graveyard.push(creature);
                    return false;
                }
                return true;
            });
        }
        
        // Update spell power after deaths
        this.updateSpellPower();
    }

    endTurn(playerIndex) {
        if (this.currentTurn !== playerIndex) {
            console.log(`⚠️ Player ${playerIndex + 1} tried to end turn but it's Player ${this.currentTurn + 1}'s turn`);
            return false;
        }
        
        console.log(`🔄 Player ${playerIndex + 1} ending turn`);
        
        // Remove temporary immunity
        this.players.forEach(player => {
            player.field.forEach(creature => {
                creature.tempImmune = false;
            });
        });
        
        // Switch turns
        this.currentTurn = 1 - this.currentTurn;
        this.totalTurns++;
        
        // Increment turn number every 2 turns (one full round)
        if (this.currentTurn === 0) {
            this.turnNumber++;
        }
        
        // CRITICAL: Proper turn management from Game.js
        this.startNewTurn(this.currentTurn);
        
        console.log(`➡️ Now Player ${this.currentTurn + 1}'s turn (Turn ${this.turnNumber})`);
        return true;
    }

    startNewTurn(playerIndex) {
        const player = this.players[playerIndex];
        
        // Increase mana
        player.maxMana = Math.min(10, player.maxMana + 1);
        player.mana = player.maxMana;
        
        // CRITICAL: Only reset creatures belonging to the ACTIVE player
        player.field.forEach(creature => {
            creature.resetForTurn();  // Use Card class method
            console.log(`  ${creature.name} reset for Player ${playerIndex + 1}'s turn`);
        });
        
        // Handle Burn damage from opponent's creatures
        const opponent = this.players[1 - playerIndex];
        const burnCreatures = opponent.field.filter(c => c.ability === 'Burn');
        if (burnCreatures.length > 0) {
            const burnDamage = burnCreatures.length;
            player.health -= burnDamage;
            this.addLog(`Burn deals ${burnDamage} damage to Player ${playerIndex + 1}!`);
            console.log(`  🔥 Burn damage: ${burnDamage} to Player ${playerIndex + 1}`);
            this.checkGameOver();
        }
        
        // Draw card for new turn
        this.drawCard(playerIndex);
        
        this.addLog(`Player ${playerIndex + 1}'s turn begins!`);
        console.log(`Turn ${this.turnNumber}: Player ${playerIndex + 1} has ${player.mana}/${player.maxMana} mana`);
    }

    checkGameOver() {
        for (let i = 0; i < 2; i++) {
            if (this.players[i].health <= 0 && !this.gameOver) {
                this.gameOver = true;
                this.winner = 1 - i; // The other player wins
                console.log(`🏆 Player ${this.winner + 1} wins! Player ${i + 1} has ${this.players[i].health} health`);
                this.addLog(`Player ${this.winner + 1} wins!`);
                return true;
            }
        }
        return false;
    }

    addLog(message) {
        this.gameLog.push({
            message: message,
            timestamp: Date.now(),
            turn: this.turnNumber,
            activePlayer: this.currentTurn + 1
        });
        
        // Keep only last 20 log entries
        if (this.gameLog.length > 20) {
            this.gameLog = this.gameLog.slice(-20);
        }
        
        console.log(`[GAME LOG] ${message}`);
    }

    // Get current game state for client sync
    getGameState() {
        return {
            players: this.players.map(player => ({
                health: player.health,
                maxHealth: player.maxHealth,
                mana: player.mana,
                maxMana: player.maxMana,
                hand: player.hand,
                deck: { length: player.deck.length }, // Hide deck contents
                field: player.field,
                graveyard: player.graveyard,
                spellsCount: player.spellsCount,
                spellPower: player.spellPower
            })),
            currentTurn: this.currentTurn,
            turnNumber: this.turnNumber,
            totalTurns: this.totalTurns,
            gameOver: this.gameOver,
            winner: this.winner,
            gameLog: this.gameLog.slice(-5) // Send last 5 log entries
        };
    }

    // Get state for specific player (hides opponent's hand)
    getPlayerState(playerIndex) {
        const state = this.getGameState();
        const opponentIndex = 1 - playerIndex;
        
        // Hide opponent's hand details
        state.players[opponentIndex].hand = { 
            length: this.players[opponentIndex].hand.length 
        };
        
        return state;
    }
}

module.exports = ServerGame;