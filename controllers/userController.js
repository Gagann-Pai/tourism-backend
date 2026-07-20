const { db } = require('../config/db');
const { ObjectId } = require("mongodb");

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
    role: "user",
    favourites: []
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

async function addFavourite(request, response){

    if(!request.session.user){
        return response.status(401).send("Login required");
    }

    const users = db().collection("Users");

    await users.updateOne(
        { _id: new ObjectId(request.session.user.id) },
        {
            $addToSet:{
                favourites: request.body.placeId
            }
        }
    );

    response.send("Added");
}

async function removeFavourite(request,response){

    if(!request.session.user){
        return response.status(401).send("Login required");
    }

    const users = db().collection("Users");

    await users.updateOne(
        { _id:new ObjectId(request.session.user.id) },
        {
            $pull:{
                favourites: request.body.placeId
            }
        }
    );

    response.send("Removed");
}

async function getFavourites(request, response){

    if(!request.session.user){
        return response.status(401).send("Login required");
    }

    const users = db().collection("Users");
    const places = db().collection("Places");

    const user = await users.findOne({
        _id: new ObjectId(request.session.user.id)
    });

    const favouritePlaces = [];

    if(user.favourites){

        for(let id of user.favourites){

            const place = await places.findOne({
                _id: new ObjectId(id)
            });

            if(place){
                favouritePlaces.push(place);
            }
        }
    }

    response.json(favouritePlaces);
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
    getCurrentUser,
    addFavourite,
    removeFavourite,
    getFavourites
}