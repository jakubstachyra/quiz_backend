
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Create a Quiz App I Nest.js
The project is Nest.js API, which has capabilities to :

- **Create new quiz** - Teachers are able to create a new quiz by providing the quiz name along with a list of questions and their corresponding answers.
- **Get questions for a quiz** - Students are able to fetch the questions for a specific quiz.
- **Check answers** - Students should be able to submit their answers for a quiz and receive the results. The results should include two numbers: the maximum possible points and the points obtained.

The quiz questions can be of different types:
- **Single Correct Answer**
- **Multiple Correct Answers**
- **Sorting**
- **Plain Text Answer**

 The answer validation is user-friendly, considering minor differences in capitalization, and punctuation.

## Installation

```bash
$ npm install

# nestjs installation
$ npm install -g @nestjs/cli

# nestjs typeorm installation
$ npm install typeorm --save

# install a database driver for postgres
$ npm install pg --save
```
## Create .env file for database configuration
Example .env
```.env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=admin
DB_DATABASE=database
```
## Running the postgreSQL in docker
Make sure that you turned on docker on your computer before try to run those commands.
```bash
# turn docker with configuration from docker-compose
$ docker-compose up

# turn on in dettached mode
$ docker-dompose up -d

# turn off
$ docker-compose down  
```
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npx jest
```
## Sample GraphQL Queries and Mutations
Create User
```GraphQL
# create user 
mutation {
  createUser(
    createUserData: {
      name: "John"
      email: "john@example.com",
      role: "teacher"
    }
  ) {
    id
    name
    email
    role
  }
}
```
Get User By ID
```GraphQL
query{
  getUserById(id: 1){
    id 
    name
    role
    email
  }
```
Create Quiz
```GraphQL
mutation CreateFullQuiz {
  createQuiz(createQuizData: {
    title: "Various questions",
    authorId: 1,
    questions: [
      {
        text: "What is the capital of France?",
        type: CHOICE,
        options: [
          { text: "London", isCorrect: false },
          { text: "Paris", isCorrect: true },
          { text: "Rome", isCorrect: false },
          { text: "Madrid", isCorrect: false }
        ]
      },
      {
        text: "What is the famous phrase from Star Wars?",
        type: OPEN,
        expectedAnswer: "May the force be with you"
      },
      {
        text: "Which of the following programming languages are object-oriented?",
        type: MULTIPLE_CHOICE,
        options: [
          { text: "Java", isCorrect: true },
          { text: "C", isCorrect: false },
          { text: "Python", isCorrect: true },
          { text: "Ruby", isCorrect: true }
        ]
        
      },
      {
			text:"Arrange the following events in chronological order"
      type: SORTING
      options:[
        {text: "WW2",isCorrect:null, expectedOrder: 1},
        {text: "First Moon Landing.",isCorrect:null, expectedOrder:2}
      ]}
      
    ]
  }) {
    id
    title
    questions {
      id
      text
      type
      options {
        id
        text
        isCorrect
        expectedOrder
      }
    }
  }
}

```
Start Quiz
```GraphQL
mutation StartQuiz {
  startQuizById(quizId: 1, userId: 1)
}
```
Get Quiz By ID
```GraphQL
query{
	getQuizById(id: 1)
  {
    id,
    title
    questions{
      id
    	text
      type
      options{
        text
        id
			}
		}
	}
}
```
Submit Answers For Quiz And Get Result
```GraphQL
mutation SubmitAnswers {
  submitAnswers(attemptId: 1, answers: [
    { questionId: 1, chosenOptionId: 2 },
    { questionId: 2, textAnswer: "may the force be with you"},
    { questionId: 3, chosenOptionIds:[5,7,8]},
    { questionId: 4, chosenOrder:[9,10]},
    
  ]) {
    id
    score
    maxScore
  }
}
```

## License

Nest is [MIT licensed](LICENSE).
