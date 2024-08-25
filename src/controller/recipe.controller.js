import { MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
import 'dotenv/config';

const client = new MongoClient(process.env.DB_URL);
const dbName = process.env.DB_NAME;

const recipeUserQuery = [
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "id",
            as: "recipeUser"
        }
    },
    {
        $unwind: "$recipeUser"
    },
    {
        $project: {name:1, origin:1, image:1, description:1, proceedure:1, userId:1, id:1, author: "$recipeUser.name", email: "$recipeUser.email"}
    }
]

const createRecipe = async (req, res)=>{
    try {
        await client.connect();
        const userCollection = client.db(dbName).collection('users');
        const recipeCollection = client.db(dbName).collection('recipe');
        let user = await userCollection.findOne({id: req.body.userId});
        if(user){
            req.body.id = uuid();
            await recipeCollection.insertOne(req.body);
            res.status(201).send({message: "Recipe Added Successfully"})
        }else{
            res.status(400).send({message: "Invalid User ID"})
        }
        
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: "Internal Server Error"})
    }
    finally{
        client.close();
    }
}

const getAllRecipes = async (req, res)=>{
    try {
        client.connect();
        const recipeCollection = client.db(dbName).collection('recipe');
        let recipe = await recipeCollection.aggregate(recipeUserQuery).toArray();
        
        res.status(200).send({message: "All Recipe Data Fetch Successfull", data: recipe})
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || "Internal Server Error"})
    }
    finally{
        client.close();
    }
}

const getAllRecipesByUserId = async (req, res)=>{
    try {
        await client.connect();
        const recipeCollection = client.db(dbName).collection('recipe');
        const {id} = req.params;
        let recipes = await recipeCollection.aggregate([...recipeUserQuery, {$match: {userId: id}}]).toArray();
        
        res.status(200).send({message: "Data Fetched Successfully", recipes: recipes})
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error)
        res.status(500).send({message: error.message || "Internal Server Error"})
    }
    finally{
        client.close();
    }
}

export default {createRecipe, getAllRecipes, getAllRecipesByUserId}