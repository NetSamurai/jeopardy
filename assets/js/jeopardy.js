var jeopardy = {};
jeopardy.category = {};
jeopardy.question = {};
jeopardy.locked = false;
jeopardy.audio = null;

jeopardy.loadData = function() {
    jeopardy.audio = new Audio();
    jeopardy.audio.src = 'assets/mp3/jeopardy.mp3';
    jeopardy.setCategoryData();
};

jeopardy.loadBoard = function() {
    var $game_board = $('#gameBoardDiv');

    var spool = '<div class="row" >';
    jeopardy.category.forEach( category => {
        spool += '<div class="col-sm card header-card unselectable" data-category-id="' + category.category_id + '">' + category.category_name + '</div>';
    });
    spool += '</div>';
    $game_board.append( spool );

    spool = "";
    var iterate = 0;

    jeopardy.question.forEach( question => {
        if( question.question_id.toString().charAt(1) === "0" ) {
            if( iterate > 0 ) {
                spool += '</div>';
            }
            spool += '<div class="row">';
            iterate += 1;
        }
        spool += '<div class="col-sm card game-card unselectable" data-question-id="' + question.question_id + '" data-question-text="' + question.question_text + '" data-question-answer="' + question.question_answer + '">' + '<i class="fas fa-dollar-sign"></i> ' + question.points + '</div>';
    });
    if( iterate > 0 ) {
        spool += '</div>';
    }

    $game_board.append( spool );

    $('.card').click(function( event ) {
        if( jeopardy.locked ) return;
        jeopardy.locked = true;
        var $card = $(this);
        if( $card.data( "category-id" ) === undefined ) {
                $card.toggleClass("zoom");
            setTimeout( function() {
                $card.toggleClass("zoom");
                jeopardy.showQuestion( $card.data("question-id") );
                jeopardy.showGameBoardDiv( false );
            }, 1000 );
        }
    });

    $('#questionDiv').click(function(event) {
        if( $('#questionDiv').data( "question_done" ) == false ) {
            jeopardy.showQuestionAnswer( $('#questionDiv').data( "question" ) );
        } else {
            jeopardy.hideQuestion( $('#questionDiv').data( "question" ) );
        }
    });

    jeopardy.showLoadDiv( false );

    $game_board.show();
};

jeopardy.setCategoryData = function() {
    $.getJSON( "assets/js/category.json", function( data ) {
        jeopardy.category = data;
        jeopardy.setQuestionData();
    });
};

jeopardy.setQuestionData = function() {
    $.getJSON( "assets/js/question.json", function( data ) {
        jeopardy.question = data;
        jeopardy.loadBoard();
    });
};

jeopardy.showLoadDiv = function( bool ) {
    if( bool === true ) {
        $('#theLoadDiv').show();
    } else {
        $('#theLoadDiv').hide();
    }
};

jeopardy.showGameBoardDiv = function( bool ) {
    if( bool === true ) {
        $('#gameBoardDiv').show();
    } else {
        $('#gameBoardDiv').hide();
    }
};

jeopardy.showQuestionDiv = function( bool ) {
    if( bool === true ) {
        $('#questionDiv').show();
    } else {
        $('#questionDiv').hide();
    }
}

jeopardy.showQuestion = function( question_id ) {
    jeopardy.question.forEach( question => {
        if( question.question_id === question_id ) {
            $('#questionDiv').data( "question_done", false );
            $('#questionDiv').data( "question", question_id );
            $('#questionDiv').append( '<h1><span style="opacity: .2; color: white;"><i class="fad fa-question"></i></span><span style="opacity: .2; color: #ffcc00;"><i class="fad fa-question"></i></span><span style="opacity: .2; color: blue;"><i class="fad fa-question"></i></span> ' + question.question_text + '</h1>' );
            jeopardy.showQuestionDiv( true );
            jeopardy.audio.play();
        }
    });
};

jeopardy.showQuestionAnswer = function( question_id ) {
    jeopardy.audio.pause();
    jeopardy.question.forEach( question => {
        if( question.question_id === question_id ) {
            $('#questionDiv').data( "question_done", true );
            $('#questionDiv').html( "" );
            $('#questionDiv').append( '<h1><span style="opacity: .2; color: white;"><i class="fad fa-check"></i></span><span style="opacity: .2; color: #ffcc00;"><i class="fad fa-check"></i></span><span style="opacity: .2; color: blue;"><i class="fad fa-check"></i></span> ' + question.question_answer + '</h1>' );
        }
    });
};

jeopardy.hideQuestion = function( question_id ) {
    $('#questionDiv').html( "" );
    $('#questionDiv').removeData( "question" );
    $('#questionDiv').removeData( "question_done" );

    jeopardy.showQuestionDiv( false );
    jeopardy.showGameBoardDiv( true );

    var $question_element = $('.game-card[data-question-id="' + question_id + '"]');
    $question_element.css( "background", "none", "!important" );
    $question_element.css( "color", "#000000", "!important" );

    jeopardy.locked = false;
};

$( document ).ready(function() {
    jeopardy.loadData();
});