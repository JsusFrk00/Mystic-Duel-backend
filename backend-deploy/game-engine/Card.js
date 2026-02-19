// Server-side Card Class - Node.js compatible version of src/js/game/Card.js
class Card {
    constructor(template) {
        // Version check (only log once)
        if (!Card.versionLogged) {
            console.log('[VERSION] Server Card.js loaded - Version with state preservation fix 1.2');
            Card.versionLogged = true;
        }
        Object.assign(this, template);
        this.maxHealth = this.health;
        
        // Use nullish coalescing to preserve state from template while providing defaults
        // This fixes multiplayer sync issues while maintaining single-player compatibility
        this.tapped = this.tapped ?? false;
        this.id = this.id || Math.random().toString(36).substr(2, 9);
        this.frozen = this.frozen ?? false;
        this.hasAttackedThisTurn = this.hasAttackedThisTurn ?? false;
        this.doubleStrikeUsed = this.doubleStrikeUsed ?? false;
        this.windfuryUsed = this.windfuryUsed ?? false;
        this.canOnlyAttackCreatures = this.canOnlyAttackCreatures ?? false;
        this.stealth = this.stealth ?? false;
        this.divineShield = this.divineShield ?? false;
        this.spellShield = this.spellShield ?? false;
        this.vigilance = this.vigilance ?? false;
        this.immune = this.immune ?? false;
        this.tempImmune = this.tempImmune ?? false;
        this.taunt = this.taunt ?? false;
        this.instantKill = this.instantKill ?? false;
        this.enraged = this.enraged ?? false; // Track if Enrage has triggered
        
        // Initialize some abilities as properties
        if (this.ability === 'Taunt') {
            this.taunt = true;
        }
        if (this.ability === 'Vigilance') {
            this.vigilance = true;
        }
        if (this.ability === 'Stealth') {
            this.stealth = true;
        }
        if (this.ability === 'Divine Shield') {
            this.divineShield = true;
        }
        if (this.ability === 'Spell Shield') {
            this.spellShield = true;
        }
    }

    clone() {
        return new Card({
            name: this.name,
            cost: this.cost,
            type: this.type,
            attack: this.attack,
            health: this.maxHealth,
            ability: this.ability,
            emoji: this.emoji,
            rarity: this.rarity
        });
    }

    // Reset creature for new turn
    resetForTurn() {
        if (this.frozen) {
            this.frozen = false;
        } else {
            this.tapped = false;
        }
        this.hasAttackedThisTurn = false;
        this.doubleStrikeUsed = false;
        this.windfuryUsed = false;
        this.canOnlyAttackCreatures = false;
        this.tempImmune = false;
        
        // Handle regenerate
        if (this.ability === 'Regenerate') {
            this.health = this.maxHealth;
        }
    }

    // Apply damage to creature
    takeDamage(amount, source = null) {
        if (amount <= 0) return 0;
        
        if (this.immune || this.tempImmune) {
            return 0;
        }

        if (this.divineShield) {
            this.divineShield = false;
            return 0;
        }

        const actualDamage = Math.min(amount, this.health);
        this.health -= actualDamage;
        
        // Handle enrage - triggers only once, the first time creature takes damage
        if (this.ability === 'Enrage' && actualDamage > 0 && this.health > 0 && !this.enraged) {
            console.log(`[ENRAGE DEBUG] ${this.name} triggering Enrage!`);
            console.log(`[ENRAGE DEBUG] Attack before: ${this.attack}`);
            this.attack += 2;
            console.log(`[ENRAGE DEBUG] Attack after: ${this.attack}`);
            this.enraged = true; // Track that enrage has triggered
        } else if (this.ability === 'Enrage') {
            console.log(`[ENRAGE DEBUG] ${this.name} has Enrage but conditions not met:`);
            console.log(`[ENRAGE DEBUG] - actualDamage: ${actualDamage}`);
            console.log(`[ENRAGE DEBUG] - health: ${this.health}`);
            console.log(`[ENRAGE DEBUG] - already enraged: ${this.enraged}`);
        }

        return actualDamage;
    }

    // Check if creature can attack
    canAttack() {
        return !this.tapped && !this.frozen && !this.hasAttackedThisTurn;
    }

    // Mark as having attacked
    markAttacked() {
        // All creatures can only attack once per turn (except Windfury/Double Strike)
        this.hasAttackedThisTurn = true;
        
        // Vigilance creatures stay untapped but still marked as having attacked
        if (!this.vigilance) {
            this.tapped = true;
        }

        // Handle special attack abilities
        if (this.ability === 'Windfury') {
            if (!this.windfuryUsed) {
                // First attack with Windfury
                this.tapped = false; // Can attack again
                this.hasAttackedThisTurn = false; // Reset for second attack
                this.windfuryUsed = true;
            } else {
                // Second attack - now it's done
                this.hasAttackedThisTurn = true;
                if (!this.vigilance) {
                    this.tapped = true;
                }
            }
        } else if (this.ability === 'Double Strike' && !this.doubleStrikeUsed) {
            this.doubleStrikeUsed = true;
            this.hasAttackedThisTurn = false; // Can attack once more
            this.tapped = false;
        } else if (this.ability === 'Double Strike' && this.doubleStrikeUsed) {
            // Second strike done
            this.hasAttackedThisTurn = true;
            if (!this.vigilance) {
                this.tapped = true;
            }
        }
    }

    // Get display cost (for cards with cost reduction)
    getDisplayCost(spellsCount = 0) {
        if (this.ability === 'Costs less per spell') {
            return Math.max(0, this.cost - spellsCount);
        }
        return this.cost;
    }
}

module.exports = Card;