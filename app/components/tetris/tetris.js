'use strict';

angular.module('angular-tetris.tetris', [])

.component('tetris', {
    'templateUrl': 'components/tetris/tetris.html',
    'controller': function($scope, $element, $attrs) {
        var ctrl = this;
        
        ctrl.score = 0;
        
        ctrl.board = [];
        ctrl.anchors = [];
        
        // generate the board
        // and the anchored blocks
        for (var i = 0; i < 22; i++) {
            ctrl.board.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            ctrl.anchors.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
        
        // tetris possible blocks
        // more infomration http://tetris.wikia.com/wiki/Tetromino
        // each number means different color
        var blocks = {
            'I': [[1, 1, 1, 1]],
            'O': [[2, 2], [2, 2]],
            'T': [[0, 3, 0], [3, 3, 3]],
            'S': [[0, 4, 4], [4, 4, 0]],
            'Z': [[5, 5, 0], [0, 5, 5]],
            'J': [[6, 0, 0], [6, 6, 6]],
            'L': [[0, 0, 7], [7, 7, 7]]
        };
        
        // initialize the first block
        getNextBlock();
        placeBlock();
        
        // returns a random block from the possible blocks
        function getRandomBlock() {
            var types = Object.keys(blocks);
            return blocks[types[Math.floor(types.length * Math.random())]];
        }
        
        function getNextBlock() {
            ctrl.nextBlock = getRandomBlock();
        }
            
        function placeBlock() {
            // TODO: Check if block can enter the board
            for (var i = 0; i < ctrl.nextBlock.length; i++) {
                var line = ctrl.nextBlock[i];
                for (var j = 0; j < line.length; j++) {
                    if (line[j]) {
                        ctrl.board[i][j + 3] = line[j];
                    }
                }
            }
            
            // get next block
            getNextBlock();
        }
        
        // anchors shapes on board
        function anchorBoard() {
            for (var i = 0; i < 22; i++) {
                for (var j = 0 ; j < 10; j++) {
                    if (ctrl.board[i][j] && ctrl.anchors[i][j] == 0) {
                        ctrl.anchors[i][j] = 1;
                    }
                }
            }
        }
        
        function deleteCompletedLines() {
            // TODO
        }
        
        ctrl.moveLeft = function() {
            // TODO
        };
        
        ctrl.moveRight = function() {
            // TODO  
        };
        
        ctrl.rotateLeft = function() {
            // TODO  
        };
        
        ctrl.rotateRight = function() {
            // TODO  
        };
        
        // move shape down
        ctrl.moveDown = function() {
            var anchorFlag = false;
            for (var i = 21; i > 0; i--) {
                var canMove = true;
                for (var j = 0; j < 10; j++) {
                    // check if block is not anchored and block bellow is anchored
                    if (ctrl.board[i - 1][j] && ctrl.anchors[i - 1][j] == 0&& ctrl.anchors[i][j]) {
                        canMove = false;
                        break;
                    }
                }
                
                if (canMove) {
                    for (var j = 0; j < 10; j++) {
                        // if block exists and can be moved
                        if (ctrl.board[i - 1][j] && ctrl.anchors[i - 1][j] == 0) {
                            // move block
                            ctrl.board[i][j] = ctrl.board[i - 1][j];
                            ctrl.board[i - 1][j] = 0;
                            
                            // anchor block if it reaches last line
                            // or block bellow is anchored
                            if (i == 21 || ctrl.anchors[i + 1][j]) {
                                anchorFlag = true;
                            }
                        }
                    }
                } else {
                    anchorFlag = true;
                    break;
                }
            }
            return anchorFlag;
        };
        
        // function that reapeats every second
        ctrl.tick = function() {
            var anchorFlag = ctrl.moveDown();
            if (anchorFlag) {
                anchorBoard();
                deleteCompletedLines();
                placeBlock();
            }
        };
        
       
    },
    'bindings': {
        'AI': '<'
    }
});