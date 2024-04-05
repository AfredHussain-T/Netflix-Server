const router = require("express").Router();
const List = require("../models/List");
const { verify } = require("../config/jwtProvider");

// Create new movie

router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = await new List(req.body);
    try {
      const savedList = await newList.save();
      return res.status(200).send(savedList);
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    return res.status(401).send("Unauthorized User To Add Movie");
  }
});

// Delete List
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
      try {
        await List.findByIdAndDelete(req.params.id);
        return res.status(200).send("delete list");
      } catch (error) {
        return res.status(500).send(error);
      }
    } else {
      return res.status(401).send("Unauthorized User To Delete List");
    }
  });

// Get all list

router.get("/", verify, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    try {
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    {$sample:{size:10}},
                    {$match:{type:typeQuery, genre:genreQuery}}
                ])
            }else{
                list = await List.aggregate([
                    {$sample:{size:10}},
                    {$match:{type:typeQuery}}
                ])
            }
        }else{
            list = await List.aggregate([
                {$sample:{size:10}}
            ])
        }
        return res.status(201).send({list});
      } catch (error) {
        return res.status(500).send(error);
      }
});

// Get a random movie

router.get("/random", verify, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if(type === "series"){
            movie = await Movie.aggregate([
                {$match:{isSeries:true}},
                {$sample:{size:1}}
            ])
        }else{
            movie = await Movie.aggregate([
                {$match:{isSeries:false}},
                {$sample:{size:1}}
            ])
        }

        return res.status(200).send(movie);
      } catch (error) {
        return res.status(500).send(error);
      }
});


// Get All

router.get("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
      try {
        const movies = await Movie.find();
  
        return res.status(201).json(movies.reverse());
      } catch (error) {
        return res.status(500).send(error);
      }
    } else {
      return res.status(401).send("Unauthorized User To Delete Movie");
    }
});


module.exports = router;