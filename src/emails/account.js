const sgMail=require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail=async (email,name)=>{
    const message={
        to:email,
        from:'dhiraj30498@gmail.com',
        subject:'Thanks for joining in',
        text:'welcome to the app '+name+',.Let me know how you get along WITH THE app.'
        }
        try{
            await sgMail.send(message)
        }catch(error){
            console.log(error.response.body)
        }
}
const sendCancelEmail=async (email,name)=>{
    const message={
        to:email,
        from:'dhiraj30498@gmail.com',
        subject:'Sorry to se you go',
        text:'Hi '+name+',please let us know what we can do to let you connected.I hope to see you back soon.'
    }
    try{
        await sgMail.send(message)
    }catch(esendCancelEmailrror){
        console.log(error.response.body)
    }
}
module.exports={
    sendWelcomeEmail,
    sendCancelEmail
}