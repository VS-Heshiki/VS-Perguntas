const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const questionModel = require('./database/Question');
const answersModel = require('./database/Answer');


connection
    .authenticate()
    .then(() => {
        console.log('authenticate successful')
    }) .catch(err => {
        console.log(err)
    });

app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    questionModel.findAll({raw: true, order:[
        ['updatedAt','DESC']
    ]}).then(question =>{
        res.render("home",{question: question});
    });
})

app.get("/toAsk", (req, res) => {
    res.render("toAsk");
})

app.post("/sended", (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    questionModel.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/question/:id", (req, res) => {
    var id = req.params.id;
    questionModel.findOne({
        where: {id : id}
    }).then(question => {
        if (question != undefined){

            answersModel.findAll({
                where: {questionId: question.id},
                order:[
                    ['id', 'DESC']
                ]
            }).then(answers => {
                res.render("question",{
                    question: question,
                    answers: answers
                });
            });       
        } else {
            res.render("404");
        }
    });
});

app.post("/answer", (req, res) => {
    const body = req.body.body;
    const questionId = req.body.question;
    answersModel.create({
        body: body,
        questionId: questionId
    }).then(() => {
        res.redirect("/question/"+ questionId);
    });
});

app.listen(3000, (req, res) => {
    console.log("listening on http://localhost:3000")
});