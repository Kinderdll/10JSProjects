const quizData=[
    {
        q:'How old is Florin?',
        a:'10',
        b:'15',
        c:'17',
        d:'26',
        correct: 'd'
    },
    {
        q:'What is the best programming langauge?',
        a:'Java',
        b:'C',
        c:'Python',
        d:'Javascript',
        correct:'d'
    }
];

const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const quiz = document.getElementById('quiz');
const answerEls = document.querySelectorAll('.answer');
let currentQuiz = 0;
let score = 0;

loadQuiz();
function loadQuiz(){
    deselectAnswer();
    const currentQuizData = quizData[currentQuiz];

    questionEl.innerHTML=currentQuizData.q
    a_text.innerHTML = currentQuizData.a;
    b_text.innerHTML = currentQuizData.b;
    c_text.innerHTML = currentQuizData.c;
    d_text.innerHTML = currentQuizData.d;

}

function getSelected(){
    

    let answer = undefined;
    answerEls.forEach((answerEl)=>{
        if(answerEl.checked){
            answer =  answerEl.id;

        }
    })

    return answer;
}

function deselectAnswer(){
    answerEls.forEach((answerEl)=>{
        answerEl.checked =false;
    });
}


submitBtn.addEventListener('click',()=>{
    

    const answer = getSelected();
    if(answer){
        if(answer === quizData[currentQuiz].correct){
            score++;
        }
            currentQuiz++;
        if(currentQuiz< quizData.length){
            loadQuiz();
        }
        else{
           quiz.innerHTML =`<h2>You answered corerrctly at ${score}/${quizData.length} questions .</h2>
           <button onClick="location.reload()">Reload</button>`;
        }
        
    }
})