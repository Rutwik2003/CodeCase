# Mission 2+ Debugging Guide

## Issue Analysis
The user reported that Mission 1 works correctly, but Mission 2+ are "broken again". This guide helps debug the exact issue.

## Enhanced Debug Logging
I've added comprehensive console logging to track:
1. **Mission transitions** - When moving from Mission 1 → Mission 2 → Mission 3
2. **Code reset logic** - When broken code gets loaded for each mission
3. **Validation results** - Detailed validation for each condition
4. **Mission 2 specific debugging** - CSS display property tracking

## Testing Steps

### Step 1: Open Browser Console
1. Open http://localhost:5173/
2. Open Developer Tools (F12)
3. Go to Console tab
4. Clear console (Ctrl+L)

### Step 2: Start Detective Case
1. Click on "The Vanishing Blogger" case
2. Skip through cinematic slides (or watch them)
3. Look for this console log: `🔄 RESETTING CODE FOR MISSION: Mission 1`

### Step 3: Complete Mission 1
1. **Remove the `hidden` attribute** from the div with class "hidden-message"
2. **Replace `<center>` tags** with `<header>` and `<footer>`
3. **Ensure proper CSS styling** exists (background, border, animation, etc.)
4. Watch console for: `🎮 Mission validation` showing completed conditions
5. When all 3 conditions pass, click **"Next Mission"**

### Step 4: Debug Mission 2 Transition
1. Look for console log: `🚀 MISSION TRANSITION: from Mission 1 to Mission 2`
2. Look for console log: `🔄 RESETTING CODE FOR MISSION: Mission 2`
3. Verify Mission 2 broken code loads (should see `#insta-clue { display: none; }`)

### Step 5: Test Mission 2 Validation
1. **Find the CSS rule**: `#insta-clue { display: none; }`
2. **Change it to**: `#insta-clue { display: block; }`
3. **Add some styling** (border, background, animation, etc.)
4. Watch console for `🔍 MISSION 2 DEBUGGING` logs
5. Check validation results

## Expected Behavior

### Mission 1 (Working ✅)
- Starts with broken HTML containing `<center>` tags and `hidden` attribute
- User fixes the issues
- Validation passes and mission completes

### Mission 2 (Should Work ✅)  
- Starts with `#insta-clue { display: none; }` in CSS
- Instagram evidence section is hidden
- User changes to `display: block`
- User adds styling
- Validation should pass

### Mission 3 (Should Work ✅)
- Starts with `#address-clue { visibility: hidden; }` and `<font>` tags
- User changes to `visibility: visible`
- User replaces `<font>` tags with modern CSS
- Validation should pass

## Common Issues

### Issue 1: Validation Too Strict
- **Symptom**: Correct changes don't pass validation
- **Debug**: Check console logs for condition failures
- **Fix**: Adjust validation logic in `detectiveMissionValidator.ts`

### Issue 2: Code Reset Problems
- **Symptom**: Code doesn't reset properly between missions
- **Debug**: Look for `🔄 RESETTING CODE FOR MISSION` logs
- **Fix**: Check `shouldResetCode` state management

### Issue 3: Mission Data Corruption
- **Symptom**: Missions missing fields or malformed
- **Debug**: Check `brokenHtml` and `brokenCss` lengths
- **Fix**: Verify `cases.ts` mission structure

### Issue 4: UI/UX Confusion
- **Symptom**: Users don't understand what to fix
- **Debug**: Check `aiHints` and `clueUnlockCondition` text
- **Fix**: Improve mission instructions and hints

## Validation Logic Reference

### Mission 2 Conditions
1. **"Change display: none to display: block on #insta-clue element"**
   - Checks: CSS contains `#insta-clue` AND `display: block` AND NOT `display: none`
   
2. **"Style the revealed Instagram evidence section appropriately"**
   - Checks: CSS contains styling keywords (border, background, animation, etc.)

### Mission 3 Conditions  
1. **"Change visibility: hidden to visibility: visible on #address-clue"**
   - Checks: CSS contains `#address-clue` AND `visibility: visible` AND NOT `visibility: hidden`

2. **"Replace <font> tags with modern CSS styling"**
   - Checks: HTML contains NO `<font>` tags AND content preserved

3. **"Apply proper styling to the revealed location information"**
   - Checks: CSS contains styling for address elements

## Next Steps
1. Test with these debug logs enabled
2. Identify exactly where the issue occurs
3. Report specific console output showing the problem
4. Make targeted fixes based on debug data
