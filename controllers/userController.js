const { db } = require('../config/db');

async function signup(request, response) {
    const users = db().collection("Users");

    const existing = await users.findOne({ email: request.body.email });
    if (existing) {
        return response.status(400).send("User already exists");
    }

    await users.insertOne({
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        role: "user"   // everyone who signs up normally is a regular user
    });

    response.send("Signup successful");
}

async function login(request, response) {
    const users = db().collection("Users");

    const user = await users.findOne({
        email: request.body.email,
        password: request.body.password
    });

    if (!user) {
        return response.status(400).send("Invalid credentials");
    }

    request.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    response.json(request.session.user);
}

function logout(request, response) {
    request.session.destroy(() => {
        response.send("Logged out");
    });
}

function getCurrentUser(request, response) {
    if (!request.session.user) {
        return response.status(401).send("Not logged in");
    }
    response.json(request.session.user);
}

module.exports = {
    signup,
    login,
    logout,
    getCurrentUser
}