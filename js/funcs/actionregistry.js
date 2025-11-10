//left is the codeblock on the left of the action block   
//right is the one on the right
//context is what it needs to interect with the game ex it pretty much always needs the gamegrid to find objects to move/attack  (maybe needs ex "stones and gamegrid" if we say stone-attack-left)
export const ActionRegistry = {  
    "move.to": (left, right, context) => {
        const { gameGrid } = context;

        if (left && right && left.canMove) {
            const direction = right.value;
            left.move(direction, gameGrid); // update position in the *game grid*
        }
    },
    "attack": (left, right, context) => {
        if (left && right) {
            left.attack(right, context);
        }
    },
};

//IMPORTANT theses are not Available Actions theses are just for example to see how to use them
//Not done yet
//You need to make the actual actions and add them to the registry for them to work
//Also you need to make sure the codeblock action values match the registry keys