Num | Detector | What it Detects | Impact | Confidence
--- | --- | --- | --- | ---
1 | `abiencoderv2-array` | [Storage abiencoderv2 array](https://github.com/crytic/slither/wiki/Detector-Documentation#storage-abiencoderv2-array) | High | High
2 | `arbitrary-send-erc20` | [transferFrom uses arbitrary `from`](https://github.com/crytic/slither/wiki/Detector-Documentation#arbitrary-from-in-transferfrom) | High | High
3 | `array-by-reference` | [Modifying storage array by value](https://github.com/crytic/slither/wiki/Detector-Documentation#modifying-storage-array-by-value) | High | High
4 | `encode-packed-collision` | [ABI encodePacked Collision](https://github.com/crytic/slither/wiki/Detector-Documentation#abi-encodePacked-collision) | High | High
5 | `incorrect-shift` | [The order of parameters in a shift instruction is incorrect.](https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-shift-in-assembly) | High | High
6 | `multiple-constructors` | [Multiple constructor schemes](https://github.com/crytic/slither/wiki/Detector-Documentation#multiple-constructor-schemes) | High | High
7 | `name-reused` | [Contract's name reused](https://github.com/crytic/slither/wiki/Detector-Documentation#name-reused) | High | High
8 | `protected-vars` | [Detected unprotected variables](https://github.com/crytic/slither/wiki/Detector-Documentation#protected-variables) | High | High
9 | `public-mappings-nested` | [Public mappings with nested variables](https://github.com/crytic/slither/wiki/Detector-Documentation#public-mappings-with-nested-variables) | High | High
10 | `rtlo` | [Right-To-Left-Override control character is used](https://github.com/crytic/slither/wiki/Detector-Documentation#right-to-left-override-character) | High | High
11 | `shadowing-state` | [State variables shadowing](https://github.com/crytic/slither/wiki/Detector-Documentation#state-variable-shadowing) | High | High
12 | `suicidal` | [Functions allowing anyone to destruct the contract](https://github.com/crytic/slither/wiki/Detector-Documentation#suicidal) | High | High
13 | `uninitialized-state` | [Uninitialized state variables](https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-state-variables) | High | High
14 | `uninitialized-storage` | [Uninitialized storage variables](https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-storage-variables) | High | High
15 | `unprotected-upgrade` | [Unprotected upgradeable contract](https://github.com/crytic/slither/wiki/Detector-Documentation#unprotected-upgradeable-contract) | High | High
16 | `codex` | [Use Codex to find vulnerabilities.](https://github.com/crytic/slither/wiki/Detector-Documentation#codex) | High | Low
17 | `arbitrary-send-erc20-permit` | [transferFrom uses arbitrary from with permit](https://github.com/crytic/slither/wiki/Detector-Documentation#arbitrary-from-in-transferfrom-used-with-permit) | High | Medium
18 | `arbitrary-send-eth` | [Functions that send Ether to arbitrary destinations](https://github.com/crytic/slither/wiki/Detector-Documentation#functions-that-send-ether-to-arbitrary-destinations) | High | Medium
19 | `controlled-array-length` | [Tainted array length assignment](https://github.com/crytic/slither/wiki/Detector-Documentation#array-length-assignment) | High | Medium
20 | `controlled-delegatecall` | [Controlled delegatecall destination](https://github.com/crytic/slither/wiki/Detector-Documentation#controlled-delegatecall) | High | Medium
21 | `delegatecall-loop` | [Payable functions using `delegatecall` inside a loop](https://github.com/crytic/slither/wiki/Detector-Documentation/#payable-functions-using-delegatecall-inside-a-loop) | High | Medium
22 | `incorrect-exp` | [Incorrect exponentiation](https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-exponentiation) | High | Medium
23 | `incorrect-return` | [If a `return` is incorrectly used in assembly mode.](https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-return-in-assembly) | High | Medium
24 | `msg-value-loop` | [msg.value inside a loop](https://github.com/crytic/slither/wiki/Detector-Documentation/#msgvalue-inside-a-loop) | High | Medium
25 | `reentrancy-eth` | [Reentrancy vulnerabilities (theft of ethers)](https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities) | High | Medium
26 | `return-leave` | [If a `return` is used instead of a `leave`.](https://github.com/crytic/slither/wiki/Detector-Documentation#return-instead-of-leave-in-assembly) | High | Medium
27 | `storage-array` | [Signed storage integer array compiler bug](https://github.com/crytic/slither/wiki/Detector-Documentation#storage-signed-integer-array) | High | Medium
28 | `unchecked-transfer` | [Unchecked tokens transfer](https://github.com/crytic/slither/wiki/Detector-Documentation#unchecked-transfer) | High | Medium
29 | `weak-prng` | [Weak PRNG](https://github.com/crytic/slither/wiki/Detector-Documentation#weak-PRNG) | High | Medium
30 | `domain-separator-collision` | [Detects ERC20 tokens that have a function whose signature collides with EIP-2612's DOMAIN_SEPARATOR()](https://github.com/crytic/slither/wiki/Detector-Documentation#domain-separator-collision) | Medium | High
31 | `enum-conversion` | [Detect dangerous enum conversion](https://github.com/crytic/slither/wiki/Detector-Documentation#dangerous-enum-conversion) | Medium | High
32 | `erc20-interface` | [Incorrect ERC20 interfaces](https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-erc20-interface) | Medium | High
33 | `erc721-interface` | [Incorrect ERC721 interfaces](https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-erc721-interface) | Medium | High
34 | `incorrect-equality` | [Dangerous strict equalities](https://github.com/crytic/slither/wiki/Detector-Documentation#dangerous-strict-equalities) | Medium | High
35 | `locked-ether` | [Contracts that lock ether](https://github.com/crytic/slither/wiki/Detector-Documentation#contracts-that-lock-ether) | Medium | High
36 | `mapping-deletion` | [Deletion on mapping containing a structure](https://github.com/crytic/slither/wiki/Detector-Documentation#deletion-on-mapping-containing-a-structure) | Medium | High
37 | `shadowing-abstract` | [State variables shadowing from abstract contracts](https://github.com/crytic/slither/wiki/Detector-Documentation#state-variable-shadowing-from-abstract-contracts) | Medium | High
38 | `tautological-compare` | [Comparing a variable to itself always returns true or false, depending on comparison](https://github.com/crytic/slither/wiki/Detector-Documentation#tautological-compare) | Medium | High
39 | `tautology` | [Tautology or contradiction](https://github.com/crytic/slither/wiki/Detector-Documentation#tautology-or-contradiction) | Medium | High
40 | `write-after-write` | [Unused write](https://github.com/crytic/slither/wiki/Detector-Documentation#write-after-write) | Medium | High
41 | `boolean-cst` | [Misuse of Boolean constant](https://github.com/crytic/slither/wiki/Detector-Documentation#misuse-of-a-boolean-constant) | Medium | Medium
42 | `constant-function-asm` | [Constant functions using assembly code](https://github.com/crytic/slither/wiki/Detector-Documentation#constant-functions-using-assembly-code) | Medium | Medium
43 | `constant-function-state` | [Constant functions changing the state](https://github.com/crytic/slither/wiki/Detector-Documentation#constant-functions-changing-the-state) | Medium | Medium
44 | `divide-before-multiply` | [Imprecise arithmetic operations order](https://github.com/crytic/slither/wiki/Detector-Documentation#divide-before-multiply) | Medium | Medium
45 | `out-of-order-retryable` | [Out-of-order retryable transactions](https://github.com/crytic/slither/wiki/Detector-Documentation#out-of-order-retryable-transactions) | Medium | Medium
46 | `reentrancy-no-eth` | [Reentrancy vulnerabilities (no theft of ethers)](https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-1) | Medium | Medium
47 | `reused-constructor` | [Reused base constructor](https://github.com/crytic/slither/wiki/Detector-Documentation#reused-base-constructors) | Medium | Medium
48 | `tx-origin` | [Dangerous usage of `tx.origin`](https://github.com/crytic/slither/wiki/Detector-Documentation#dangerous-usage-of-txorigin) | Medium | Medium
49 | `unchecked-lowlevel` | [Unchecked low-level calls](https://github.com/crytic/slither/wiki/Detector-Documentation#unchecked-low-level-calls) | Medium | Medium
50 | `unchecked-send` | [Unchecked send](https://github.com/crytic/slither/wiki/Detector-Documentation#unchecked-send) | Medium | Medium
51 | `uninitialized-local` | [Uninitialized local variables](https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-local-variables) | Medium | Medium
52 | `unused-return` | [Unused return values](https://github.com/crytic/slither/wiki/Detector-Documentation#unused-return) | Medium | Medium
53 | `incorrect-modifier` | [Modifiers that can return the default value](https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-modifier) | Low | High
54 | `shadowing-builtin` | [Built-in symbol shadowing](https://github.com/crytic/slither/wiki/Detector-Documentation#builtin-symbol-shadowing) | Low | High
55 | `shadowing-local` | [Local variables shadowing](https://github.com/crytic/slither/wiki/Detector-Documentation#local-variable-shadowing) | Low | High
56 | `uninitialized-fptr-cst` | [Uninitialized function pointer calls in constructors](https://github.com/crytic/slither/wiki/Detector-Documentation#uninitialized-function-pointers-in-constructors) | Low | High
57 | `variable-scope` | [Local variables used prior their declaration](https://github.com/crytic/slither/wiki/Detector-Documentation#pre-declaration-usage-of-local-variables) | Low | High
58 | `void-cst` | [Constructor called not implemented](https://github.com/crytic/slither/wiki/Detector-Documentation#void-constructor) | Low | High
59 | `calls-loop` | [Multiple calls in a loop](https://github.com/crytic/slither/wiki/Detector-Documentation/#calls-inside-a-loop) | Low | Medium
60 | `events-access` | [Missing Events Access Control](https://github.com/crytic/slither/wiki/Detector-Documentation#missing-events-access-control) | Low | Medium
61 | `events-maths` | [Missing Events Arithmetic](https://github.com/crytic/slither/wiki/Detector-Documentation#missing-events-arithmetic) | Low | Medium
62 | `incorrect-unary` | [Dangerous unary expressions](https://github.com/crytic/slither/wiki/Detector-Documentation#dangerous-unary-expressions) | Low | Medium
63 | `missing-zero-check` | [Missing Zero Address Validation](https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation) | Low | Medium
64 | `reentrancy-benign` | [Benign reentrancy vulnerabilities](https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-2) | Low | Medium
65 | `reentrancy-events` | [Reentrancy vulnerabilities leading to out-of-order Events](https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3) | Low | Medium
66 | `return-bomb` | [A low level callee may consume all callers gas unexpectedly.](https://github.com/crytic/slither/wiki/Detector-Documentation#return-bomb) | Low | Medium
67 | `timestamp` | [Dangerous usage of `block.timestamp`](https://github.com/crytic/slither/wiki/Detector-Documentation#block-timestamp) | Low | Medium
68 | `assembly` | [Assembly usage](https://github.com/crytic/slither/wiki/Detector-Documentation#assembly-usage) | Informational | High
69 | `assert-state-change` | [Assert state change](https://github.com/crytic/slither/wiki/Detector-Documentation#assert-state-change) | Informational | High
70 | `boolean-equal` | [Comparison to boolean constant](https://github.com/crytic/slither/wiki/Detector-Documentation#boolean-equality) | Informational | High
71 | `cyclomatic-complexity` | [Detects functions with high (> 11) cyclomatic complexity](https://github.com/crytic/slither/wiki/Detector-Documentation#cyclomatic-complexity) | Informational | High
72 | `deprecated-standards` | [Deprecated Solidity Standards](https://github.com/crytic/slither/wiki/Detector-Documentation#deprecated-standards) | Informational | High
73 | `erc20-indexed` | [Un-indexed ERC20 event parameters](https://github.com/crytic/slither/wiki/Detector-Documentation#unindexed-erc20-event-parameters) | Informational | High
74 | `function-init-state` | [Function initializing state variables](https://github.com/crytic/slither/wiki/Detector-Documentation#function-initializing-state) | Informational | High
75 | `incorrect-using-for` | [Detects using-for statement usage when no function from a given library matches a given type](https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-using-for-usage) | Informational | High
76 | `low-level-calls` | [Low level calls](https://github.com/crytic/slither/wiki/Detector-Documentation#low-level-calls) | Informational | High
77 | `missing-inheritance` | [Missing inheritance](https://github.com/crytic/slither/wiki/Detector-Documentation#missing-inheritance) | Informational | High
78 | `naming-convention` | [Conformity to Solidity naming conventions](https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions) | Informational | High
79 | `pragma` | [If different pragma directives are used](https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used) | Informational | High
80 | `redundant-statements` | [Redundant statements](https://github.com/crytic/slither/wiki/Detector-Documentation#redundant-statements) | Informational | High
81 | `solc-version` | [Incorrect Solidity version](https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity) | Informational | High
82 | `unimplemented-functions` | [Unimplemented functions](https://github.com/crytic/slither/wiki/Detector-Documentation#unimplemented-functions) | Informational | High
83 | `unused-import` | [Detects unused imports](https://github.com/crytic/slither/wiki/Detector-Documentation#unused-imports) | Informational | High
84 | `unused-state` | [Unused state variables](https://github.com/crytic/slither/wiki/Detector-Documentation#unused-state-variable) | Informational | High
85 | `costly-loop` | [Costly operations in a loop](https://github.com/crytic/slither/wiki/Detector-Documentation#costly-operations-inside-a-loop) | Informational | Medium
86 | `dead-code` | [Functions that are not used](https://github.com/crytic/slither/wiki/Detector-Documentation#dead-code) | Informational | Medium
87 | `reentrancy-unlimited-gas` | [Reentrancy vulnerabilities through send and transfer](https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-4) | Informational | Medium
88 | `too-many-digits` | [Conformance to numeric notation best practices](https://github.com/crytic/slither/wiki/Detector-Documentation#too-many-digits) | Informational | Medium
89 | `cache-array-length` | [Detects `for` loops that use `length` member of some storage array in their loop condition and don't modify it.](https://github.com/crytic/slither/wiki/Detector-Documentation#cache-array-length) | Optimization | High
90 | `constable-states` | [State variables that could be declared constant](https://github.com/crytic/slither/wiki/Detector-Documentation#state-variables-that-could-be-declared-constant) | Optimization | High
91 | `external-function` | [Public function that could be declared external](https://github.com/crytic/slither/wiki/Detector-Documentation#public-function-that-could-be-declared-external) | Optimization | High
92 | `immutable-states` | [State variables that could be declared immutable](https://github.com/crytic/slither/wiki/Detector-Documentation#state-variables-that-could-be-declared-immutable) | Optimization | High
93 | `var-read-using-this` | [Contract reads its own variable using `this`](https://github.com/crytic/slither/wiki/Detector-Documentation#public-variable-read-in-external-context) | Optimization | High