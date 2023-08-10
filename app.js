const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());

const sequelize = require('./util/database');

const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const GroupUser = require('./models/groupUser');
const Forgotpassword = require('./models/forgot-password');

User.hasMany(Message);
Message.belongsTo(User);

Group.belongsToMany(User, {through: GroupUser});
User.belongsToMany(Group, {through: GroupUser});

Group.hasMany(Message);
Message.belongsTo(Group);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const passwrodRoutes = require('./routes/password');
const { error, group } = require('console');

app.use('/user', userRoutes);
app.use('/message', messageRoutes);
app.use('/chat', chatRoutes);
app.use('/admin', adminRoutes);
app.use('/password', passwrodRoutes);

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, `public/views/${req.url}`));
});

// sequelize.sync()
sequelize.sync()
    .then(() => {
        app.listen(8000);
    })
    .catch(error => console.log(error));
