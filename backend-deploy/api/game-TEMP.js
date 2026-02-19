const express = require('express');
const router = express.Router();
const { get, run, all } = require('../database');
const { verifyToken } = require('../auth');

router.use(verifyToken);

// v3.0: Validate deck color rules
function validateDeckColors(deck) {
    // RULE 1: Exactly 30 cards
    if (deck.length !== 30) {
        return { valid: false, error: 'Deck must have exactly 30 cards' };
    }
    
    // Count main colors and splash cards
    let mainColors = new Set();
    let splashCards = [];
    let cardCount = {};
    
    deck.forEach(card => {
        // Track card counts (max 2 regular, max 1 legendary)
        if (!cardCount[card.name]) cardCount[card.name] = 0;
        cardCount[card.name]++;
        
        if (card.rarity === 'legendary' && cardCount[card.name] > 1) {
            return { valid: false, error: `Too many copies of legendary ${card.name}` };
        }
        if (card.rarity !== 'legendary' && cardCount[card.name] > 2) {
            return { valid: false, error: `Too many copies of ${card.name} (max 2)` };
        }
        
        // Skip colorless
        if (card.color === 'colorless') return;
        
        // Categorize by splash vs main
        if (card.splashFriendly) {
            splashCards.push(card);
        } else {
            const colors = (card.color || '').split('-');
            colors.forEach(c => mainColors.add(c));
        }
    });
    
    // RULE 2: Max 2 main colors
    if (mainColors.size > 2) {
        return { 
            valid: false, 
            error: `Too many colors: ${Array.from(mainColors).join(', ')}. Max 2 allowed.` 
        };
    }
