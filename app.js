const API = "/api";
export async function apiFetch(path, method="GET", body=null){
  const token=localStorage.getItem("genesix_token");
  const res=await fetch(API+path,{method,headers:{"Content-Type":"application/json",...(token?{Authorization:"Bearer "+token}:{})},body:body?JSON.stringify(body):null});
  return res.json();
}
