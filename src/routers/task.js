const Task=require('../models/task')
const express=require('express')
const auth=require('../middleware/auth')
const router=new express.Router()
// creating /tasks rout to let a user create tasks
router.post('/tasks',auth,async (req,res)=>{
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(error){
        res.status(400).send(error)
    }
})
// creating /tasks routes for reading all tasks
router.get('/tasks',auth,async(req,res)=>{
     const match={}
     const sort={}
     const user=req.user
     const completed=req.query.completed
     const limit=parseInt(req.query.limit)
     const skip=parseInt(req.query.skip)
     const sortBy=req.query.sortBy
     if(completed){
         match.completed=completed==='true'
     }
     if(sortBy){
         const parts=sortBy.split(':')
         sort[parts[0]]=parts[1]=='des'? -1 : 1
     }
    try{
        await user.populate({
            path:'tasks',
            match,
            options:{
                limit,
                skip,
                sort
            }
            
        }).execPopulate()
        res.send(user.tasks)
    }
    catch(error){
        res.status(500).send()
    }
})
// creating /tasks/:id route to read a particular task
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(error){
        res.status(500).send()
    }
})
// creating route for updating a particular task
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(404).send({error:'Invalid updates'})
    }
    const _id=req.params.id
    try{
        const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=> task[update]=req.body[update])
        await task.save()
        res.send(task)
    }
    catch(error){
        res.status(400).send(error)
    }
})
// creating route for deleting a particular task
router.delete('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        const task=await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(error){
        res.status(500).send()
    }
})
module.exports=router