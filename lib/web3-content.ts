export interface DocSection {
  slug: string;
  title: string;
  description: string;
  icon: string;
  content: string;
  codeExample?: string;
  keyPoints: string[];
  relatedTopics: string[];
}

export const web3Content: Record<string, DocSection> = {
  introduction: {
    slug: 'introduction',
    title: 'Introduction to Web3',
    description: 'The philosophical shift from Web2, trustlessness, decentralization ethos, and the vision of user-owned internet',
    icon: '◈',
    content: `
## The Dawn of User-Owned Internet

Web3 represents a paradigm shift in how we conceptualize and interact with the internet. Unlike Web1 (read-only static pages) and Web2 (read-write platforms controlled by corporations), Web3 introduces a read-write-own model where users have true ownership of their digital assets, identities, and data.

### The Philosophical Foundation

At its core, Web3 is built on the principle of **trustlessness** — the ability to interact with systems and counterparties without needing to trust a central authority. This is achieved through cryptographic verification and consensus mechanisms that make fraud computationally impractical.

The key philosophical tenets of Web3 include:

1. **Decentralization**: Power and control distributed across a network rather than concentrated in corporations
2. **Permissionlessness**: Anyone can participate without requiring approval from gatekeepers
3. **Censorship Resistance**: No single entity can prevent users from accessing the network
4. **Self-Sovereignty**: Users control their own identity, data, and assets
5. **Composability**: Applications can be built on top of each other like financial Legos

### From Trust to Verification

In Web2, we trust platforms with our data, identity, and transactions. This trust is often misplaced — data breaches, privacy violations, and platform risk are endemic. Web3 replaces this trust model with cryptographic verification.

Instead of trusting that a bank will honor your balance, you can mathematically verify your ownership on-chain. Instead of trusting a social platform with your identity, you can own and control your digital identity through cryptographic keys.

### The Vision

Web3 envisions an internet where:
- Users own their digital assets and can freely transfer them
- Platforms are governed by their communities, not corporations
- Economic value flows to creators and users, not intermediaries
- Identity is portable and user-controlled
- Applications are transparent and auditable
- Censorship and deplatforming become technically impossible

This isn't just a technical evolution — it's a social and economic revolution that challenges existing power structures and creates new models for human coordination.
    `,
    codeExample: `
// Connecting to Web3 - Basic Example
import { ethers } from 'ethers';

// Connect to user's wallet
async function connectToWeb3() {
  if (typeof window.ethereum !== 'undefined') {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    console.log('Connected:', accounts[0]);
    return { provider, signer, address: accounts[0] };
  } else {
    throw new Error('No Web3 wallet detected');
  }
}
    `,
    keyPoints: [
      'Web3 introduces read-write-OWN paradigm',
      'Trustlessness through cryptographic verification',
      'Decentralization distributes power across networks',
      'Self-sovereignty gives users control over identity and assets',
      'Composability enables building interconnected applications'
    ],
    relatedTopics: ['blockchain', 'wallets', 'smart-contracts']
  },

  blockchain: {
    slug: 'blockchain',
    title: 'Blockchain Fundamentals',
    description: 'Blocks, chains, hashing, Merkle trees, immutability, and distributed ledgers vs centralized databases',
    icon: '⬡',
    content: `
## The Architecture of Trust

A blockchain is a distributed ledger that maintains a continuously growing list of records, called blocks, linked together using cryptographic hashes. Each block contains a timestamp, transaction data, and a cryptographic hash of the previous block, creating an immutable chain of data.

### Block Structure

Every block in a blockchain contains:

1. **Block Header**
   - Previous block hash (linking to parent)
   - Merkle root (summary of all transactions)
   - Timestamp
   - Nonce (for Proof of Work)
   - Difficulty target

2. **Block Body**
   - List of transactions
   - Transaction count

### Cryptographic Hashing

Hashing is fundamental to blockchain security. A hash function takes input of any size and produces a fixed-size output with key properties:

- **Deterministic**: Same input always produces same output
- **One-way**: Cannot reverse the hash to find the input
- **Collision-resistant**: Extremely hard to find two inputs with same hash
- **Avalanche effect**: Small input change creates completely different output

Ethereum uses Keccak-256, while Bitcoin uses SHA-256 double hashing.

### Merkle Trees

A Merkle tree is a binary tree of hashes that efficiently summarizes all transactions in a block. Properties include:

- **Efficient verification**: Prove a transaction exists with O(log n) data
- **Tamper detection**: Any change invalidates the root hash
- **Light client support**: SPV clients can verify without full blockchain

### Immutability

Once a block is added to the chain, changing it becomes computationally impractical because:

1. You'd need to recalculate that block's hash
2. All subsequent blocks would need new hashes
3. You'd need to outpace the entire network's hash power

This is why blockchain data is considered immutable — not because it's technically impossible to change, but because the cost of changing it exceeds any possible benefit.

### Distributed vs Centralized

| Aspect | Centralized Database | Blockchain |
|--------|---------------------|------------|
| Control | Single authority | Network consensus |
| Trust | Trust the operator | Trustless verification |
| Modification | Easy to modify | Immutable by design |
| Availability | Single point of failure | Distributed redundancy |
| Transparency | Opaque | Fully auditable |
| Write access | Permissioned | Public or permissioned |
    `,
    codeExample: `
// Calculating a simple block hash
const crypto = require('crypto');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
      )
      .digest('hex');
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined: ' + this.hash);
  }
}
    `,
    keyPoints: [
      'Blocks contain header, transactions, and link to previous block',
      'Cryptographic hashing ensures data integrity',
      'Merkle trees enable efficient transaction verification',
      'Immutability comes from computational cost of altering history',
      'Distributed nature eliminates single points of failure'
    ],
    relatedTopics: ['consensus', 'smart-contracts', 'introduction']
  },

  consensus: {
    slug: 'consensus',
    title: 'Consensus Mechanisms',
    description: 'Proof of Work, Proof of Stake, DPoS, PoH, BFT variants, finality, and the nothing-at-stake problem',
    icon: '◉',
    content: `
## Achieving Agreement in Distributed Systems

Consensus mechanisms are protocols that ensure all nodes in a distributed network agree on the current state of the ledger. They solve the Byzantine Generals Problem — how to achieve agreement when some participants might be faulty or malicious.

### Proof of Work (PoW)

Bitcoin's original consensus mechanism requires miners to solve computationally intensive puzzles:

**How it works:**
1. Miners compete to find a nonce that makes block hash below target
2. First to find valid hash broadcasts block to network
3. Other nodes verify and add block to their chain
4. Miner receives block reward and transaction fees

**Security model:** Attack requires >50% of network hash power
**Energy consumption:** High (by design — security through real-world cost)
**Finality:** Probabilistic (more confirmations = more finality)

### Proof of Stake (PoS)

Validators stake cryptocurrency as collateral to participate in consensus:

**How it works:**
1. Validators lock up stake as collateral
2. Random selection chooses block proposer (weighted by stake)
3. Other validators attest to block validity
4. Valid attestations earn rewards; malicious behavior is slashed

**Key advantages over PoW:**
- 99.95% less energy consumption
- Lower barrier to participation
- Economic finality possible

### The Nothing-at-Stake Problem

In naive PoS, validators could vote on multiple chain forks at no cost, potentially preventing consensus. Solutions include:

1. **Slashing conditions**: Validators lose stake for equivocating
2. **Finality gadgets**: Casper FFG provides economic finality
3. **Validator rotation**: Random selection prevents coordination

### Delegated Proof of Stake (DPoS)

Token holders vote for a small set of delegates who produce blocks:

- **Pros**: High throughput, energy efficient
- **Cons**: More centralized, potential for cartel formation

### Proof of History (PoH)

Solana's innovation creates a cryptographic clock before consensus:

1. SHA-256 hash chain creates verifiable passage of time
2. Enables parallel transaction processing
3. Reduces consensus overhead dramatically

### Byzantine Fault Tolerance (BFT)

PBFT and its variants (Tendermint, HotStuff) achieve consensus through voting rounds:

- Tolerates up to 1/3 malicious nodes
- Provides immediate finality
- Limited scalability (O(n²) message complexity)

### Comparing Consensus Mechanisms

| Mechanism | Throughput | Finality | Decentralization | Energy |
|-----------|-----------|----------|------------------|--------|
| PoW | ~7 TPS | Probabilistic | High | Very High |
| PoS | ~15-100K TPS | Economic | Medium-High | Low |
| DPoS | ~10K TPS | Fast | Lower | Low |
| PBFT | ~1K TPS | Instant | Low | Low |
    `,
    codeExample: `
// Simplified Proof of Stake validator selection
class ProofOfStake {
  constructor() {
    this.validators = new Map(); // address -> stake
    this.totalStake = 0;
  }

  addValidator(address, stake) {
    this.validators.set(address, stake);
    this.totalStake += stake;
  }

  selectValidator() {
    // Weighted random selection based on stake
    const random = Math.random() * this.totalStake;
    let cumulative = 0;
    
    for (const [address, stake] of this.validators) {
      cumulative += stake;
      if (random <= cumulative) {
        return address;
      }
    }
  }

  slash(address, percentage) {
    const currentStake = this.validators.get(address);
    const slashAmount = currentStake * percentage;
    this.validators.set(address, currentStake - slashAmount);
    this.totalStake -= slashAmount;
    console.log(\`Slashed \${address} by \${slashAmount}\`);
  }
}
    `,
    keyPoints: [
      'PoW uses computational work to achieve Sybil resistance',
      'PoS replaces energy with economic stake as security',
      'Nothing-at-stake solved through slashing conditions',
      'BFT variants provide instant finality but limited scale',
      'Hybrid approaches combine benefits of multiple mechanisms'
    ],
    relatedTopics: ['blockchain', 'tokenomics', 'layer2']
  },

  'smart-contracts': {
    slug: 'smart-contracts',
    title: 'Smart Contracts',
    description: 'EVM explained, Solidity basics, ABI, contract lifecycle, gas optimization, and common patterns',
    icon: '⟐',
    content: `
## Self-Executing Agreements

Smart contracts are programs stored on a blockchain that execute automatically when predetermined conditions are met. They enable trustless, transparent automation of agreements without intermediaries.

### The Ethereum Virtual Machine (EVM)

The EVM is a quasi-Turing complete state machine that executes smart contract bytecode:

**Key characteristics:**
- Stack-based architecture (1024 item limit)
- 256-bit word size (optimized for cryptography)
- Persistent storage (expensive) vs memory (cheap)
- Deterministic execution across all nodes
- Gas metering prevents infinite loops

### Solidity Fundamentals

Solidity is the primary language for EVM smart contracts:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorage {
    // State variables (stored on-chain)
    uint256 public value;
    address public owner;
    
    // Events for off-chain indexing
    event ValueChanged(uint256 newValue, address changedBy);
    
    // Modifiers for access control
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function setValue(uint256 _value) external onlyOwner {
        value = _value;
        emit ValueChanged(_value, msg.sender);
    }
}
\`\`\`

### Contract Lifecycle

1. **Development**: Write and test contracts locally
2. **Compilation**: Solidity → bytecode + ABI
3. **Deployment**: Transaction creates contract on-chain
4. **Interaction**: Users call functions via transactions
5. **Upgrade/Migration**: Proxy patterns for upgradability

### Application Binary Interface (ABI)

The ABI defines how to encode/decode function calls:

- Function signatures (4-byte selector)
- Parameter encoding (32-byte padded)
- Return value decoding
- Event log parsing

### Gas Optimization Patterns

Gas is the unit of computational cost. Optimize by:

1. **Storage efficiency**: Pack variables, use appropriate types
2. **Minimize storage writes**: Most expensive operation
3. **Use calldata**: Cheaper than memory for read-only params
4. **Short-circuit logic**: Fail fast with requires
5. **Batch operations**: Amortize fixed costs

### Common Design Patterns

**Factory Pattern**: Deploy multiple contracts from template
\`\`\`solidity
contract Factory {
    function createChild() external returns (address) {
        return address(new Child(msg.sender));
    }
}
\`\`\`

**Proxy Pattern**: Upgradeable contracts
\`\`\`solidity
contract Proxy {
    address public implementation;
    
    fallback() external {
        // Delegate all calls to implementation
        (bool success,) = implementation.delegatecall(msg.data);
        require(success);
    }
}
\`\`\`

**Multisig Pattern**: Require multiple signatures
\`\`\`solidity
contract Multisig {
    mapping(bytes32 => uint256) public confirmations;
    uint256 public required;
    
    function confirm(bytes32 txHash) external onlyOwner {
        confirmations[txHash]++;
        if (confirmations[txHash] >= required) {
            // Execute transaction
        }
    }
}
\`\`\`
    `,
    codeExample: `
// Complete ERC-20 Token Implementation
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Token {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(string memory _name, string memory _symbol, uint256 _supply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _supply * 10**decimals;
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}
    `,
    keyPoints: [
      'EVM is a deterministic state machine executing bytecode',
      'Solidity compiles to bytecode with ABI for interaction',
      'Gas metering prevents infinite loops and spam',
      'Storage operations are most expensive — optimize carefully',
      'Proxy patterns enable upgradeable contract architectures'
    ],
    relatedTopics: ['defi', 'blockchain', 'wallets']
  },

  defi: {
    slug: 'defi',
    title: 'DeFi Architecture',
    description: 'AMMs, liquidity pools, impermanent loss, yield farming, lending protocols, liquidation mechanics, and flash loans',
    icon: '◇',
    content: `
## The Financial Layer of Web3

Decentralized Finance (DeFi) recreates traditional financial services using smart contracts, eliminating intermediaries and enabling permissionless, transparent, and composable financial primitives.

### Automated Market Makers (AMMs)

AMMs replace order books with algorithmic price determination:

**Constant Product Formula (Uniswap v2):**
\`x * y = k\`

Where x and y are token reserves, and k is a constant.

**Price determination:**
- Price = y/x (for buying x with y)
- Larger trades = more slippage
- Arbitrageurs keep prices aligned with markets

**Capital efficiency improvements:**
- Uniswap v3: Concentrated liquidity ranges
- Curve: StableSwap invariant for pegged assets
- Balancer: Weighted pools (multiple tokens)

### Liquidity Pools

LPs deposit tokens in pairs to enable trading:

1. Deposit equal value of both tokens
2. Receive LP tokens representing share
3. Earn trading fees proportional to share
4. Withdraw tokens + accumulated fees

### Impermanent Loss (IL)

IL occurs when pooled token prices diverge:

\`\`\`
IL = 2 * √(price_ratio) / (1 + price_ratio) - 1

Example: ETH doubles in price
- Held: 100% gain
- LP: ~5.7% IL (but earned fees may compensate)
\`\`\`

The loss is "impermanent" because it reverses if prices return to original ratio.

### Lending Protocols

Algorithmic money markets (Aave, Compound):

**Mechanics:**
1. Lenders deposit assets → receive interest-bearing tokens
2. Borrowers post collateral → borrow up to collateral factor
3. Interest rates algorithmically adjust based on utilization
4. Liquidation occurs if health factor drops below threshold

**Key parameters:**
- Collateral factor: Max borrow % (e.g., 75% for ETH)
- Liquidation threshold: Point of liquidation (e.g., 80%)
- Liquidation bonus: Incentive for liquidators (e.g., 5%)

### Liquidation Mechanics

When position health deteriorates:

1. Health factor = (Collateral × LT) / Debt
2. HF < 1 triggers liquidation eligibility
3. Liquidator repays portion of debt
4. Receives collateral + bonus
5. Remaining debt/collateral reduced proportionally

### Flash Loans

Uncollateralized loans within a single transaction:

\`\`\`solidity
function flashLoan(uint256 amount) external {
    uint256 balanceBefore = token.balanceOf(address(this));
    
    // Send funds to borrower
    token.transfer(msg.sender, amount);
    
    // Borrower executes arbitrary logic
    IFlashBorrower(msg.sender).executeOperation(amount);
    
    // Verify repayment (+ fee)
    require(
        token.balanceOf(address(this)) >= balanceBefore + fee,
        "Flash loan not repaid"
    );
}
\`\`\`

**Use cases:**
- Arbitrage (price discrepancies across DEXes)
- Collateral swaps (refinancing positions)
- Self-liquidation (avoiding penalties)

### Yield Farming

Strategies to maximize returns:

1. **Liquidity mining**: Earn governance tokens for providing liquidity
2. **Yield aggregators**: Auto-compound and optimize strategies
3. **Leveraged farming**: Borrow to increase exposure
4. **Delta-neutral**: Hedge price exposure, earn yield only
    `,
    codeExample: `
// Simple AMM Implementation
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleAMM {
    IERC20 public tokenA;
    IERC20 public tokenB;
    
    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalLiquidity;
    
    mapping(address => uint256) public liquidity;
    
    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }
    
    function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint256) {
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);
        
        uint256 liquidityMinted;
        if (totalLiquidity == 0) {
            liquidityMinted = sqrt(amountA * amountB);
        } else {
            liquidityMinted = min(
                (amountA * totalLiquidity) / reserveA,
                (amountB * totalLiquidity) / reserveB
            );
        }
        
        liquidity[msg.sender] += liquidityMinted;
        totalLiquidity += liquidityMinted;
        reserveA += amountA;
        reserveB += amountB;
        
        return liquidityMinted;
    }
    
    function swap(address tokenIn, uint256 amountIn) external returns (uint256) {
        require(tokenIn == address(tokenA) || tokenIn == address(tokenB), "Invalid token");
        
        bool isTokenA = tokenIn == address(tokenA);
        (IERC20 inToken, IERC20 outToken, uint256 resIn, uint256 resOut) = isTokenA
            ? (tokenA, tokenB, reserveA, reserveB)
            : (tokenB, tokenA, reserveB, reserveA);
        
        inToken.transferFrom(msg.sender, address(this), amountIn);
        
        // 0.3% fee
        uint256 amountInWithFee = amountIn * 997;
        uint256 amountOut = (amountInWithFee * resOut) / (resIn * 1000 + amountInWithFee);
        
        outToken.transfer(msg.sender, amountOut);
        
        // Update reserves
        if (isTokenA) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }
        
        return amountOut;
    }
    
    function sqrt(uint256 x) internal pure returns (uint256) {
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) { y = z; z = (x / z + z) / 2; }
        return y;
    }
    
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}
    `,
    keyPoints: [
      'AMMs use mathematical formulas instead of order books',
      'Impermanent loss is the cost of providing liquidity',
      'Lending protocols enable overcollateralized borrowing',
      'Flash loans enable arbitrage and complex operations',
      'Composability allows building complex financial strategies'
    ],
    relatedTopics: ['smart-contracts', 'tokenomics', 'layer2']
  },

  layer2: {
    slug: 'layer2',
    title: 'Layer 2 Scaling',
    description: 'Rollups (Optimistic vs ZK), State channels, Plasma, Validium, data availability, and the L2 landscape',
    icon: '⧈',
    content: `
## Scaling Beyond Base Layer Limits

Layer 2 solutions execute transactions off the main chain (L1) while inheriting its security. They solve the blockchain trilemma trade-off by moving computation off-chain while using L1 for settlement and data availability.

### The Scaling Problem

Ethereum L1 processes ~15 transactions per second with high gas costs. Global financial systems need 100,000+ TPS. L2s bridge this gap.

### Rollups: The Dominant Paradigm

Rollups bundle hundreds of transactions into one L1 transaction:

1. **Execution**: Process transactions on L2
2. **Compression**: Batch many txs into compressed data
3. **Posting**: Submit compressed data to L1
4. **Verification**: Prove validity to L1 (differs by type)

### Optimistic Rollups

**Philosophy:** Assume transactions are valid, prove fraud if needed

**Mechanism:**
1. Sequencer posts state root and tx data to L1
2. 7-day challenge period for fraud proofs
3. Anyone can submit proof showing invalid state
4. Invalid batches are reverted, sequencer slashed

**Pros:** EVM-compatible, lower computational overhead
**Cons:** 7-day withdrawal delay, relies on honest verifiers

**Examples:** Arbitrum, Optimism, Base

### ZK Rollups

**Philosophy:** Prove validity cryptographically, no assumptions

**Mechanism:**
1. Sequencer executes transactions off-chain
2. Generates cryptographic proof (SNARK/STARK)  
3. Proof + transaction data posted to L1
4. L1 verifier contract validates proof
5. Instant finality once proof verified

**Pros:** No challenge period, mathematically guaranteed security
**Cons:** Complex circuits, zkEVM compatibility challenges

**Examples:** zkSync Era, StarkNet, Polygon zkEVM, Scroll

### Comparing Rollup Types

| Aspect | Optimistic | ZK |
|--------|-----------|-----|
| Finality | 7 days | Minutes |
| Proof cost | Low (only fraud) | High (every batch) |
| EVM compat | Native | Requires zkEVM |
| Complexity | Lower | Higher |
| Privacy | Transparent | Can be private |

### Other L2 Approaches

**State Channels:**
- Lock funds in L1 contract
- Unlimited off-chain transactions between parties
- Only settlement touches L1
- Great for: micropayments, gaming
- Limitations: requires both parties online, limited participants

**Plasma:**
- Child chains with periodic commitments to L1
- Data held off-chain by operators
- Largely superseded by rollups due to DA concerns

**Validium:**
- Like ZK rollups but data stored off-chain
- Higher throughput, lower costs
- Weaker guarantees (depends on data committee)

### Data Availability

The key question: Where is transaction data stored?

- **On-chain DA** (rollups): Data on L1, strongest guarantees
- **Off-chain DA** (validium): Data with committee, cheaper
- **DAC**: Data Availability Committee certifies data
- **Dedicated DA layers**: Celestia, EigenDA

### The L2 Landscape

The ecosystem is evolving toward:

1. **Multiple rollups**: Competition and specialization
2. **Cross-L2 bridges**: Interoperability challenges
3. **L3s**: App-specific chains built on L2s
4. **Shared sequencing**: Atomicity across rollups
    `,
    codeExample: `
// Simplified Optimistic Rollup Fraud Proof Logic
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract OptimisticRollup {
    struct StateCommitment {
        bytes32 stateRoot;
        uint256 timestamp;
        address proposer;
        bool finalized;
    }
    
    StateCommitment[] public stateCommitments;
    uint256 public constant CHALLENGE_PERIOD = 7 days;
    uint256 public constant BOND_AMOUNT = 1 ether;
    
    mapping(address => uint256) public bonds;
    
    event StateProposed(uint256 indexed index, bytes32 stateRoot);
    event FraudProven(uint256 indexed index, address challenger);
    
    function proposeState(bytes32 _stateRoot) external payable {
        require(msg.value >= BOND_AMOUNT, "Insufficient bond");
        bonds[msg.sender] += msg.value;
        
        stateCommitments.push(StateCommitment({
            stateRoot: _stateRoot,
            timestamp: block.timestamp,
            proposer: msg.sender,
            finalized: false
        }));
        
        emit StateProposed(stateCommitments.length - 1, _stateRoot);
    }
    
    function challengeState(
        uint256 _index,
        bytes calldata _fraudProof
    ) external {
        StateCommitment storage commitment = stateCommitments[_index];
        require(!commitment.finalized, "Already finalized");
        require(
            block.timestamp < commitment.timestamp + CHALLENGE_PERIOD,
            "Challenge period ended"
        );
        
        // Verify fraud proof (simplified)
        require(verifyFraudProof(_fraudProof, commitment.stateRoot), "Invalid proof");
        
        // Slash proposer, reward challenger
        uint256 slashedAmount = bonds[commitment.proposer];
        bonds[commitment.proposer] = 0;
        payable(msg.sender).transfer(slashedAmount);
        
        // Mark state as invalid
        delete stateCommitments[_index];
        
        emit FraudProven(_index, msg.sender);
    }
    
    function finalizeState(uint256 _index) external {
        StateCommitment storage commitment = stateCommitments[_index];
        require(
            block.timestamp >= commitment.timestamp + CHALLENGE_PERIOD,
            "Challenge period active"
        );
        require(!commitment.finalized, "Already finalized");
        
        commitment.finalized = true;
    }
    
    function verifyFraudProof(
        bytes calldata proof,
        bytes32 claimedRoot
    ) internal pure returns (bool) {
        // In reality: re-execute transaction, check state mismatch
        // This is a simplified placeholder
        return proof.length > 0 && claimedRoot != bytes32(0);
    }
}
    `,
    keyPoints: [
      'Rollups inherit L1 security while scaling execution',
      'Optimistic rollups assume validity with fraud proof fallback',
      'ZK rollups prove validity cryptographically with instant finality',
      'Data availability is crucial for trustless withdrawal',
      'L2 ecosystem evolving toward specialization and interoperability'
    ],
    relatedTopics: ['blockchain', 'zk-proofs', 'consensus']
  },

  'zk-proofs': {
    slug: 'zk-proofs',
    title: 'Zero-Knowledge Proofs',
    description: 'What ZKPs are, SNARKs vs STARKs, zkEVM, privacy applications, and recursive proofs',
    icon: '∅',
    content: `
## Proving Without Revealing

Zero-Knowledge Proofs (ZKPs) allow one party (the prover) to convince another party (the verifier) that a statement is true without revealing any information beyond the validity of the statement itself.

### The Three Properties

A ZKP must satisfy:

1. **Completeness**: If the statement is true, an honest prover can convince an honest verifier
2. **Soundness**: A dishonest prover cannot convince a verifier of a false statement (except with negligible probability)
3. **Zero-Knowledge**: The verifier learns nothing beyond the truth of the statement

### Interactive vs Non-Interactive

**Interactive ZKPs:**
- Multiple rounds of communication
- Prover and verifier exchange challenges/responses
- Not practical for blockchain (need online parties)

**Non-Interactive ZKPs (NIZKs):**
- Single message from prover to verifier
- Use Fiat-Shamir heuristic (hash as random oracle)
- Essential for blockchain applications

### SNARKs: Succinct Non-interactive Arguments of Knowledge

**Properties:**
- **Succinct**: Proofs are small (hundreds of bytes)
- **Non-interactive**: Single proof message
- **Argument**: Computationally sound (breakable with enough compute)
- **of Knowledge**: Prover must "know" the witness

**Technical components:**
1. **Arithmetic circuits**: Computation expressed as constraints
2. **Polynomial commitments**: Encode constraints as polynomials
3. **Pairing-based cryptography**: Enable efficient verification

**Trusted setup:** Requires initial ceremony to generate parameters. Toxic waste (randomness) must be destroyed.

**Examples:** Groth16, PLONK

### STARKs: Scalable Transparent Arguments of Knowledge

**Key differences from SNARKs:**
- **No trusted setup**: Transparent, nothing to destroy
- **Post-quantum secure**: Uses hash functions, not pairings
- **Larger proofs**: ~100KB vs ~hundreds of bytes
- **Faster proving**: Better for large computations

**Technical basis:**
- AIR (Algebraic Intermediate Representation)
- FRI (Fast Reed-Solomon Interactive Oracle Proofs)
- Hash-based commitments

### Comparing ZKP Systems

| Property | SNARK (Groth16) | SNARK (PLONK) | STARK |
|----------|-----------------|---------------|-------|
| Proof size | ~200B | ~400B | ~100KB |
| Verify time | ~2ms | ~5ms | ~10ms |
| Prove time | Higher | Medium | Lower |
| Trusted setup | Required | Universal | None |
| Quantum safe | No | No | Yes |

### zkEVM: EVM in Zero-Knowledge

Proving EVM execution in ZK circuits enables:

1. **Validity proofs for rollups**: Instant finality
2. **Perfect EVM compatibility**: Deploy existing Solidity
3. **Privacy options**: Hide transaction details

**Approaches:**
- **Type 1** (Full equivalence): Exact EVM semantics
- **Type 2** (EVM equivalent): Minor gas differences  
- **Type 3** (EVM compatible): Most opcodes supported
- **Type 4** (High-level compatible): Compile from Solidity to custom VM

### Privacy Applications

ZKPs enable:

- **Private transactions**: Zcash, Aztec (hide sender/receiver/amount)
- **Identity verification**: Prove age without revealing birthdate
- **Credential proofs**: Prove membership without revealing identity
- **Confidential DeFi**: Trade without revealing positions
- **Voting**: Prove eligibility without revealing vote

### Recursive Proofs

A proof that verifies another proof:

\`\`\`
Proof_N = ZKProof(Verify(Proof_N-1) ∧ Statement_N)
\`\`\`

**Applications:**
- Aggregate many proofs into one (rollup compression)
- Incremental verification (verify only latest proof)
- Enable IVC (Incrementally Verifiable Computation)
    `,
    codeExample: `
// Simplified ZK Circuit Concept (Circom-style)
// This is pseudocode illustrating ZK circuit logic

// Prove: I know a preimage to this hash
template HashPreimage() {
    // Private input (the witness - what we're hiding)
    signal private input preimage;
    
    // Public input (what we're proving about)
    signal input hash;
    
    // Constraint: hash(preimage) === hash
    // The verifier only sees 'hash', not 'preimage'
    component hasher = Poseidon(1);
    hasher.inputs[0] <== preimage;
    
    // This constraint must be satisfied
    hash === hasher.out;
}

// Prove: I know a path in a Merkle tree without revealing which leaf
template MerkleProof(levels) {
    signal private input leaf;
    signal private input pathElements[levels];
    signal private input pathIndices[levels];
    signal input root;
    
    component hashers[levels];
    signal hashes[levels + 1];
    hashes[0] <== leaf;
    
    for (var i = 0; i < levels; i++) {
        hashers[i] = Poseidon(2);
        
        // Select left/right based on path
        hashers[i].inputs[0] <== pathIndices[i] ? pathElements[i] : hashes[i];
        hashers[i].inputs[1] <== pathIndices[i] ? hashes[i] : pathElements[i];
        
        hashes[i + 1] <== hashers[i].out;
    }
    
    // Final hash must equal public root
    root === hashes[levels];
}

// The magic: verifier confirms proof validity without learning
// the preimage, leaf, or path - only that they're valid!
    `,
    keyPoints: [
      'ZKPs prove truth without revealing underlying data',
      'SNARKs offer tiny proofs but need trusted setup',
      'STARKs are quantum-safe with no trusted setup',
      'zkEVM enables proving EVM execution validity',
      'Recursive proofs allow infinite proof aggregation'
    ],
    relatedTopics: ['layer2', 'smart-contracts', 'blockchain']
  },

  tokenomics: {
    slug: 'tokenomics',
    title: 'Tokenomics',
    description: 'Token design, emission schedules, vesting, governance tokens, utility tokens, ve-tokenomics, and token sinks',
    icon: '◆',
    content: `
## The Economics of Digital Assets

Tokenomics is the study of how cryptographic tokens work within their ecosystems. Good tokenomics aligns incentives, creates sustainable value capture, and enables decentralized coordination.

### Token Types

**Utility Tokens:**
- Provide access to products/services
- Gas tokens (ETH, MATIC)
- Protocol fees (UNI, AAVE)
- Governance rights often included

**Governance Tokens:**
- Vote on protocol decisions
- May grant treasury access
- Risk: Concentrated ownership = plutocracy

**Security Tokens:**
- Represent real-world assets
- Subject to securities regulations
- Dividends, equity, debt

### Token Supply Dynamics

**Fixed Supply:**
- Total supply capped forever
- Bitcoin: 21 million BTC
- Deflationary over time
- Encourages holding

**Inflationary Supply:**
- New tokens continuously minted
- Ethereum: ~4% annual issuance (pre-merge)
- Funds network security
- Requires usage to absorb inflation

**Deflationary Mechanisms:**
- Fee burns (EIP-1559)
- Buyback and burn
- Slashing penalties
- Protocol revenue sinks

### Emission Schedules

**Linear Emission:**
\`emission = constant_per_block\`

**Halving Schedule (Bitcoin):**
\`reward = initial / 2^(blocks / halving_interval)\`

**Curve/Decay Emission:**
\`emission = initial * decay_rate^time\`

### Vesting and Distribution

**Typical Distribution:**
- Team: 15-25% (4-year vesting, 1-year cliff)
- Investors: 15-25% (2-4 year vesting)
- Community/Ecosystem: 30-50%
- Treasury: 10-20%
- Public sale/Airdrop: 5-15%

**Vesting importance:**
- Prevents immediate dumping
- Aligns long-term incentives
- Cliff prevents short-term extraction

### ve-Tokenomics (Vote-Escrow)

Pioneered by Curve Finance:

1. Lock tokens for 1-4 years → receive veCRV
2. veCRV = voting power + reward boost
3. Longer lock = more veCRV per token
4. veCRV decays linearly to zero at unlock

**Benefits:**
- Reduces circulating supply
- Aligns holders with long-term success
- Creates governance skin-in-game
- Protocols bribe veCRV holders for votes

### Token Sinks

Mechanisms that remove tokens from circulation:

1. **Fee Burns**: Portion of fees permanently destroyed
2. **Staking Locks**: Tokens locked for consensus/rewards
3. **Protocol Fees**: Revenue used to buy back tokens
4. **NFT Minting**: Tokens spent on digital assets
5. **Governance Deposits**: Locked for proposal submission

### Sustainable Tokenomics Checklist

✓ Clear value accrual mechanism
✓ Aligned incentives across stakeholders
✓ Balanced inflation/deflation
✓ Realistic vesting schedules
✓ Multiple token sinks
✓ Governance decentralization plan
✓ Transparent treasury management

### Common Pitfalls

❌ Excessive team/investor allocation
❌ Short or no vesting periods
❌ Pure inflation with no sinks
❌ Token utility disconnected from protocol value
❌ Governance power concentrated
❌ No clear reason to hold long-term
    `,
    codeExample: `
// Vote-Escrow Token Implementation
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VotingEscrow {
    IERC20 public token;
    
    struct Lock {
        uint256 amount;
        uint256 end;
    }
    
    mapping(address => Lock) public locks;
    
    uint256 public constant MAX_LOCK = 4 * 365 days;
    uint256 public totalLocked;
    
    event Locked(address indexed user, uint256 amount, uint256 end);
    event Withdrawn(address indexed user, uint256 amount);
    
    constructor(address _token) {
        token = IERC20(_token);
    }
    
    function createLock(uint256 _amount, uint256 _duration) external {
        require(_duration >= 7 days, "Min lock 1 week");
        require(_duration <= MAX_LOCK, "Max lock 4 years");
        require(locks[msg.sender].amount == 0, "Existing lock");
        
        token.transferFrom(msg.sender, address(this), _amount);
        
        uint256 unlockTime = block.timestamp + _duration;
        locks[msg.sender] = Lock(_amount, unlockTime);
        totalLocked += _amount;
        
        emit Locked(msg.sender, _amount, unlockTime);
    }
    
    function increaseLock(uint256 _amount) external {
        Lock storage lock = locks[msg.sender];
        require(lock.amount > 0, "No existing lock");
        require(lock.end > block.timestamp, "Lock expired");
        
        token.transferFrom(msg.sender, address(this), _amount);
        lock.amount += _amount;
        totalLocked += _amount;
    }
    
    function extendLock(uint256 _newDuration) external {
        Lock storage lock = locks[msg.sender];
        require(lock.amount > 0, "No existing lock");
        
        uint256 newEnd = block.timestamp + _newDuration;
        require(newEnd > lock.end, "Must extend");
        require(_newDuration <= MAX_LOCK, "Max 4 years");
        
        lock.end = newEnd;
    }
    
    function withdraw() external {
        Lock storage lock = locks[msg.sender];
        require(block.timestamp >= lock.end, "Lock not expired");
        
        uint256 amount = lock.amount;
        lock.amount = 0;
        totalLocked -= amount;
        
        token.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }
    
    // veToken balance decays linearly
    function balanceOf(address _user) external view returns (uint256) {
        Lock memory lock = locks[_user];
        if (block.timestamp >= lock.end) return 0;
        
        uint256 timeLeft = lock.end - block.timestamp;
        return (lock.amount * timeLeft) / MAX_LOCK;
    }
    
    function totalSupply() external view returns (uint256) {
        // In production: iterate all locks or track incrementally
        return totalLocked;
    }
}
    `,
    keyPoints: [
      'Different token types serve different economic functions',
      'Supply dynamics (inflation/deflation) affect value',
      'Vesting aligns long-term stakeholder incentives',
      've-tokenomics creates sustainable governance',
      'Token sinks are essential for value sustainability'
    ],
    relatedTopics: ['daos', 'defi', 'consensus']
  },

  daos: {
    slug: 'daos',
    title: 'DAOs',
    description: 'Governance models, voting mechanisms (quadratic, conviction), multisig treasuries, legal wrappers, and coordination problems',
    icon: '⬢',
    content: `
## Decentralized Autonomous Organizations

DAOs are internet-native organizations with rules encoded in smart contracts. They enable transparent, permissionless coordination without traditional corporate hierarchies.

### Core Components

1. **Governance Token**: Represents voting power
2. **Proposal System**: Submit and discuss changes
3. **Voting Mechanism**: Decide on proposals
4. **Treasury**: Collective funds controlled by governance
5. **Execution**: Implement approved decisions

### Governance Models

**Token-weighted Voting:**
- 1 token = 1 vote
- Simple and direct
- Risk: Plutocracy (wealthy dominate)

**Quadratic Voting:**
- Cost of votes increases quadratically
- \`cost = votes^2\`
- 100 tokens → 10 votes (not 100)
- Balances whale influence
- Vulnerable to Sybil attacks

**Conviction Voting:**
- Voting power accumulates over time
- Measures long-term conviction, not just capital
- Prevents last-minute vote swings
- Used by: 1Hive, Gitcoin

**Optimistic Governance:**
- Proposals pass unless vetoed
- Good for routine decisions
- Requires engaged, vigilant community

**Holographic Consensus:**
- Predictors stake on proposal outcomes
- Popular predictions get boosted attention
- Used by: DAOstack

### Proposal Lifecycle

\`\`\`
Draft → Discussion → Temperature Check → Formal Vote → Execution
  ↓                                              ↓
(Forum)      (Off-chain signal)            (On-chain/multisig)
\`\`\`

**Typical parameters:**
- Quorum: 4-10% of total supply
- Passing threshold: 50-67%
- Voting period: 3-7 days
- Timelock: 24-48 hours before execution

### Treasury Management

**Multisig Treasuries:**
- Controlled by elected signers
- Require M-of-N signatures (e.g., 4/7)
- Faster execution than full governance
- Risk: Signer concentration

**On-chain Treasury:**
- Direct governance control
- Proposals execute automatically
- Higher security, slower execution
- Example: Compound Governor

### Legal Wrappers

DAOs exist in legal grey areas. Solutions:

**Wyoming DAO LLC:**
- First US legal framework
- Limited liability for members
- Requires registered agent

**Cayman Foundation:**
- Separate legal entity
- Can enter contracts
- Used by: ENS, Lido

**Swiss Association:**
- Non-profit structure
- Membership-based governance

**Unincorporated:**
- No legal wrapper
- Members potentially liable
- "Code is law" philosophy

### Coordination Problems

**Voter Apathy:**
- Low participation rates
- Solution: Delegation, incentives

**Whale Dominance:**
- Few large holders control votes
- Solution: Quadratic voting, reputation systems

**Short-termism:**
- Focus on immediate gains
- Solution: Conviction voting, long-term vesting

**Governance Attacks:**
- Flash loan voting
- Last-minute vote manipulation
- Solution: Vote escrow, timelocks

**Contributor Burnout:**
- Unsustainable workloads
- Solution: Working groups, compensation

### Successful DAO Patterns

1. **Progressive decentralization**: Start centralized, decentralize over time
2. **Sub-DAOs/Guilds**: Specialized working groups with delegated authority
3. **Minimum Viable Governance**: Simple rules, iterate as needed
4. **Retroactive funding**: Reward past contributions, not promises
5. **Reputation systems**: Non-transferable influence based on contribution
    `,
    codeExample: `
// Governor Contract with Timelocked Execution
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract DAOGovernor is 
    Governor,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorTimelockControl 
{
    uint256 public constant VOTING_DELAY = 1 days;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant QUORUM_PERCENTAGE = 4; // 4%
    
    constructor(
        IVotes _token,
        TimelockController _timelock
    ) 
        Governor("DAO Governor")
        GovernorVotes(_token)
        GovernorTimelockControl(_timelock)
    {}
    
    function votingDelay() public pure override returns (uint256) {
        return VOTING_DELAY / 12; // blocks (assuming 12s blocks)
    }
    
    function votingPeriod() public pure override returns (uint256) {
        return VOTING_PERIOD / 12;
    }
    
    function quorum(uint256) public view override returns (uint256) {
        return (token.totalSupply() * QUORUM_PERCENTAGE) / 100;
    }
    
    // Required overrides
    function state(uint256 proposalId)
        public view override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }
    
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }
    
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }
    
    function _executor() 
        internal view override(Governor, GovernorTimelockControl) 
        returns (address) 
    {
        return super._executor();
    }
    
    function supportsInterface(bytes4 interfaceId)
        public view override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
    `,
    keyPoints: [
      'DAOs encode organizational rules in smart contracts',
      'Different voting mechanisms balance different trade-offs',
      'Treasury management critical for DAO sustainability',
      'Legal wrappers provide liability protection',
      'Progressive decentralization often most practical path'
    ],
    relatedTopics: ['tokenomics', 'smart-contracts', 'wallets']
  },

  wallets: {
    slug: 'wallets',
    title: 'Wallet Infrastructure',
    description: 'EOAs vs Smart Wallets, ERC-4337 Account Abstraction, seed phrases, MPC wallets, and WalletConnect protocol',
    icon: '⬣',
    content: `
## The Gateway to Web3

Wallets are the primary interface between users and blockchain networks. They manage cryptographic keys, sign transactions, and interact with decentralized applications.

### Externally Owned Accounts (EOAs)

Traditional blockchain accounts controlled by private keys:

**Characteristics:**
- Single private key = complete control
- 256-bit entropy (2^256 possible keys)
- Address derived from public key
- Only humans can initiate transactions

**12/24-word seed phrases:**
\`\`\`
BIP-39 mnemonic → Master seed → HD wallet tree
                                     ├── Account 1
                                     ├── Account 2
                                     └── Account N
\`\`\`

**Security model:**
- Lose key = lose everything
- Key compromised = funds gone
- No recovery mechanism
- No automation possible

### Smart Contract Wallets

Wallets implemented as smart contracts with programmable logic:

**Capabilities:**
- Social recovery (guardians can reset)
- Multi-signature requirements
- Spending limits
- Session keys (gasless UX)
- Batched transactions
- Gas payment in any token

**Examples:**
- Safe (Gnosis Safe): Industry standard multisig
- Argent: Social recovery, guardians
- Sequence: Game-focused, batching

### ERC-4337: Account Abstraction

Native smart wallet support without protocol changes:

**Architecture:**
\`\`\`
User → UserOperation → Bundler → EntryPoint → Account Contract
                         ↓
                    Paymaster (sponsors gas)
\`\`\`

**Key components:**

1. **UserOperation**: Transaction signed by user (not gas-paying tx)
2. **Bundler**: Collects UserOps, submits to chain
3. **EntryPoint**: Singleton contract handling all UserOps
4. **Account Contract**: User's smart wallet
5. **Paymaster**: Optional gas sponsorship

**Benefits:**
- Gasless transactions for users
- Any token can pay for gas
- Batched operations in one tx
- Flexible validation logic
- Recovery mechanisms built-in

### MPC Wallets

Multi-Party Computation distributes key across multiple parties:

**How it works:**
1. Key generation creates shares (no single party has full key)
2. Threshold of parties (e.g., 2-of-3) combine to sign
3. Each party never sees full private key
4. Signatures indistinguishable from regular EOA

**Advantages:**
- No single point of failure
- Compatible with all chains (looks like EOA)
- Recoverable (company holds share)
- Regulatory-friendly (custody controls)

**Providers:**
- Fireblocks, Fordefi (institutional)
- Lit Protocol (decentralized MPC)
- Privy, Magic (consumer)

### WalletConnect Protocol

Open protocol for dApp-wallet communication:

**V2 Architecture:**
\`\`\`
dApp ← WebSocket → Relay Server ← WebSocket → Wallet
                (encrypted message passing)
\`\`\`

**Flow:**
1. dApp generates pairing URI (QR code)
2. Wallet scans, establishes encrypted session
3. dApp sends signing requests
4. Wallet prompts user, returns signatures
5. Works across any chain

### Wallet Security Best Practices

**Key Management:**
- Hardware wallets for significant holdings
- Never screenshot seed phrases
- Use passphrase for additional entropy
- Verify addresses on device

**Transaction Safety:**
- Verify contract addresses
- Check function signatures
- Use hardware wallet for signing
- Simulate transactions before sending

**Operational Security:**
- Separate hot/cold wallets
- Time-lock high-value accounts
- Regular security audits
- Revoke unnecessary approvals

### The Future of Wallets

**Trends:**
1. **Passkey wallets**: WebAuthn/biometric login
2. **Social recovery**: Guardians replace seed phrases
3. **Chain abstraction**: Single account across all chains
4. **Intent-based**: Declare what you want, wallet optimizes
5. **AI assistance**: Natural language transaction composition
    `,
    codeExample: `
// ERC-4337 Simple Account Implementation
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SimpleAccount is BaseAccount {
    using ECDSA for bytes32;
    
    address public owner;
    IEntryPoint private immutable _entryPoint;
    
    constructor(IEntryPoint entryPoint_, address owner_) {
        _entryPoint = entryPoint_;
        owner = owner_;
    }
    
    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;
    }
    
    // Validate UserOperation signature
    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal view override returns (uint256) {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        address recovered = hash.recover(userOp.signature);
        
        if (recovered != owner) {
            return SIG_VALIDATION_FAILED;
        }
        return 0; // Valid
    }
    
    // Execute arbitrary calls
    function execute(
        address dest,
        uint256 value,
        bytes calldata data
    ) external {
        _requireFromEntryPoint();
        _call(dest, value, data);
    }
    
    // Batch execute
    function executeBatch(
        address[] calldata dests,
        bytes[] calldata data
    ) external {
        _requireFromEntryPoint();
        require(dests.length == data.length, "Length mismatch");
        
        for (uint256 i = 0; i < dests.length; i++) {
            _call(dests[i], 0, data[i]);
        }
    }
    
    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }
    
    // Receive ETH
    receive() external payable {}
}

// Paymaster that sponsors gas for verified users
contract VerifyingPaymaster is BasePaymaster {
    mapping(address => bool) public verifiedUsers;
    
    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32,
        uint256
    ) external view override returns (bytes memory, uint256) {
        require(verifiedUsers[userOp.sender], "User not verified");
        return ("", 0); // Accept and sponsor
    }
    
    function verifyUser(address user) external onlyOwner {
        verifiedUsers[user] = true;
    }
}
    `,
    keyPoints: [
      'EOAs controlled by single private key with no recovery',
      'Smart wallets enable programmable security features',
      'ERC-4337 brings account abstraction without protocol changes',
      'MPC distributes key risk across multiple parties',
      'WalletConnect enables secure dApp-wallet communication'
    ],
    relatedTopics: ['smart-contracts', 'introduction', 'daos']
  },
};

export const docSections: DocSection[] = Object.values(web3Content);

export const getDocBySlug = (slug: string): DocSection | undefined => {
  return web3Content[slug];
};

export const getAllDocs = (): DocSection[] => {
  return Object.values(web3Content);
};

export const getDocSlugs = (): string[] => {
  return Object.keys(web3Content);
};
