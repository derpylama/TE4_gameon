// Here




function validateRow(blockrow) { //made it take an entire row incase we wanna add ex "is" action for like  stone-is-tree-moveto-left   //change all stones to trees -> move all trees to left
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
    return true; // All arrangements valid (only checks actions are valid placements)   ->  try executing code if true is returned
}