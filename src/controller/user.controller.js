import { MongoClient } from "mongodb";
import { v4 as uuid } from "uuid";
import 'dotenv/config';

const client = new MongoClient(process.env.DB_URL);
const dbName = process.env.DB_NAME

const getAllUsers = async (req, res)=>{
    try {
        await client.connect();
        const userCollection = client.db(dbName).collection('users');
        let users = await userCollection.find().project({_id:0}).toArray();
        res.status(200).send({
            message: 'User Data Fetched',
            data: users
        })
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
    finally {
        client.close();
    }
}

const getUserById = async(req, res)=>{
    try {
        await client.connect();
        const userCollection = client.db(dbName).collection('users');
        let {id} = req.params;
        let user = await userCollection.findOne({id:id}, {_id:0});
        if(user){
            res.status(200).send({
                message: 'User Data Fetched', 
                data: user
            })
        }else{
            res.status(400).send({
                message: `Invalid ID ${id}`
            })
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
    finally{
        client.close();
    }
}

const createUser = async (req, res)=>{
    try {
        await client.connect();
        const userCollection = client.db(dbName).collection('users');
        req.body.id = uuid();
        req.body.status = true;
        let user = await userCollection.findOne({email: req.body.email});

        if( !user ){
            await userCollection.insertOne(req.body)
            res.status(201).send({message: 'User Created Successfully'})
        }
        else{
            res.status(400).send({message: `User ${req.body.email} already exist!`})
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
    finally{
        client.close();
    }
}

const ediUserById = async (req, res)=>{
    try {
        await client.connect();
        let {id} = req.params;
        const userCollection = client.db(dbName).collection('users');
        let user = await userCollection.findOne({id: id});
        if(user){
            await userCollection.updateOne({id: id}, {$set: {...user, ...req.body}})
            res.status(200).send({message: 'Data Modified Successfully'})
        }
        else{
            res.status(400).send({message: 'Invalid ID'})
        }
    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error)
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
}

const deleteUserById = async (req, res)=>{
    try {
        await client.connect()
        const userCollection = client.db(dbName).collection('users');
        const {id} = req.params;
        let data = await userCollection.deleteOne({id: id})
        if(data.deletedCount){
            res.status(200).send({message: 'User Deleted Successfully'})
        }
        else{
            res.status(400).send({message: 'Invalid ID'})
        }

    } catch (error) {
        console.log(`Error in ${req.originalURL}`, error);
        res.status(500).send({message: error.message || 'Internal Server Error'})
    }
    finally{
        client.close();
    }
}

export default {getAllUsers, getUserById ,createUser, ediUserById, deleteUserById}