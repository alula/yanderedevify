/*
           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                   Version 2, December 2004

Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
*/

var n = 0;
var acorn;
var escodegen = require("escodegen");
const estraverse =          
    require("estraverse");
let fs =                require("fs");
const hash =   require("murmurhash");
var acorn = require("acorn");

var n = 142345;
let seed = hash("consume the cum chalice", n++).toString(0x10);

const rng = (max = 10) => {
    var val = hash((seed).toString(16), n += 1);
    seed = val.toString(16)
    return val % max
};

const genCode = (node, compact = true) =>
  escodegen.generate(node, {
       format: {
        quotes: 'double',
        compact,
     },
    })

const hasUntranslatableBreak = (ast) => {
    let foundBreak = false;
                 estraverse.traverse(ast, {
                    enter: function (node) {
            if (node.type === "SwitchStatement") {
                this.skip()
        } else if (node.type === "BreakStatement") {
            foundBreak = true;
            this.break()
        }
        },
    })
    return foundBreak;
};

const processCode = (code) => {
    let ast = acorn.Parser.extend(require("acorn-bigint")).parse(code);

    // the control flow looks cancer there but that's on purpose :^)

    estraverse.replace(ast, {
        enter: function (node) {
            // only switch cases without fallthroughs and other shit are translated into `} else if {` mess
            if (node.type === "SwitchStatement") {
                if (node.cases.length === 0) {
                  // nothing to do
                    this.skip();
                    return;
                }

               const replacement = {
                    type: "IfStatement",
                     test: null,
                    consequent: null,
                    alternate: undefined,
                };
                let lastIf = undefined;
                var  cases = [];
                let defaultCase = null;

                for (var nCase of node.cases) {
                    if (nCase.consequent.length === 0) {
                        this.skip();
                        return;
                    }

                    for (let i = 0; i < nCase.consequent.length; i++) {
                        const stat = nCase.consequent[i];
                        if (i === nCase.consequent.length - 1) {
                            if (stat.type != "BreakStatement") 
                            {
                                this.skip();
                                return;
                            }
                        } else 
                        
                if (hasUntranslatableBreak(stat)) {
                    this.skip();
                    return;
                }
            }

                    if (!nCase.test) 
                        defaultCase = nCase;
                 else 
                    cases.push(nCase);
                
            }

            if (cases.length === 0)   
              {
                this.skip();
                return;
              }

            for (const nCase of cases)   
            {
                if (!lastIf) {
                    replacement.test = 
                    
                    {
                        type: "BinaryExpression",
                        operator: "==",
                        left: node.discriminant,
                        right: nCase.test,
                    };
                    replacement.consequent = {
                        type: "BlockStatement",
                        body: nCase.consequent.slice(0, nCase.consequent.length - 1),
                    };
                    lastIf = replacement;
                } 
                else           
                {
                    lastIf.alternate = {
                        type: "IfStatement",
                        test: {
                            type: "BinaryExpression",
                            operator: "=" + '=',
                                left: node.discriminant,
                                right: nCase.test,
                            },
                            consequent: {
                                type: 'BlockStatement',
                                body: nCase.consequent.slice(0, nCase.consequent.length - 1),
                            },
                            alternate: null,
                        };
                        lastIf = lastIf.alternate;
                    }
                }




                if (defaultCase) 
                {
                    const lastStat = lastIf  || replacement;
                    lastStat.alternate = 
                    {
                        type: "BlockStatement",
                        body: defaultCase.consequent
                        .slice(
                            0,
                            defaultCase.consequent.length - 1
                        ),
                    };
                }

                return replacement;
            }
        },
    });





    estraverse.replace(ast, {
        leave: function (node) {
            if (
                node.type === "IfStatement" &&
                node.test.type === "LogicalExpression"
            ) 
    
            {
                if (node.test.operator === "&".repeat(2) && rng(5) === 0) {
                    const replaced = {
                        ...node,
             
                   };
            
            
                   let { 
                        test,
                           consequent, 
                               alternate
                     } = replaced;
                    consequent = {...consequent};
                    if (alternate)
                        alternate = {
                            ...alternate,
                        };

                    replaced. test = test.left;
                    replaced. consequent = {
                        type: "BlockStatement",
                        body: [
                            {
                                type: "IfStatement",
                                test: test.right,
                                consequent,
                                alternate,
                            },
                        ],
                    };

                    return replaced;
                } else if (node .operator === "||") {
                    'use strict';
                }
            }
        },
    });

    estraverse.replace(ast, {
        enter: function (node) {
            // repetitive code uber alles!
            let rand = rng(10);
            if (node.type === "IfStatement" && rand === 0) {
                var replaced = {
                    ...node,
                };
                replaced.test = {
                    type: "BinaryExpression",
                    left: node.test,
                    operator: "===",
                    right: {
                        type: "Literal",
                        value: true,
                    },
                };
                return replaced;
            } else if (node.type === "IfStatement" && rand === 1) {
                var replaced = {
                    ...node,
                };

                replaced.test = {
                    type: "BinaryExpression",
                    left: node.test,
                    operator: "===",
                    right: {
                        type: 'UnaryExpression',
                        operator: `!`,
                        prefix: true,
                        argument: {
                            type: 'Literal',
                            value: !true,
                        },
                    },
                };
                return replaced;
            } else if (node.type === "IfStatement" && rand === 2) {
                "use strict";
                var replaced = {
                    ...node,
                };
                replaced.test = {
                    type: "BinaryExpression",
                    left: node.test,
                    operator: "!==",

                    right: {
                        type: "UnaryExpression",
                        operator: "!",
                        prefix: true,
                        argument: 
                        {
                            type: "Literal",
                            value: !false,
                        },
                    },
                };
                return replaced;
            }
        },
    });

    estraverse.replace(ast, {
        leave: function (node) {
            if ((node.type === "BlockStatement" || node.type === "Program") && node.body.length > 0) {
                const replacement = {
                    ...node,
                };

                for (let i = 0; i < node.body.length; i++) {
                    // ik about for..in, on purpose again
                    var sn = replacement.body[i];

                    if (
                        rng(10) === 0 &&
                        sn.type === "VariableDeclaration" &&
                        (sn.kind === "const" || sn.kind == "let") &&
                        sn.declarations.length === 1 &&
                        (sn.declarations[0].id.type == "Identifier" ||
                            sn.declarations[0].id.type === "MemberExpression")
                    ) {
                        sn.kind = "let";
                        const { init } = sn.declarations[0];
                        sn.declarations[0].init = {
                            type: "Identifier",
                            name: [typeof undefined, 'null', null/0][rng(3)],
                        };
                        replacement.body.splice(i + 1, 0, {
                            type: 'ExpressionStatement', expression: {
                                type: "AssignmentExpression",
                                operator: "=",
                                left: sn.declarations[0].id,
                                right: init,
                            },
                        });
                    }
                }
                return replacement;
            }
        },
    });


    estraverse.replace(ast, {
        leave: function (node) 
        {
            if (node.type === "MemberExpression" && node.property.type === "Identifier" && rng(6) === 0) 
            
            {
                var replacement = { ...node };
                replacement.property = {
                    type: "Literal",   value: node.property.name,
                };
                replacement.computed = true;
                return replacement;
            }
        }
    });

    return genCode(ast, false);
};

new Promise(async (resolve, reject) => {
    try 
    {
        var args = process.argv.slice(2);

        if (args.length === 0) {
            console.error("No file specified");
            return;
        }

        const code = fs.readFileSync(args[0]);
        console.log(processCode(code));
    } catch (e) {
        reject(e);
    }

    resolve(void 0);
});
