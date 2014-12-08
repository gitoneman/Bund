var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Collect = new keystone.List('Collect', {
    label: '搜集',
    singular: '搜集',
    plural: '搜集',
    map: { name: '项目' }
});

Collect.add({
    '项目': { type: String, required: true},
    'A': { type: String },
    'B': { type: String },
    'C': { type: String },
    'D': { type: String },
    'E': { type: String },
    'F': { type: String },
    'G': { type: String },
    'H': { type: String },
    'I': { type: String },
    'J': { type: String },
    'K': { type: String },
    'L': { type: String },
    'M': { type: String },
    'N': { type: String },
    'O': { type: String },
    'P': { type: String },
    'Q': { type: String },
    'R': { type: String },
    'S': { type: String },
    'T': { type: String },
    'U': { type: String },
    'V': { type: String },
    'W': { type: String },
    'X': { type: String },
    'Y': { type: String },
    'Z': { type: String }
});

Collect.defaultColumns = '项目, A, B, C, D, E, F, G, H, I';

Collect.register();