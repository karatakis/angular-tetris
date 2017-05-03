'use strict';

angular.module('angular-tetris.tetris', [])

.component('tetris', {
    'templateUrl': 'components/tetris/tetris.html',
    'controller': ["$scope", "$element", "$attrs", "$interval" , function($scope, $element, $attrs, $interval) {
        var ctrl = this;
        
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
        
        // this variable lets the user to perform one move until the blocks anchor !
        var previousAnchorFlag;
        
        // used to revert the board if sommething goes wrong
        var tempBoard;
        
        // initialize modal
        var scoreModal = $("#score-modal");
        scoreModal.modal();
        
        // shape position needed to perform rotations
        var position;
        
        // initialize tick interval
        var interval;
        
        // returns a random block from the possible blocks
        function getRandomBlock() {
            var types = Object.keys(blocks);
            return blocks[types[Math.floor(types.length * Math.random())]];
        }
        
        // saves a copy of the board
        function saveBoard() {
            tempBoard = ctrl.board.map(function(arr) { return arr.slice(); });
        }
        
        // restore board to the last saved state
        function restoreBoard() {
            ctrl.board = tempBoard.map(function(arr) { return arr.slice(); });
        }
        
        // generate next block
        function getNextBlock() {
            ctrl.nextBlock = getRandomBlock();
        }
            
        // add shape on board
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
            
            position = { row: 0, col: 4};
            
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
        
        // finds completed lines and removes them for points
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
            return false;
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
                    saveBoard();
                    for (var i = 0; i < 22; i++) {
                        if (ctrl.board[i][j + 1] && ctrl.anchors[i][j + 1] == 0 && ctrl.anchors[i][j] == 0) {
                            ctrl.board[i][j] = ctrl.board[i][j + 1];
                            ctrl.board[i][j + 1] = 0;
                        } else if (ctrl.board[i][j + 1] && ctrl.anchors[i][j + 1] == 0) {
                            restoreBoard();
                            position.col++;
                        }
                    }
                }
            }
            position.col--;
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
                    saveBoard();
                    for (var i = 0; i < 22; i++) {
                        if (ctrl.board[i][j - 1] && ctrl.anchors[i][j - 1] == 0 && ctrl.anchors[i][j] == 0) {
                            ctrl.board[i][j] = ctrl.board[i][j - 1];
                            ctrl.board[i][j - 1] = 0;
                        } else if (ctrl.board[i][j - 1] && ctrl.anchors[i][j - 1] == 0) {
                            restoreBoard();
                            position--;
                        }
                    }
                }
            }
            position.col++;
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
            position.row++;
            return anchorFlag;
        };
        
        // drop shape untill it anchors
        ctrl.drop = function() {
            while (! previousAnchorFlag) {
                previousAnchorFlag = ctrl.moveDown();
            }
        };
        
        // function that reapeats every second
        ctrl.tick = function() {
            var returnFlag = true;
            if (previousAnchorFlag) {
                anchorBoard();
                deleteCompletedLines();
                if (checkGameOver()) {
                    returnFlag = false;
                }
                placeBlock();
            }
            previousAnchorFlag = ctrl.moveDown();
            return returnFlag;
        };
        
        // prepare the variables and start the game
        ctrl.newGame = function() {
            // reset score
            ctrl.score = 0;
        
            // reset board and anchors
            ctrl.board = [];
            ctrl.anchors = [];
            
            // generate the board
            // and the anchors
            for (var i = 0; i < 22; i++) {
                ctrl.board.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                ctrl.anchors.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            }
            
            previousAnchorFlag = false;
            
            // initialize the first block
            getNextBlock();
            placeBlock();
            
            // start game interval
            interval = $interval(function() {
                var flag = ctrl.tick();
                if (!flag) {
                    scoreModal.modal('open');
                    $interval.cancel(interval);
                }
            }, 1000);
        };
        
        ctrl.newGame();
       
    }],
    'bindings': {
        'AI': '<'
    }
});