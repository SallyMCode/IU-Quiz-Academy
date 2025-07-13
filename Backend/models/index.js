// Imports der Modelle
const { sequelize } = require('../config/database');

//alle Modelle zentral importieren und exportieren, damit sie z. B. im Hauptserver oder Services einfach mit require('./models') eingebunden werden können
const User = require('./User');
const Question = require('./Question');
const AnswerOption = require('./AnswerOption');
const AnswerInSession = require('./AnswerInSession');
const QuizRoom = require('./QuizRoom');
const QuizSession = require('./QuizSession');
const Reason = require('./Reason');
const ForumThread = require('./ForumThreads');
const ForumPost = require('./ForumPost');


// User <-> QuizRoom (1:n)
QuizRoom.belongsTo(User, { foreignKey: 'creatorId', as: 'creator', onDelete: 'SET NULL' });
User.hasMany(QuizRoom, { foreignKey: 'creatorId', as: 'quizRooms' });

// QuizRoom <-> Question (1:n)
Question.belongsTo(QuizRoom, { foreignKey: 'quizRoomId', onDelete: 'CASCADE' });
QuizRoom.hasMany(Question, { foreignKey: 'quizRoomId', as: 'questions' });

// QuizSession <-> User (n:1)
QuizSession.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'SET NULL' });
User.hasMany(QuizSession, { foreignKey: 'userId', as: 'quizSessions' });

// QuizSession <-> QuizRoom (n:1)
QuizSession.belongsTo(QuizRoom, { foreignKey: 'quizRoomId', as: 'quizRoom', onDelete: 'SET NULL' });
QuizRoom.hasMany(QuizSession, { foreignKey: 'quizRoomId', as: 'quizSessions' });

// AnswerInSession <-> QuizSession (n:1)
AnswerInSession.belongsTo(QuizSession, { foreignKey: 'quizSessionId', as: 'quizSession', onDelete: 'CASCADE' });
QuizSession.hasMany(AnswerInSession, { foreignKey: 'quizSessionId', as: 'answersInSession' });

// AnswerInSession <-> Question (n:1)
AnswerInSession.belongsTo(Question, { foreignKey: 'questionId', as: 'question', onDelete: 'CASCADE' });
Question.hasMany(AnswerInSession, { foreignKey: 'questionId', as: 'answersInSession' });

// AnswerOption <-> Question (n:1)
AnswerOption.belongsTo(Question, { foreignKey: 'questionId', as: 'question', onDelete: 'CASCADE' });
Question.hasMany(AnswerOption, { foreignKey: 'questionId', as: 'answerOptions' });

// Reason <-> Question (n:1)
Reason.belongsTo(Question, { foreignKey: 'questionId', as: 'question', onDelete: 'CASCADE' });
Question.hasMany(Reason, { foreignKey: 'questionId', as: 'reasons' });

// ForumThread <-> User (n:1)
ForumThread.belongsTo(User, { foreignKey: 'user_id', as: 'author', onDelete: 'SET NULL' });
User.hasMany(ForumThread, { foreignKey: 'user_id', as: 'forumThreads' });

// ForumThread <-> QuizRoom (n:1)
ForumThread.belongsTo(QuizRoom, { foreignKey: 'quiz_room_id', as: 'quizRoom', onDelete: 'CASCADE' });
QuizRoom.hasMany(ForumThread, { foreignKey: 'quiz_room_id', as: 'forumThreads' });

// ForumPost <-> ForumThread (n:1)
ForumPost.belongsTo(ForumThread, { foreignKey: 'thread_id', as: 'thread', onDelete: 'CASCADE' });
ForumThread.hasMany(ForumPost, { foreignKey: 'thread_id', as: 'posts' });

// ForumPost <-> User (n:1)
ForumPost.belongsTo(User, { foreignKey: 'user_id', as: 'author', onDelete: 'SET NULL' });
User.hasMany(ForumPost, { foreignKey: 'user_id', as: 'forumPosts' });


// Hier keine `sequelize.sync()` — nur Imports/Beziehungen
module.exports = {
sequelize, // ❗️DAS HAT GEFEHLT IN DER VORHERIGEN VERSION
User,
Question,
AnswerOption,
AnswerInSession,
QuizRoom,
QuizSession,
Reason,
ForumThread,
ForumPost
};