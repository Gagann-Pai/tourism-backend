const { db } = require('../config/db');
const {MongoClient, ObjectId} = require('mongodb');

async function addPlace(request,response) {
    const places = db().collection("Places");

    if (!request.body.name || !request.body.state || !request.body.description) {
        return response.status(400).send("Required fields cannot be empty");
    }

    await places.insertOne({
        name: request.body.name,
        state: request.body.state,
        city: request.body.city,
        image: request.body.image,
        description: request.body.description,
        bestTime: request.body.bestTime,
        entryFee: request.body.entryFee,
        rating: request.body.rating,
        location: request.body.location
    });

    response.send("Tourist place added succesfully");
}   

async function getAllPlaces(request,response) {
    const places = db().collection("Places");

    const data = await places.find().toArray();
    response.json(data);
}
async function getAllStates(request, response) {
    const places = db().collection("Places");

    const states = await places.distinct("state");
    response.json(states);
}

async function searchPlaces(request, response) {
    try {
        const places = db().collection("Places");
        const pname = request.query.name;

        if (!pname || pname.trim() === "") {
            return response.status(400).json({ message: "Search keyword cannot be empty" });
        }

        const results = await places.find({
            name: { $regex: pname.trim(), $options: "i" }
        }).toArray();

        response.json(results);
    } catch (err) {
        response.status(500).json({ message: "Internal server error" });
    }
}

async function getPlaceByState(request,response) {
    const places = db().collection("Places");
    const sname = request.params.state;

    const result = await places.find({state : sname} ).toArray();
    response.json(result);

}
async function getPlaceById(request, response) {
    const places = db().collection("Places");

    const place = await places.findOne({ _id: new ObjectId(request.params.id) });

    if (!place) {
        return response.status(404).send("Tourist Place Not Found");
    }

    response.json(place);
}

async function updatePlace(request,response) {
    const places = db().collection("Places");

    await places.updateOne(
        {_id : new ObjectId(request.params.id)},
        {
            $set : request.body
        }
    );
    response.send("Tourist place updated succesfully")
}

async function deletePlace(request,response) {
    const places = db().collection("Places");

    await places.deleteOne({_id : new ObjectId(request.params.id)});
    response.send("Tourist place deleted succesfully");
}

module.exports = {
    addPlace,
    getAllPlaces,
    getAllStates,
    searchPlaces,
    getPlaceByState,
    getPlaceById,
    updatePlace,
    deletePlace
}