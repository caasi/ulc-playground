export default (env) => ({
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
  'RealWorld': () =>
    ['int', 'RealWorld'],
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
            value[2][2][0] === 'int' &&
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
                ['int', 'RealWorld']
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
        ['lam', 'a',
          ['lam', 'RealWorld',
            ['var', 'a', 2]
          ]
        ],
        ['var', 'IO-a', 1]
      ]
    ],
  // >>= :: IO a -> (a -> IO b) -> IO b
  'bind': () =>
    ['lam', 'IO-a',
      ['lam', 'f',
        ['app', // destructure the IO a
          ['lam', 'a',
            ['lam', 'RealWorld',
              ['lam', 'f', // create a new IO action
                ['app',
                  ['app',
                    ['var', 'f', 1],
                    ['app',
                      ['var', 'f', 4],
                      ['var', 'a', 3]
                    ]
                  ],
                  ['var', 'RealWorld', 2]
                ]
              ]
            ]
          ],
          ['var', 'IO-a', 2]
        ]
      ]
    ],
  // putChar :: Char -> IO ()
  'putChar': () =>
    ['lam', 'c',
      ['int',
        [1],
        (c) => {
          console.log(c[1].charAt(0));
          return ['lam', 'f',
            ['app',
              ['app',
                ['var', 'f', 1],
                ['var', '()', 0]
              ],
              ['int', 'RealWorld']
            ]
          ]
        },
        []
      ]
    ],
  // getChar :: IO Char
  'getChar': () =>
    env.getChar()
      .then(c =>
        ['lam', 'f',
          ['app',
            ['app',
              ['var', 'f', 1],
              ['var', c, 0]
            ],
            ['int', 'RealWorld']
          ]
        ]
      )
});
