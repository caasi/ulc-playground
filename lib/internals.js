// XXX: should I use the Y combinator here?
const print =
  ['lam', 'node',
    ['int',
      [1],
      (node) => {
        switch (node[0]) {
          case 'var':
            console.log(node[1]);
            break;
          case 'lam':
          case 'app':
          case 'int':
            console.log(JSON.stringify(node));
            break;
        }
        return print;
      },
      []
    ]
  ];

export default {
  '+':
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
  '-':
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => ['var', `${+a[1] - +b[1]}`, 0],
          []
        ]
      ]
    ],
  '*':
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => ['var', `${+a[1] * +b[1]}`, 0],
          []
        ]
      ]
    ],
  '/':
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => ['var', `${+a[1] / +b[1]}`, 0],
          []
        ]
      ]
    ],
  '%':
    ['lam', 'a',
      ['lam', 'b',
        ['int',
          [2, 1],
          (a, b) => ['var', `${+a[1] % +b[1]}`, 0],
          []
        ]
      ]
    ],
  'print': print
};
