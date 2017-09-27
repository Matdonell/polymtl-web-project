import { IPuzzleItemData, PuzzleItem } from "../models/puzzle";

export const PUZZLE_ITEMS_DATA: Array<Array<IPuzzleItemData>> = [
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, {_value: 3, _hide: true},
        {_value: 4, _hide: true}, {_value: 5, _hide: true}, {_value: 6, _hide: true},
        {_value: 7, _hide: true}, {_value: 8, _hide: true}, {_value: 9, _hide: true}
    ],
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, {_value: 3, _hide: true},
        {_value: 4, _hide: true}, {_value: 5, _hide: true}, {_value: 6, _hide: true},
        {_value: 7, _hide: true}, {_value: 8, _hide: true}, {_value: 9, _hide: true}
    ],
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, {_value: 3, _hide: true},
        {_value: 4, _hide: true}, {_value: 5, _hide: true}, {_value: 6, _hide: true},
        {_value: 7, _hide: true}, {_value: 8, _hide: true}, {_value: 9, _hide: true}
    ],
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, {_value: 3, _hide: true},
        {_value: 4, _hide: true}, {_value: 5, _hide: true}, {_value: 6, _hide: true},
        {_value: 7, _hide: true}, {_value: 8, _hide: true}, {_value: 9, _hide: true}
    ],
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, {_value: 3, _hide: true},
        {_value: 4, _hide: true}, {_value: 5, _hide: true}, {_value: 6, _hide: true},
        {_value: 7, _hide: true}, {_value: 8, _hide: true}, {_value: 9, _hide: true}
    ],
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, {_value: 3, _hide: true},
        {_value: 4, _hide: true}, {_value: 5, _hide: true}, {_value: 6, _hide: true},
        {_value: 7, _hide: true}, {_value: 8, _hide: true}, {_value: 9, _hide: true}
    ],
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, {_value: 3, _hide: true},
        {_value: 4, _hide: true}, {_value: 5, _hide: true}, {_value: 6, _hide: true},
        {_value: 7, _hide: true}, {_value: 8, _hide: true}, {_value: 9, _hide: true}
    ],
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, {_value: 3, _hide: true},
        {_value: 4, _hide: true}, {_value: 5, _hide: true}, {_value: 6, _hide: true},
        {_value: 7, _hide: true}, {_value: 8, _hide: true}, {_value: 9, _hide: true}
    ],
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, {_value: 3, _hide: true},
        {_value: 4, _hide: true}, {_value: 5, _hide: true}, {_value: 6, _hide: true},
        {_value: 7, _hide: true}, {_value: 8, _hide: true}, {_value: 9, _hide: true}
    ]
];

export const INVALID_PUZZLE_ITEMS_DATA_1: Array<Array<IPuzzleItemData>> = [
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, {_value: 3, _hide: true},
        {_value: 4, _hide: true}, {_value: 5, _hide: true}, {_value: 6, _hide: true},
        {_value: 7, _hide: true}, {_value: 8, _hide: true}, {_value: 9, _hide: true}
    ]
];

export const INVALID_PUZZLE_ITEMS_DATA_2: Array<Array<IPuzzleItemData>> = [
    [
        {_value: 1, _hide: true}, {_value: 2, _hide: true}, null
    ]
];

export const FAKE_PUZZLE_FEED = [

    [
        new PuzzleItem(4, true), new PuzzleItem(1, true), new PuzzleItem(5, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true),
        new PuzzleItem(9, true), new PuzzleItem(7, true), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(3, true), new PuzzleItem(6, false), new PuzzleItem(2, false),
        new PuzzleItem(4, false), new PuzzleItem(7, true), new PuzzleItem(9, true),
        new PuzzleItem(1, true), new PuzzleItem(8, false), new PuzzleItem(5, true)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(8, true), new PuzzleItem(9, true),
        new PuzzleItem(2, false), new PuzzleItem(1, true), new PuzzleItem(5, false),
        new PuzzleItem(3, true), new PuzzleItem(6, true), new PuzzleItem(4, true)
    ],
    [
        new PuzzleItem(9, true), new PuzzleItem(2, true), new PuzzleItem(6, false),
        new PuzzleItem(3, true), new PuzzleItem(4, true), new PuzzleItem(1, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(8, false)
    ],
    [
        new PuzzleItem(1, true), new PuzzleItem(3, true), new PuzzleItem(8, true),
        new PuzzleItem(7, true), new PuzzleItem(5, true), new PuzzleItem(6, true),
        new PuzzleItem(4, true), new PuzzleItem(2, true), new PuzzleItem(9, true)
    ],
    [
        new PuzzleItem(5, true), new PuzzleItem(7, false), new PuzzleItem(4, true),
        new PuzzleItem(9, true), new PuzzleItem(8, true), new PuzzleItem(2, true),
        new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(1, true)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(5, true), new PuzzleItem(7, true),
        new PuzzleItem(1, false), new PuzzleItem(6, true), new PuzzleItem(4, false),
        new PuzzleItem(8, false), new PuzzleItem(9, true), new PuzzleItem(3, true)
    ],
    [
        new PuzzleItem(8, true), new PuzzleItem(4, true), new PuzzleItem(3, true),
        new PuzzleItem(5, false), new PuzzleItem(9, true), new PuzzleItem(7, true),
        new PuzzleItem(2, true), new PuzzleItem(1, true), new PuzzleItem(6, true)
    ],
    [
        new PuzzleItem(6, true), new PuzzleItem(9, true), new PuzzleItem(1, true),
        new PuzzleItem(8, false), new PuzzleItem(2, false), new PuzzleItem(3, true),
        new PuzzleItem(5, true), new PuzzleItem(4, true), new PuzzleItem(7, false)
    ]
];

export const INITIAL_PUZZLE_SEED = [

    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(3, false), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(2, false)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(6, false), new PuzzleItem(2, false),
        new PuzzleItem(4, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(8, false), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(2, false), new PuzzleItem(null, true), new PuzzleItem(5, false),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(6, false),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(8, false)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(7, false), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(3, false), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(2, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(1, false), new PuzzleItem(null, true), new PuzzleItem(4, false),
        new PuzzleItem(8, false), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true)
    ],
    [
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(null, true),
        new PuzzleItem(8, false), new PuzzleItem(2, false), new PuzzleItem(null, true),
        new PuzzleItem(null, true), new PuzzleItem(null, true), new PuzzleItem(7, false)
    ]
];
