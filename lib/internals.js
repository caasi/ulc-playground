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
  'print':
    ['lam', 's',
      ['int',
        [1],
        (a) => console.log(a[1]) || a,
        []
      ]
    ]
};
