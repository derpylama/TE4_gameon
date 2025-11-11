// Code Block Entities

//CodeBlockObject  MARK:OBJECTs
new CodeBlockObject(
    "stone",
    {"text": "Stone", "color": "#ffde2c"},
    StoneTile
);
new CodeBlockObject(
    "lava",
    {"text": "Lava", "color": "#ffde2c"},
    LavaTile
);
new CodeBlockObject(
    "void",
    {"text": "Void", "color": "#ffde2c"},
    VoidTile
);
new CodeBlockObject(
    "beehive",
    {"text": "Beehive", "color": "#ffde2c"},
    BeehiveTile
);


//CodeBlockModifier MARK:MODIFEIERs
new CodeBlockModifier(
    "left",
    {"text": "Left", "color": "#000000"},
);
new CodeBlockModifier(
    "right",
    {"text": "Right", "color": "#000000"},
);
new CodeBlockModifier(
    "down",
    {"text": "Down", "color": "#000000"},
);
new CodeBlockModifier(
    "up",
    {"text": "Up", "color": "#000000"},
);




//MARK:ACTIONs

//
new CodeBlockAction(
    "move.to",
    {"text": "MoveTo", "fontSizeOffset": -4, "color": "#ffde2c"},
    ["object", "modifier"]
);
new CodeBlockAction(
    "is",
    {"text": "Is", "fontSizeOffset": -4, "color": "#ffde2c"},
    ["object", "any"]
);