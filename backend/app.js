import express from "express";
import cors from "cors";
import { db, auth, adminConfigured } from "./firebase.js";
import { ADMIN_CONFIG } from "./admin-config.js";

const app = express();
app.use(cors());
app.use(express.json());

async function verifyToken(req,res,next){
  if (!adminConfigured || !auth) return res.status(503).json({error:"Firebase Admin non configuré. Définissez FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY."});
  const token = req.headers.authorization?.split("Bearer ")[1];
  if(!token) return res.status(401).json({error:"Token manquant"});
  try{ req.user = await auth.verifyIdToken(token); next(); }
  catch{ return res.status(401).json({error:"Token invalide"}); }
}

app.get("/api",(req,res)=>res.json({app:"GENESIX",project:"starlink-investit",status:"OK"}));

app.post("/api/auth/register", async (req,res)=>{
  if (!adminConfigured || !auth || !db) return res.status(503).json({error:"Firebase Admin non configuré. Utilisez l'inscription Firebase côté application ou configurez les variables de service."});
  const {name,email,password,phone,refBy}=req.body;
  try{
    const user = await auth.createUser({email,password,displayName:name});
    await db.collection("users").doc(user.uid).set({
      name,email,phone:phone||"",points:ADMIN_CONFIG.welcomePoints,
      refBy:refBy||null,photo:"",status:"Salut, je suis sur GENESIX",createdAt:new Date()
    });
    if(refBy && refBy!==user.uid){
      const r=db.collection("users").doc(refBy); const s=await r.get();
      if(s.exists) await r.update({points:(s.data().points||0)+50});
    }
    res.json({success:true,uid:user.uid});
  }catch(e){ res.status(400).json({error:e.message}); }
});

app.get("/api/users",verifyToken, async (req,res)=>{
  const snap=await db.collection("users").limit(50).get();
  res.json(snap.docs.map(d=>({id:d.id,...d.data()})));
});

app.get("/api/chats",verifyToken, async (req,res)=>{
  const snap=await db.collection("chats").where("members","array-contains",req.user.uid).orderBy("lastMessageTime","desc").get();
  res.json(snap.docs.map(d=>({id:d.id,...d.data()})));
});

app.post("/api/chats",verifyToken, async (req,res)=>{
  const {otherUserId,groupName,members}=req.body;
  const mem = groupName ? [req.user.uid,...(members||[])] : [req.user.uid,otherUserId];
  const doc=await db.collection("chats").add({members:mem,type:groupName?"groupe":"prive",groupName:groupName||"",lastMessage:"",lastMessageTime:new Date(),createdAt:new Date()});
  res.json({id:doc.id});
});

app.get("/api/chats/:id/messages",verifyToken, async (req,res)=>{
  const snap=await db.collection("chats").doc(req.params.id).collection("messages").orderBy("createdAt","asc").limit(200).get();
  res.json(snap.docs.map(d=>({id:d.id,...d.data()})));
});

app.post("/api/chats/:id/messages",verifyToken, async (req,res)=>{
  const {text}=req.body;
  await db.collection("chats").doc(req.params.id).collection("messages").add({senderId:req.user.uid,text,type:"texte",createdAt:new Date(),seen:false});
  await db.collection("chats").doc(req.params.id).update({lastMessage:text,lastMessageTime:new Date()});
  const uRef=db.collection("users").doc(req.user.uid); const u=await uRef.get();
  if(u.exists) await uRef.update({points:(u.data().points||0)+1});
  res.json({success:true});
});

export default app;
