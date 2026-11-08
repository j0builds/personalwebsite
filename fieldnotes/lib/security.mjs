import {createHmac,createHash,timingSafeEqual,randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';
export const COOKIE='__Host-fieldnotes';
export function settings(){
 const {OWNER_ACCESS_HASH,SESSION_SECRET,DATA_ENCRYPTION_KEY}=process.env;
 if(!/^[a-f0-9]{64}$/.test(OWNER_ACCESS_HASH||'')||!SESSION_SECRET||SESSION_SECRET.length<43||!/^[a-f0-9]{64}$/.test(DATA_ENCRYPTION_KEY||''))throw Error('AUTH_NOT_CONFIGURED');
 return {hash:OWNER_ACCESS_HASH,session:SESSION_SECRET,key:Buffer.from(DATA_ENCRYPTION_KEY,'hex')};
}
const equal=(a,b)=>typeof a==='string'&&typeof b==='string'&&a.length===b.length&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
export function validKey(key){return typeof key==='string'&&key.length<=200&&equal(createHash('sha256').update(key).digest('hex'),settings().hash);}
export function issueSession(now=Date.now()){const payload=Buffer.from(JSON.stringify({owner:true,expires:now+8*3600_000,nonce:randomBytes(16).toString('hex')})).toString('base64url');return payload+'.'+createHmac('sha256',settings().session).update(payload).digest('base64url');}
export function validSession(token,now=Date.now()){
 if(typeof token!=='string'||token.length>1000)return false;
 const [payload,sig,...extra]=token.split('.');if(extra.length||!sig)return false;
 if(!equal(sig,createHmac('sha256',settings().session).update(payload).digest('base64url')))return false;
 try{const p=JSON.parse(Buffer.from(payload,'base64url'));return p.owner===true&&Number.isFinite(p.expires)&&p.expires>now&&p.expires<=now+8*3600_000;}catch{return false;}
}
export function sessionFrom(req){return (req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);}
export function sameOrigin(req){const protocol=process.env.VERCEL?'https':'http';return req.headers.origin===protocol+'://'+req.headers.host;}
export function seal(value){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',settings().key,iv);const bytes=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return JSON.stringify({v:1,iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),data:bytes.toString('base64')});}
export function unseal(value){const e=JSON.parse(value);if(e.v!==1)throw Error('Invalid encrypted record');const d=createDecipheriv('aes-256-gcm',settings().key,Buffer.from(e.iv,'base64'));d.setAuthTag(Buffer.from(e.tag,'base64'));return JSON.parse(Buffer.concat([d.update(Buffer.from(e.data,'base64')),d.final()]).toString('utf8'));}

export function validContextReader(req){
 const expected=process.env.CONTEXT_READ_TOKEN_HASH;
 if(!/^[a-f0-9]{64}$/.test(expected||''))return false;
 const header=req.headers.authorization||'';if(!header.startsWith('Bearer '))return false;
 const token=header.slice(7);return token.length<=200&&equal(createHash('sha256').update(token).digest('hex'),expected);
}
