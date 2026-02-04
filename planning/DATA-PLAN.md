# Data Plan for Yoga Shop Agent

## External Data Requirements
1. List of available yoga classes with titles, prices, and IDs
2. List of available yoga products (study materials) with names, prices, and IDs
3. Class preview URLs for free previews
4. Full class content URLs (requires payment)
5. Payment processing for unlocking content

## User Profile
**Does this agent collect user profile data?** No

This agent tracks purchases but does not collect user profile preferences.

## Data Sources

### 1. Yoga Classes List
**Tool**: `browse_classes` from `@tools/2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop`
**Test Command**: `dreamer call-tool -s 2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop -n browse_classes '{}'`
**Sample Arguments**: `{}`
**Sample Output**:
```json
{
  "classes": [
    {"id": "1", "title": "Morning Flow", "price": "$1.00"},
    {"id": "2", "title": "Power Yoga", "price": "$2.00"},
    {"id": "3", "title": "Flexibility", "price": "$3.00"}
  ]
}
```

**Processing Strategy**:
- Direct property access, no LLM processing needed
- Cache results in database (1.3s latency observed)

### 2. Yoga Products List
**Tool**: `browse_products` from `@tools/2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop`
**Test Command**: `dreamer call-tool -s 2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop -n browse_products '{}'`
**Sample Arguments**: `{}`
**Sample Output**:
```json
{
  "products": [
    {"id": "mat", "name": "Yoga Mat", "price_display": "$29.99"},
    {"id": "strap", "name": "Yoga Strap", "price_display": "$12.99"}
  ]
}
```

**Processing Strategy**:
- Direct property access, no LLM processing needed
- Cache results in database (1.1s latency observed)

### 3. Class Preview
**Tool**: `get_class_preview` from `@tools/2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop`
**Test Command**: `dreamer call-tool -s 2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop -n get_class_preview '{"classId":"1"}'`
**Sample Arguments**: `{"classId": "1"}`
**Sample Output**:
```json
{"preview_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
```

**Processing Strategy**:
- Return preview URL directly for display
- No caching needed (fast response)

### 4. Full Class Content (Payment Required)
**Tool**: `get_class_full` from `@tools/2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop`
**Test Command**: `dreamer call-tool -s 2ac0f83e-af3d-4da8-810f-7bdbad811c21.yogashop -n get_class_full '{"classId":"1"}'`
**Sample Arguments**: `{"classId": "1"}`
**Sample Output (without payment)**:
```json
{
  "error": {
    "x402Version": 1,
    "error": "X-PAYMENT header is required",
    "accepts": [{
      "scheme": "exact",
      "network": "base-sepolia",
      "maxAmountRequired": "1000000",
      "resource": "http://yoga-shop.onrender.com/class/1/full",
      "description": "Morning Flow — full video",
      "payTo": "0xc0f4fF27A67f2238eD0DbD3Fdcc6Ffc10F95698c",
      "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      "extra": {"name": "USDC", "version": "2"}
    }]
  },
  "status": 402
}
```

**Processing Strategy**:
- When called without xPayment: returns 402 with payment requirements
- When called with valid xPayment header: returns content_url and tx_hash
- Store successful purchases in database for re-access

## Sidekick Task Evaluation
**Are there workflow steps that should be combined into a sidekick task?**

No. This workflow is mechanical:
1. Browse catalog (direct tool call)
2. Display locked/unlocked state (database lookup)
3. Process payment (tool call + database store)

All steps are deterministic with no judgment required.

### Steps kept as direct implementation
**Steps**: All steps - browsing, caching, payment processing, purchase tracking
**Why direct**: Single tool calls, deterministic transformations, user waiting for response

## Caching Requirements

### browse_classes
**Latency observed**: 1.3s
**Displayed in UI**: Yes - main catalog view
**Caching strategy**:
- Store classes in `cachedClasses` table
- TTL: 15 minutes (catalog changes infrequently)
- Invalidate on explicit refresh only

### browse_products
**Latency observed**: 1.1s
**Displayed in UI**: Yes - products section
**Caching strategy**:
- Store products in `cachedProducts` table
- TTL: 15 minutes (catalog changes infrequently)
- Invalidate on explicit refresh only

## Controlling Costs
- Cache catalog data (classes/products) to avoid repeated tool calls
- Track purchases in local database to avoid checking payment status repeatedly
- Only call `get_class_full` when user clicks to unlock content
- Use database queries (free) to check if content is already purchased before calling payment tools

## Implementation Sequence

### Phase 1: Database Schema
1. Create `purchases` table to track user purchases
2. Create `cachedClasses` table for caching class catalog
3. Create `cachedProducts` table for caching product catalog

### Phase 2: Server Functions (test each with `dreamer call-server`)
1. `getClasses` - Fetch classes with caching
2. `getProducts` - Fetch products with caching
3. `getPurchases` - Get user's purchased items
4. `getClassPreview` - Get free preview URL
5. `unlockClass` - Process payment and store purchase
6. `getClassContent` - Get full content for purchased class

### Phase 3: Frontend
1. Catalog view with locked/unlocked state
2. Payment flow when clicking locked content
3. Content display for unlocked items
4. Purchase history view

## Rejected Approaches
None - the yogashop tool provides all required functionality.
