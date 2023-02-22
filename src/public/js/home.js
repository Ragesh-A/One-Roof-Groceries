fetch('/cart-quantity')
.then(res=>res.json())
.then(data=>{
    console.log(data);
})
.catch(err=>{
    console.log(err);
});