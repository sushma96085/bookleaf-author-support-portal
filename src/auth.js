import jwt from 'jsonwebtoken';
export function authenticate(req,res,next){const token=(req.headers.authorization||'').replace(/^Bearer /,'');try{req.user=jwt.verify(token,process.env.JWT_SECRET);next()}catch{res.status(401).json({error:'Authentication required'})}}
export const requireRole=role=>(req,res,next)=>req.user.role===role?next():res.status(403).json({error:'Forbidden'});