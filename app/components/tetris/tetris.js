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
                    if (ctrl.board[i][j]) {
                        ctrl.anchors[i][j] = 1;
                    }
                }
            }
        }
        
        function deleteCompletedLines() {
            for (var i = 21; i > 0; i--) {
                // for every line check if it complete
                var completed = true;
                for (var j = 0; j < 10; j++) {
                    if (ctrl.board[i][j] == 0) {
                        completed = false;
                        break;
                    }
                }
                
                // if completed remove line and add new empty line
                if (completed) {
                    ctrl.board.splice(i, 1);
                    ctrl.board.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                    ctrl.anchors.splice(i, 1);
                    ctrl.anchors.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                    ctrl.score++;
                }
            }
        }
        
        function checkGameOver() {
            // check if a block is anchored in the extra place
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < 10; j++) {
                    if (ctrl.anchors[i][j]) {
                        return true;
                    }
                }
            }
            return true;
        }
        
        ctrl.moveLeft = function() {
            // check to see if block will go out of bounds
            for (var i = 0; i < 22; i++) {
                if (ctrl.board[i][0] && ctrl.anchors[i][0] == 0) {
                    return false;
                }
            }
            
            for (var j = 0; j < 10 - 1; j++) {
                // check if block can be moved left
                var canMove = true;
                for (var i = 0; i < 22; i++) {
                    if (ctrl.board[i][j] && ctrl.anchors[i][j] == 0) {
                        canMove = false;
                        break;
                    }
                }
                
                // perform move left
                if (canMove) {
                    for (var i = 0; i < 22; i++) {
                        if (ctrl.board[i][j + 1] && ctrl.anchors[i][j + 1] == 0) {
                            ctrl.board[i][j] = ctrl.board[i][j + 1];
                            ctrl.board[i][j + 1] = 0;
                        }
                    }
                }
            }
        };
        
        ctrl.moveRight = function() {
            // check to see if block will go out of bounds
            for (var i = 0; i < 22; i++) {
                if (ctrl.board[i][9] && ctrl.anchors[i][9] == 0) {
                    return false;
                }
            }
            
            for (var j = 9; j > 0; j--) {
                // check if block can be moved right
                var canMove = true;
                for (var i = 0; i < 22; i++) {
                    if (ctrl.board[i][j] && ctrl.anchors[i][j] == 0) {
                        canMove = false;
                        break;
                    }
                }
                
                // perform move right
                if (canMove) {
                    for (var i = 0; i < 22; i++) {
                        if (ctrl.board[i][j - 1] && ctrl.anchors[i][j - 1] == 0) {
                            ctrl.board[i][j] = ctrl.board[i][j - 1];
                            ctrl.board[i][j - 1] = 0;
                        }
                    }
                }
            }
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
            var returnFlag = true;
            if (anchorFlag) {
                anchorBoard();
                deleteCompletedLines();
                if (checkGameOver()) {
                    returnFlag = false;
                }
                placeBlock();
            }
            return returnFlag;
        };
        
       
    },
    'bindings': {
        'AI': '<'
    }
});