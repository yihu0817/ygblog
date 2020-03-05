let picpath = 'e:\\yuguoxy\\教学\\03web前端\\new课件\\CH04-NODEJS\\CH03-Koa2框架\\案例\\ygblog\\public\\upload\\upload_78b91c876b68100d97ee15d1212391e1.jpg';
let index = picpath.lastIndexOf('\\');
console.log(index);

let strpath = picpath.substring(index+1);
console.log(strpath);