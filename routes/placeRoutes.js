const express = require('express');
const router = express.Router();
const { addPlace,
    getAllPlaces,
    getAllStates,
    searchPlaces,
    getPlaceByState,
    getPlaceById,
    updatePlace,
    deletePlace }= require('../controllers/placeController');

router.post('/',addPlace);
router.get('/',getAllPlaces);
router.get('/states',getAllStates);
router.get('/search',searchPlaces);
router.get('/state/:state',getPlaceByState);
router.get('/:id',getPlaceById);
router.put('/:id',updatePlace);
router.delete('/:id',deletePlace);

module.exports = router;