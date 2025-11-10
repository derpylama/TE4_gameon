// Here




function validateRow(blockrow) {
    for (let i = 0; i < blockrow.length; i++) {
        const block = blockrow[i];
        if (block instanceof CodeBlockAction) {
            const leftBlock = i > 0 ? blockrow[i - 1] : null;
            const rightBlock = i < blockrow.length - 1 ? blockrow[i + 1] : null;
            if (!block.validate([leftBlock, rightBlock])) {
                return false; // Invalid arrangement
            }
        }
    }
    return true; // All arrangements valid     try executing if true is returned
}