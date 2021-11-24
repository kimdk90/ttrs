
var ALL_TD = [];
function makeBlock(col, row) {
    for(var i =1; i <=row; i++) {    //세로
        document.write("<tr>");
        var x_array = [];
        for(var j = 1; j <=col; j++) {   //가로
            let block_html = `
                <td class="space" id = "${j}_${i}" x="${j}" y="${i}">
                
                </td>
            `;
            document.write(block_html);
            x_array.push(j + "_" + i);
        }
        document.write("</tr>");
        ALL_TD.push(x_array);
    }
}

let ALL_BLOCK = new Array();
var BLOCK_POSITION_SHAPE = 0; //동일한 블록 내에서의 각도 형태
ALL_BLOCK[0] = [];
ALL_BLOCK[1] = [["0:0", "1:0", "2:0", "3:0"],["0:0", "0:1", "0:2", "0:3"]];
ALL_BLOCK[2] = [["0:0", "0:1", "1:1"],["0:1", "0:0", "1:0"],["0:0", "1:0", "1:1"],["1:0", "0:1", "1:1"]];
ALL_BLOCK[3] = [["0:1", "1:1", "1:0"],["0:-1", "0:0", "1:0"],["0:1", "0:0", "1:0"],["0:-1", "1:-1", "1:0"]];
ALL_BLOCK[4] = [["0:1", "1:1", "2:1", "0:0"],["0:1", "0:0", "0:-1", "1:-1"],["0:-2", "1:-2", "2:-2", "2:-1"],["0:0", "0:1", "-1:2", "0:2"]];
ALL_BLOCK[5] = [["0:1", "1:1", "2:1", "2:0"],["1:-1", "1:0", "1:1", "2:1"],["-1:1", "-1:0", "0:0", "1:0"],["0:-1", "1:-1", "1:0", "1:1"]];
ALL_BLOCK[6] = [["1:1", "2:1", "1:0", "2:0"]];    

let NOW_BLOCK = new Object();

NOW_BLOCK.shape = null;             //현재 블록의 형태
NOW_BLOCK.current_blocks = null;    //현재 블록의 위치


$(document).ready(function(){
    //메모리 적재 시기에 작동
    newBlock(); 

    //1초에 한번씩 내리기
    intervalDown();

    $(document).keydown(function(e){
        if(e.which == 38) { //위 방향
            moveBlock("up");
        } else if(e.which == 39) { //오른쪽 방향
            moveBlock("right");
        } else if(e.which == 37) { //왼쪽 방향.
            moveBlock("left");
        } else if(e.which == 40) { //아래 방향
            moveBlock("down");
        } else if(e.which == 32) { //스페이스
            moveBlock("space");
        }
    });
});

var NEXT_BLOCK_SHAPE = null;
function newBlock() {
    BLOCK_POSITION_SHAPE = 0;
   // NOW_BLOCK.shape = 1;
   if(!NEXT_BLOCK_SHAPE) {
    NOW_BLOCK.shape = rend(1, ALL_BLOCK.length - 1);
    NEXT_BLOCK_SHAPE = rend(1, ALL_BLOCK.length - 1);
   } else {
    NOW_BLOCK.shape = NEXT_BLOCK_SHAPE;
    NEXT_BLOCK_SHAPE = rend(1, ALL_BLOCK.length - 1);
   }
   NOW_BLOCK.current_blocks = displayBlock(NOW_BLOCK);
   showNextBlock();
}

//블럭 이미지
function showNextBlock() {
    $("#divNextImg").html(`<img src="/img/${NEXT_BLOCK_SHAPE - 1}.gif" style="width:100%; height:200px">`);
};

//랜덤 숫자 생성
function rend(min, max) {
    //Math.random 0~1 사이의 숫자를 랜덤
    //Math.floor 소숫점 버리고 정수로
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let INIT_X_POSITION = 5; //초기 블럭의 x위치값
let INIT_Y_POSITION = 1; //초기 블럭의 Y위치값

function displayBlock(nowBlock) {   //원하는 블록을 원하는 위치에 출력
    var current_blocks = [];
    for(let i = 0; i < ALL_BLOCK[nowBlock.shape][BLOCK_POSITION_SHAPE].length; i++) {
        let block_xy = ALL_BLOCK[nowBlock.shape][BLOCK_POSITION_SHAPE][i].split(":");
        let block_x = Number(block_xy[0]) + INIT_X_POSITION;
        let block_y = Number(block_xy[1]) + INIT_Y_POSITION;

        $("#" + block_x + "_" + block_y).attr("class", "block");

        current_blocks.push($("#" + block_x + "_" + block_y).attr("class", "block"));
    }

    return current_blocks;
}

var interval_s = 1000;
var interval_e = 100;
var interval = null;
function intervalDown() {
    if(interval_s < interval_e) {
        interval_s = interval_e;
    }
    interval = setInterval(() => {
        //블록을 하나씩 내린다
        moveDown();
    }, interval_s);
}

function moveBlock(gbn) {
    if(NOW_BLOCK) {
        switch(gbn) {
            case "up" :
                if(ALL_BLOCK[NOW_BLOCK.shape].length == 1) {
                    return false;
                }

                var is_stop = false;
                var new_current_blocks = [];
                BLOCK_POSITION_SHAPE++;
                if(!ALL_BLOCK[NOW_BLOCK.shape][BLOCK_POSITION_SHAPE]) {
                    BLOCK_POSITION_SHAPE =0;
                }
                for(let i = 0; i < ALL_BLOCK[NOW_BLOCK.shape][BLOCK_POSITION_SHAPE].length; i++) {
                    let current_standard_x = NOW_BLOCK.current_blocks[0].attr("x");
                    let current_standard_y = NOW_BLOCK.current_blocks[0].attr("y");

                    let new_xy = ALL_BLOCK[NOW_BLOCK.shape][BLOCK_POSITION_SHAPE][i].split(":");
                    let new_x = Number(new_xy[0]) + Number(current_standard_x);
                    let new_y = Number(new_xy[1]) + Number(current_standard_y);
                    let new_id2 = new_x + "_" + new_y;

                    if($("#" + new_id2).length == 0) {
                        is_stop = true;
                    } else {
                        if($("#" + new_id2).attr("class") == "block" && !isExistNowBlock(new_id2)) {
                            is_stop = true;
                        }
                    }


                    new_current_blocks.push($("#" + new_id2));
                }   

                if(is_stop) {
                    return false;
                }

                NOW_BLOCK.current_blocks.forEach(function(item, index){
                    item.attr("class", "space");
                });

                new_current_blocks.forEach(function(item, index){
                    item.attr("class", "block");
                });

                NOW_BLOCK.current_blocks = new_current_blocks;
                break;
            case "right" :
                    var new_current_blocks = [];
                    var is_stop = false;
                    NOW_BLOCK.current_blocks.forEach(function(item, index){
                        var new_id = (Number(item.attr("x")) + 1) + "_" + item.attr("y");
                        if($("#" + new_id).length == 0) {
                            is_stop = true;
                        } else {
                            if($("#" + new_id).attr("class") == "block" && !isExistNowBlock(new_id)) {
                                is_stop = true;
                            }
                        }
                        new_current_blocks.push($("#" + new_id));
                    });

                    if(is_stop == true) {
                        return false;
                    } 

                    NOW_BLOCK.current_blocks.forEach(function(item, index){
                        item.attr("class", "space");
                    });

                    new_current_blocks.forEach(function(item, index){
                        item.attr("class", "block");
                    });

                    NOW_BLOCK.current_blocks = new_current_blocks;
                break;
            case "left" :
                    var new_current_blocks = [];
                    var is_stop = false;
                    NOW_BLOCK.current_blocks.forEach(function(item, index){
                        var new_id = (Number(item.attr("x")) - 1) + "_" + item.attr("y");
                        if($("#" + new_id).length == 0) {
                            is_stop = true;
                        } else {
                            if($("#" + new_id).attr("class") == "block" && !isExistNowBlock(new_id)) {
                                is_stop = true;
                            }
                        }
                        new_current_blocks.push($("#" + new_id));
                    });

                    if(is_stop == true) {
                        return false;
                    }

                    NOW_BLOCK.current_blocks.forEach(function(item, index){
                        item.attr("class", "space");
                    });

                    new_current_blocks.forEach(function(item, index){
                        item.attr("class", "block");
                    });
                    
                    NOW_BLOCK.current_blocks = new_current_blocks;
                break;
            case "down" :
                moveDown();
                break;
            case "space" :
                while(moveDown() == true) {

                };
                break;
        }
    }
};

//한칸씩 아래로
function moveDown() {
    var new_current_blocks = [];
    var is_stop = false;
    NOW_BLOCK.current_blocks.forEach(function(item, index){
        var new_id = item.attr("x") + "_" + (Number(item.attr("y")) + 1);
        if($("#" + new_id).length == 0) { //막다른 길
            is_stop = true;
        } else {
            if($("#" + new_id).attr("class") == "block" && !isExistNowBlock(new_id)) {
                is_stop = true;
            }
        }
        new_current_blocks.push($("#" + new_id));
    });

    //막힌길이면 중단
    var retrun_value = true;
    if(is_stop == true) {
        retrun_value = false;

        endGame();
    } else {
        NOW_BLOCK.current_blocks.forEach(function(item, index){
            item.attr("class", "space");
        });
    
        new_current_blocks.forEach(function(item, index){
            item.attr("class", "block");
        });
        
        NOW_BLOCK.current_blocks = new_current_blocks;
    }
    if(!retrun_value) {
        removeLine();   //줄 제거
        newBlock();     //새로운 블록 생성
    }
    return retrun_value;    
};

//블럭충돌 체크
function isExistNowBlock(id) {
    var is_exist = false;
    NOW_BLOCK.current_blocks.forEach(function(item, index) {
        if(item.attr("id") == id) {
            is_exist = true;
        }
    });

    return is_exist;
};

//게임 END 상황인지 확인 -> 현재 블록 위치를 확인해서 그 중에 Y값이 1이거나 그보다 작은것이 있으면 종료
function endGame() {
    NOW_BLOCK.current_blocks.forEach(function(item, index) {
        var y = item.attr("y");
        if(y <= 1) { //게임종료

            clearInterval(interval); //interval 종료
            alert("게임 종료");
            return false;
        }
    });
};

//줄 제거
function removeLine() {
    for(var row = ALL_TD.length -1; row >= 0; row--) {
        var is_all_correct = true;
        for(var col = 0; col < ALL_TD[row].length; col++) {
            var this_id = ALL_TD[row][col];
            var this_obj = $("#" + this_id);
            if(this_obj.attr("class") == "space") {
                is_all_correct = false;
            }
        }

        if(is_all_correct) {
            for(var k = row; k > 0; k--) {
                 for(var j = 0; j < ALL_TD[k].length; j++) {
                     var this_id = ALL_TD[k][j];
                     var this_obj = $("#" + this_id);

                     var upon_id = ALL_TD[k-1][j];
                     var upon_obj = $("#" + upon_id);
                     var upon_boj_class = upon_obj.attr("class");

                     this_obj.attr("class", upon_boj_class);

                     if(upon_obj.length > 0) {
                         upon_obj.attr("class", "space");
                     }
                 }
            }

            //이곳까지 실행하면 현재 줄 전체를 윗줄로 바꾸고, 윗줄은 흰색으로 변경
            row++;

            for(var j = 0; j < ALL_TD[0].length; j++) {
                var this_id = ALL_TD[0][j];
                var this_obj = $("#" + this_id);

                this_obj.attr("class", "space");
            }

            //한줄 내릴떄마다 Score 100점 추가
            var current_score = $("#scoreValue").html();
            current_score = Number(current_score) + 100;
            $("#scoreValue").html(current_score);

            //레벨 올리기
            if(current_score % 1000 == 0) {
                var current_level = $("#levelValue").html();
                current_level = Number(current_level) + 1;
                $("#levelValue").html(current_level);

                interval_s = interval_s - 100;
                clearInterval(interval);
                intervalDown();
            }
        }
    }  
};