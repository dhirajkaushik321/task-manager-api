const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const sharp=require('sharp')
const {sendWelcomeEmail, sendCancelEmail}=require('../emails/account')
// npm library to support file upload
const multer=require('multer')
const router=new express.Router()
// creating /users route to let browser create users  
router.post('/users',async(req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(error){
        res.status(400).send(error)
    }

})
// creating route for login
router.post('/users/login',async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token =await user.generateAuthToken()
        res.send({user,token})

    }
    catch(error){
        res.status(400).send(error)
    }
})
// creating route for logout
router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>token.token!==req.token)
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})
// creating route for logout all
router.post('/users/logoutAll',auth,async (req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})
// creating /users route for reading a users profile
router.get('/users/me',auth,async(req,res)=>{
   res.send(req.user)
})
// creating route for updating a particular user
router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','age','email','password']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(404).send({error:'Invalid updates'})
    }
    const _id=req.user._id
    try{
        const user=req.user
        updates.forEach((update)=> user[update]=req.body[update])
        await user.save()
        res.send(user)

    }
    catch(error){
        res.status(400).send(error)
    }
})
// creating route for deleting a particulat user
router.delete('/users/me',auth,async(req,res)=>{
    const _id=req.user._id
    try{
        await req.user.remove()
        sendCancelEmail(req.user.email,req.user.names)
        res.send(req.user)
    }catch(error){
        res.status(500).send()
    }
})
// creating an instance of multer to let the user upload a photo
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
     req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth,async (req,res)=>{
    try{
        req.user.avatar=undefined
        await req.user.save()
        res.send()
    }catch(error){
        req.status(500).send()
    }
})
router.get('/users/:id/avatar',async (req,res)=>{
    const id=req.params.id    
    try{
        const user=await User.findById(id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(error){
        res.status(404).send()
    }
})
module.exports=router