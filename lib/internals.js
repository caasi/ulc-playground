import { LAMBDA_INPUT_REGISTER, LAMBDA_OUTPUT } from './constants/ActionTypes';

const RealWorld = ['var', 'RealWorld', 0];

export default {
  /*
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
  */
  // return :: a -> IO a
  'return': () =>
    ['lam', 'value',
      ['int',
        [1],
        (value) => {
          // test if value is an IO action
          if (
            value[0] === 'lam' &&
            value[2][0] === 'app' &&
            value[2][1][0] === 'app' &&
            value[2][2][0] === 'var' &&
            value[2][2][1] === 'RealWorld'
          ) {
            return value;
          } else {
            return ['lam', 'f',
              ['app',
                ['app',
                  ['var', 'f', 1],
                  value
                ],
                RealWorld
              ]
            ]
          }
        },
        []
      ]
    ],
  // unsafePerformIO :: IO a -> a
  'unsafePerformIO': () =>
    ['lam', 'IO-a',
      ['app',
        ['var', 'IO-a', 1],
        ['lam', 'a',
          ['lam', 'RealWorld',
            ['var', 'a', 2]
          ]
        ]
      ]
    ],
  // >>= :: IO a -> (a -> IO b) -> IO b
  'bind': () =>
    ['lam', 'IO-a',
      ['lam', 'a-to-IO-b',
        ['app',
          ['var', 'IO-a', 2],
          ['lam', 'a', // destructure the IO action
            ['lam', 'RealWorld',
              ['lam', 'f', // the new IO action
                ['app',
                  ['app',
                    ['var', 'f', 1],
                    ['app',
                      ['var', 'a-to-IO-b', 4],
                      ['var', 'a', 3]
                    ]
                  ],
                  ['var', 'RealWorld', 2]
                ]
              ]
            ]
          ]
        ]
      ]
    ],
  // putChar :: Char -> IO ()
  'putChar': () =>
    ['lam', 'c',
      ['int',
        [1],
        (c, dispatch) => {
          dispatch({
            type: LAMBDA_OUTPUT,
            output: c && c.length && c[1].charAt(0)
          });
          return ['lam', 'f',
            ['app',
              ['app',
                ['var', 'f', 1],
                ['var', '()', 0]
              ],
              RealWorld
            ]
          ]
        },
        []
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
    ]
};
