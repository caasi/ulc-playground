import { LAMBDA_INPUT_REGISTER, LAMBDA_OUTPUT } from './constants/ActionTypes';

const RealWorld = ['var', 'RealWorld', 0];

export default {
  '+': () =>
    ['lam', 'a',
      ['lam', 'b',
        // a internal function which will take 2 arguments
        ['int',
          // arguments in De Bruijn index
          [2, 1],
          // var a => var b => var (a + b)
          (a, b) => ['var', `${+a[1] + +b[1]}`, 0],
          // arguments
          []
        ]
      ]
    ],
  '-': () =>
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => ['var', `${+a[1] - +b[1]}`, 0],
          []
        ]
      ]
    ],
  '*': () =>
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => ['var', `${+a[1] * +b[1]}`, 0],
          []
        ]
      ]
    ],
  '/': () =>
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => ['var', `${+a[1] / +b[1]}`, 0],
          []
        ]
      ]
    ],
  '%': () =>
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => ['var', `${+a[1] % +b[1]}`, 0],
          []
        ]
      ]
    ],
  'cons': () =>
    ['lam', 'x',
      ['lam', 'xs',
        ['lam', 'f',
          ['app',
            ['app',
              ['var', 'f', 1],
              ['var', 'x', 3]
            ],
            ['var', 'xs', 2]
          ]
        ]
      ]
    ],
  'car': () =>
    ['lam', 'xs',
      ['app',
        ['var', 'xs', 1],
        ['lam', 'a',
          ['lam', 'b',
            ['var', 'a', 2]
          ]
        ]
      ]
    ],
  'cdr': () =>
    ['lam', 'xs',
      ['app',
        ['var', 'xs', 1],
        ['lam', 'a',
          ['lam', 'b',
            ['var', 'b', 1]
          ]
        ]
      ]
    ],
  'Y': () =>
    ['lam', 'f',
      ['app',
        ['lam', 'x',
          ['app',
            ['var', 'f', 2],
            ['app',
              ['var', 'x', 1],
              ['var', 'x', 1]
            ]
          ]
        ],
        ['lam', 'x',
          ['app',
            ['var', 'f', 2],
            ['app',
              ['var', 'x', 1],
              ['var', 'x', 1]
            ]
          ]
        ]
      ]
    ],
  // unsafePerformIO :: IO a -> a
  'unsafePerformIO': () =>
    ['var', 'car', 0],
  // >>= :: IO a -> ((b -> IO b) -> a -> IO b) -> IO b
  'bind': () =>
    ['lam', 'IO-a',
      ['lam', 'return-a-to-IO-b',
        ['app',
          ['var', 'IO-a', 2],
          ['lam', 'a', // destructure the IO action
            ['lam', 'RealWorld',
              ['app',
                ['app',
                  ['var', 'return-a-to-IO-b', 3],
                  ['lam', 'a', // return
                    ['lam', 'f',
                      ['app',
                        ['app',
                          ['var', 'f', 1],
                          ['var', 'a', 2]
                        ],
                        ['var', 'RealWorld', 3]
                      ]
                    ]
                  ]
                ],
                ['var', 'a', 2]
              ]
            ]
          ]
        ]
      ]
    ],
  // putChar :: (Char -> IO ()) -> Char -> IO ()
  'putChar': () =>
    ['lam', 'return',
      ['lam', 'c',
        ['int',
          [2, 1],
          (ret, c, dispatch) => {
            dispatch({
              type: LAMBDA_OUTPUT,
              output: c && c.length && c[1].charAt(0)
            });
            return (
              ['app',
                ret,
                ['var', '()', 0]
              ]
            )
          },
          []
        ]
      ]
    ],
  // getChar :: IO Char
  'getChar': () =>
    ['int',
      [],
      (dispatch) => {
        return new Promise((resolve, reject) => {
          dispatch({
            type: LAMBDA_INPUT_REGISTER,
            resolve: resolve
          });
        })
          .then(c =>
            ['lam', 'f',
              ['app',
                ['app',
                  ['var', 'f', 1],
                  ['var', c, 0]
                ],
                RealWorld
              ]
            ]
          );
      },
      []
    ],
  'id': () =>
    ['lam', 'a',
      ['var', 'a', 1]
    ],
  'if-then-else': () =>
    ['var', 'id', 0],
  'true': () =>
    ['lam', 'a',
      ['lam', 'b',
        ['var', 'a', 2]
      ]
    ],
  'false': () =>
    ['lam', 'a',
      ['lam', 'b',
        ['var', 'b', 1]
      ]
    ],
  '>': () =>
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => +a[1] > +b[1] ? ['var', 'true', 0] : ['var', 'false', 0],
          []
        ]
      ]
    ],
  '=': () =>
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => a[1] === b[1] ? ['var', 'true', 0] : ['var', 'false', 0],
          []
        ]
      ]
    ],
  '<': () =>
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => +a[1] < +b[1] ? ['var', 'true', 0] : ['var', 'false', 0],
          []
        ]
      ]
    ],
  // getLine :: IO List
  'getLine': () =>
    ['app',
      ['var', 'Y', 0],
      ['lam', 'getLine',
        ['app',
          ['app',
            ['var', 'bind', 0],
            ['var', 'getChar', 0]
          ],
          ['lam', 'return', // \return \c ->
            ['lam', 'c',
              ['app',
                ['app',
                  ['app', // if (= c '\n')
                    ['app',
                      ['var', '=', 0],
                      ['var', 'c', 1]
                    ],
                    ['var', '\n', 0]
                  ],
                  ['app', // then return nil
                    ['var', 'return', 2],
                    ['var', 'nil', 0]
                  ]
                ],
                ['app', // else getLine >>= \return \cs -> return c : cs
                  ['app',
                    ['var', 'bind', 0],
                    ['var', 'getLine', 3]
                  ],
                  ['lam', 'return',
                    ['lam', 'cs',
                      ['app',
                        ['var', 'return', 2],
                        ['app',
                          ['app',
                            ['var', 'cons', 0],
                            ['var', 'c', 3]
                          ],
                          ['var', 'cs', 1]
                        ]
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ],
  // putLine :: (() -> IO ()) -> List -> IO ()
  'putLine': () =>
    ['app',
      ['var', 'Y', 0],
      ['lam', 'putLine',
        ['lam', 'return',
          ['lam', 'list',
            ['app',
              ['var', 'list', 1], // destructure the list
              ['lam', 'c',
                ['lam', 'cs',
                  ['app', // putChar c >>= \retrun () ->
                    ['app',
                      ['var', 'bind', 0],
                      ['app',
                        ['app',
                          ['var', 'putChar', 0],
                          ['var', 'return', 4]
                        ],
                        ['var', 'c', 2]
                      ]
                    ],
                    ['lam', 'return',
                      ['lam', '()',
                        ['app',
                          ['app',
                            ['app', // if (= cs nil)
                              ['app',
                                ['var', '=', 0],
                                ['var', 'cs', 3]
                              ],
                              ['var', 'nil', 0]
                            ],
                            ['app', // return ()
                              ['var', 'return', 2],
                              ['var', '()', 1]
                            ]
                          ],
                          ['app',   // return putLine return cs
                            ['app',
                              ['var', 'putLine', 7],
                              ['var', 'return', 2]
                            ],
                            ['var', 'cs', 3]
                          ]
                        ]
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]
};
