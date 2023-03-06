let form = document.getElementById('form');
    let labels = document.querySelectorAll('label');
    let editAddressBtn = document.getElementById('edit-address');
    let addressInputs = document.querySelectorAll('.address-inputs');
    let addressInputs2 = document.querySelectorAll('.address-inputs2');
    let checkoutBtn = document.getElementById('submitBtn');
    let messageWrap = document.getElementById('message-wrap');
    let errMessage = document.getElementById('messagevalue')
    let newAddress = document.getElementById('newAddress');
    let newaddressbtn = document.getElementById('newaddressbtn');
    let addrClose = document.getElementById('addr-close');
    let newAddressSubmit = document.getElementById('new-add-sub-btn');
    let errMess = document.getElementById('err-mes');
    let addrSlide = document.getElementById('addr-slide');
    let addrSlideBtn = document.getElementById('addr-slide-btn');
    let sliderClose = document.getElementById('slider-close');
    let selectionsBtns = document.querySelectorAll('.selection-btn');
    let couponCode = document.getElementById('c-code');
    let cBtn = document.getElementById('c-btn');
    let response = document.getElementById('server-res')
    let deleteAddr = document.querySelectorAll('.delete-addr')

    //MESSAGE WRAPPER
    messageWrap.style.display = 'none';

    //disable inputs
    editAddressBtn.onclick = () => {
      if (editAddressBtn.value == "use address") {
        editAddressBtn.value = "edit address"
      } else {

        editAddressBtn.value = "use address"
      }
      addressInputs.forEach(inputs => {
        if (inputs.readOnly) {
          inputs.readOnly = false;
        }
        else {
          inputs.readOnly = true;;
        }
      })
    }

    //CRATION OF VALIDATION MESSAGE
    checkoutBtn.onclick = () => {
      let messages = [];
      addressInputs.forEach(inputs => {
        if (inputs.value == '') {
          messages.push(inputs.labels[0].innerText);
        }
      })

      sendMessage(messages);
    }
    //DISPLAY MESSAGE  FUNCTION
    function sendMessage(messages) {
      if (messages != '') {
        messageWrap.style.display = 'block';
        errMessage.innerText = messages[0] + " should not be empty";
      } else {
        form.action = '/cart/buy/order';
        form.method = 'POST';
        messageWrap.style.display = 'none';
        errMessage.innerText = '';
        submitBtn.style.display = 'block';
        submitBtn.type = 'submit';

      }
    }

    newaddressbtn.onclick = function () {
      newAddress.classList.add('active');
    }
    addrClose.onclick = function () {
      newAddress.classList.remove('active');
    }

    addrSlideBtn.onclick = ()=>{
      addrSlide.classList.add('active');
    }
    sliderClose.onclick = function () {
      addrSlide.classList.remove('active');
    }

    //ADDRESS SELECTIONS
    for(let i=0; i<selectionsBtns.length; i++) {
      let addId;
      selectionsBtns[i].onclick = function(e){
        addId = this.id.split('-')[0];
        addrSlide.classList.remove('active');
        console.log(addId);
        getAddress(addId);

        
      }
      
    }
    

    newAddressSubmit.onclick = function () {
      let mess = [];
      addressInputs2.forEach( function(inputs){
       if(inputs.value == ''){
        mess.push(`${inputs.labels[0].innerText} should not be empty`);
      }
    });
    errMess.style.color = 'red';
      errMess.innerText = mess[0]
      if(mess.length  == 0){
        newAddressSubmit.type = 'submit';
      }
    }

    //GET ADDRESS
    function getAddress(id) {
      fetch(`/api/test-address/${id}`,{
        method: 'GET',
      })
    .then(res=>res.json())
    .then(data=>{
      addressInputs.forEach( inputs => {
      let field = inputs.id.substring(3);
        inputs.value = data.address[field];
      })
    })
    .catch(err=>{
      console.log(err);
    })
    }

    //COUPON CHECKASDASDAS
    cBtn.onclick = () => {
      if(couponCode.value != ''){
        let code = couponCode.value.toLowerCase();
        fetch(
          '/api/check-coupon',{
             method: 'post',
             headers: {
              'Content-Type': 'application/json'
             },
             body: JSON.stringify({
              code: code,
             })
            }
          )
        .then(res=> res.json())
        .then((data)=> {
          response.innerText = data.message;
        })
        .catch((err)=> console.log(err))
      }
    }

    let url = '/cart/buy/thankyou'

    //DELETE ADRESS 
    for (let i = 0; i < deleteAddr.length; i++) {
      deleteAddr[i].onclick = function(){
        
        let id = this.dataset.addrid
        fetch(`/api/delete-address/${id}`)
        .then(res=>{res.json()})
        .then((data)=>{
          addrSlide.classList.remove('active');
          window.location.reload();
          console.log(data);
        }).catch(err=>{
          console.log(err);
        })
      }
      
    }
