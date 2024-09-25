pragma solidity ^0.8.20;

// SPDX-License-Identifier: MIT

library TokenIdsUtils {
    function createGroupId(
        uint256 prevGroupId,
        uint256 blockNumber,
        uint256 blockTimestamp
    ) internal pure returns (uint256) {
        bytes32 prevGroupIdBytes = bytes32(prevGroupId);
        bytes32 blockNumberBytes = bytes32(blockNumber);
        bytes32 blockTimestampBytes = bytes32(blockTimestamp);

        bytes32 newGroupId = keccak256(
            abi.encodePacked(
                prevGroupIdBytes,
                blockNumberBytes,
                blockTimestampBytes
            )
        );

        uint256 newGroupIdInt = uint256(newGroupId) << 32;
        return newGroupIdInt;
    }

    function unpackTokenId(
        uint256 tokenId
    ) public pure returns (uint256, uint256) {
        uint256 maskGroupId = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000;
        uint256 groupId = tokenId & maskGroupId;
        uint256 tokenIdReal = tokenId &
            0x00000000000000000000000000000000000000000000000000000000FFFFFFFF;
        return (groupId, tokenIdReal);
    }

    function computeCombinedID(
        uint256 groupID,
        uint256 tokenID
    ) public pure returns (uint256) {
        // Extract the first 224 bits of groupID
        uint256 firstPart = groupID >> 32;

        // Extract the last 32 bits of tokenID
        uint256 lastPart = tokenID & 0xFFFFFFFF;

        // Combine the first 224 bits of groupID with the last 32 bits of tokenID
        uint256 combinedID = (firstPart << 32) | lastPart;

        return combinedID;
    }

    function combineGroupAndTokenID(
        uint256 groupID,
        uint32 tokenID
    ) internal pure returns (uint256) {
        // Combine the groupID and tokenID
        // Extract the first 224 bits of groupID
        uint256 firstPart = groupID >> 32;

        // Extract the last 32 bits of tokenID
        uint256 lastPart = tokenID & 0xFFFFFFFF;

        // Combine the first 224 bits of groupID with the last 32 bits of tokenID
        uint256 combinedID = (firstPart << 32) | lastPart;

        return combinedID;
    }

    function getGroupIdFromCombined(
        uint256 combinedID
    ) internal pure returns (uint256) {
        (uint256 groupId, ) = unpackTokenId(combinedID);

        return groupId;
    }

    function getTokenIDFromCombined(
        uint256 combinedID
    ) internal pure returns (uint256) {
        (, uint256 tokenId) = unpackTokenId(combinedID);

        return tokenId;
    }
}
