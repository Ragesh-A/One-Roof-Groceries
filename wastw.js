
let form = document.getElementById('form')
let title = document.getElementById('title')
let closeBtn = document.getElementById('close-btn')
let alertBox = document.getElementById('alert-box')
let forgotBtn = document.getElementById('forgotBtn')
let passwordFeild = document.getElementById('password-feild')
let inputContainer = document.getElementById('input-container')
let formSubmit = document.getElementById('formSubmit')
let otpBtnWrap = document.getElementById('otpBtnWrap')
let verifyBtn = document.getElementById('verifyBtn')
let alertmessage = document.getElementById('alertmessage')
let signinPasswordInp = document.getElementById('password')
let signinEmailInp = document.getElementById('email')
let cancelBtn = document.getElementById('cancel-btn')
let linkswrap = document.getElementById('links-wrap')
let formInputs = document.querySelectorAll('.form-input')

//  BUTTON CREATION
let otpTimerScreen = document.createElement('p')
let resendOtpBtn = document.createElement('a')

linkswrap.appendChild(otpTimerScreen)
linkswrap.appendChild(resendOtpBtn)
otpTimerScreen.style.display = 'none'
resendOtpBtn.style.display = 'none'



var count = 0;
var messageCount = 0

//SIGNIN FORM VALIDATION
formSubmit.onclick = () => {

    let messageArray = []
    formInputs.forEach(element => {
        if (element.value == '') {
            messageArray.push(`${element.id} should not be empty`)
        } else if (element.id == 'email') {
            let emailvalidationResponse = validateEmail(element.value)
            if (!emailvalidationResponse) {
                messageArray.unshift('email should be valid');
            }
        } else if (element.id == 'password' && element.value.length < 7) {
            messageArray.push('password should be atleast 8 character')
        }
    })
    
    if (messageArray == '') {
        formSubmit.type = 'submit'
    }else{
        sendMessage(messageArray);
    }
}

//FORGOT PASSWORD CLICK
forgotBtn.onclick = () => {
    cancelBtn.href = '/account/signin'
    title.innerText = "Password reset"
    form.action = '/account/verifyOtp'
    passwordFeild.style.display = 'none'
    formSubmit.style.display = 'none'
    //Otp btn
    let otpBtn = document.createElement('input')

    otpBtn.setAttribute('type', "button")
    otpBtn.setAttribute('value', "get otp ")
    otpBtn.setAttribute('class', "btn confirm")
    otpBtn.setAttribute('id', "otpRequestBtn")
    otpBtn.setAttribute('onclick', "requestOtp()")
    otpBtnWrap.appendChild(otpBtn)
    forgotBtn.style.display = 'none'
    messageCount = 0
}
// get otp button clicked
function requestOtp() {
    let emailInp = document.getElementById('email')
    if(emailInp.value == ''){
      alertBox.style.display = 'flex' 
      alertmessage.innerText = "email should be empty"
      return;
    }
    
    if (validateEmail(emailInp.value)) {
        
            //div creation
            let otpDiv = document.createElement('div')
            otpDiv.setAttribute('class', 'input-feild')
            otpDiv.setAttribute('id', 'otpWrap')
            //label creation
            let otpLabel = document.createElement('label')
            otpLabel.setAttribute('for', 'otp')
            otpLabel.innerHTML = "otp";
            //input feild
            let otpInput = document.createElement('input')
            otpInput.setAttribute('type', 'number')
            otpInput.setAttribute('name', 'otp')
            otpInput.setAttribute('id', 'otp')
            otpInput.setAttribute('class', 'form-input')
            /*here*/
            getOtpMessage();
            /*here*/
            

    }
}



//SEND AN OTP













function getOtpMessage() {
    
    fetch('/api/getOtp', {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: signinEmailInp.value
        }),
        credentials: "include",
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        alertBox.style.display = 'flex'
        alertBox.style.backgroundColor = '#00ff2f27'
        alertBox.style.borderColor = 'green'
        alertmessage.innerText = data.message
        alertmessage.style.color = 'green'
        closeBtn.style.color = 'green'
        setTimeout(()=>{
            alertBox.style.display = 'none'
        }, 3000)

        if(data.message == 'otp send'){
            /*------------------------------------------------------*/
            //append
            inputContainer.appendChild(otpDiv)
            let otpContainer = document.getElementById('otpWrap')
            otpContainer.appendChild(otpLabel)
            otpContainer.appendChild(otpInput)
          
            runOtpTimer();
            //resend otp
            resendOtpBtn.onclick = () => {
                runOtpTimer()
                getOtpMessage();
            }
            //send otp
            let otpBtn = document.getElementById('otpRequestBtn')
            console.log(otpBtn)
            otpBtn.value = "submit"
            otpBtn.onclick = function () {
                let otpInp = document.getElementById('otp')
                console.log(otpInp.value);
                if (otpInp.value.length < 3) {
                    alertBox.style.display = 'flex'
                    alertmessage.innerText = 'Enter valid Otp'
                    alertmessage.style.color = 'red'
                } else {
                    otpBtn.type = 'submit'
                }
            }
            /*-------------------------------------------------------------*/
        }
    })
    .catch(err => console.log(err))
}























/* basis */

//email validation
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
// otp TIMER 
function runOtpTimer() {
  resendOtpBtn.style.display = 'none'
  let timer = 20
  let otpTimer = setInterval(() => {
      otpTimerScreen.style.display = 'flex'
      timer--
      otpTimerScreen.innerText = `resent otp with in ${timer}`
  }, 1000)

  setTimeout(() => {
      otpTimerScreen.style.display = 'none'
      resendOtpBtn.innerText = 'resent otp'
      resendOtpBtn.style.display = 'block'
      clearInterval(otpTimer)
  }, 30000);
}


//ERROR message
function sendMessage(message) {
  alertBox.style.display = 'flex'
  alertmessage.innerText = message[0]
  console.log(message);
}
closeBtn.addEventListener('click', () => {
    alertBox.style.display = 'none  '
})
