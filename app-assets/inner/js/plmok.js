window.addEventListener('DOMContentLoaded', ()=>{
    const savings_method    = document.querySelector('#savings_method');
    const paymentMethod     = document.querySelector('.paymentMethod');
    const voucher_div       = document.querySelector('.voucher_div'); 
    const _token = document.querySelector('input[name="_token"]').value;

    paymentMethod.addEventListener('change',()=>{
    
        if(paymentMethod.value=="voucher") {
            voucher_div.style.display= "block";
        }
        else {
            voucher_div.style.display= "none";
        }
    });             
});

function addMoney(user_id,savings_id){
    let amount 	            = document.querySelector('.savings_amount').value;            
    const firstname         = document.querySelector('.firstname').value; 
    const lastname          = document.querySelector('.lastname').value;
    const email             = document.querySelector('.email').value; 
    const phone             = document.querySelector('.phone').value; 
    const wallet            = document.querySelector('.wallet').value; 
    const minimum_amount    = document.querySelector('#minimum_amount').value; 
    const payment_vendor    = document.querySelector('#payment_vendor');
    var voucher_pin         = document.getElementById('voucher_pin').value;
    var paymentMethod       = document.getElementById('paymentMethod').value;
    var feedback            = document.querySelector('.feedback');
    
    if(isNaN(amount) || amount == ""){
        feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> Only numbers is allowed for the amount field.<a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`; 

        setTimeout(() => {
            feedback.innerHTML = " ";
        }, 5000);
        return
    }

    if(paymentMethod ==""){
        feedback.innerHTML =`<div class="alert alert-info mb-2 mt-2 alert-dismissible"> How do you want to add money to your bucket? Select from the options.<a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`; 
        
        setTimeout(() => {
            feedback.innerHTML = " ";
        }, 9000);
        return
    }


    if(amount == ""){
        feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> Type the amount you want to add to your bucket. <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`; 
        setTimeout(() => {
            feedback.innerHTML = " ";
        }, 5000);
        return
    }
    else if (parseFloat(amount) < parseFloat(minimum_amount)) {
       
        feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible"> The minimum amount you can save is ₦${numeral(minimum_amount).format('0,0.00')} <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a></div>`;

        setTimeout(() => {
            feedback.innerHTML = " ";
        }, 5000);
        return
    }
    else{
        switch (paymentMethod) {
            case "new":    
                payWithCard(payment_vendor,user_id,savings_id,amount,firstname,lastname,email,phone,wallet,feedback);
                break;
            case "old":    
                chargeBack(payment_vendor,user_id,savings_id,amount,feedback);
                break;
            case "wallet":  
                addToSavingsFromWallet(user_id,savings_id,amount,feedback);
                break;
            case "voucher":                                
                addToSavingsWithVoucher(user_id,savings_id,amount,voucher_pin,feedback);
                break;
        
            default:              
                payWithCard(payment_vendor,user_id,savings_id,amount,firstname,lastname,email,phone,wallet,feedback);
                break;
        }
    }
    
}

function payWithCard(payment_vendor,user_id,savings_id,amount,firstname,lastname,email,phone,wallet,feedback){
    
    switch(payment_vendor){
        case "flutterwave":
            addToSavingsWithFlutterWave(payment_vendor,user_id,savings_id,amount,firstname,lastname,email,phone,wallet,feedback);
            break;
        case "paystack":
            addToSavingsWithPaystack(payment_vendor,user_id,savings_id,amount,firstname,lastname,email,phone,wallet,feedback);
            break;

        default:
            addToSavingsWithPaystack(payment_vendor,user_id,savings_id,amount,firstname,lastname,email,phone,wallet,feedback);
            break;
    } 
}

function addToSavingsWithPaystack(payment_vendor,user_id,savings_id,amount,firstname,lastname,email,phone,wallet,feedback){
   
    var handler = PaystackPop.setup({
        key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71',
        email: email,
        amount: amount*100,
        currency: 'NGN',
        firstname: firstname,
        lastname: lastname,
        channels: ['card'],
        metadata: {        
            name: firstname+' '+lastname,
            wallet: wallet,
            product:'bucket',
            product_id:savings_id
      
        },
        callback: function(response){
            queryPassed(user_id,savings_id,amount,response.reference);  
    },
        onClose: function(){
            document.getElementById('add_fund').innerHTML = " Add money "; 
    }
    });
    handler.openIframe();   

}

function addToSavingsWithFlutterWave(payment_vendor,user_id,savings_id,amount,firstname,lastname,email,phone,wallet,feedback){
    //Logic here
}
            

function queryPassed(user_id,savings_id,amount,reference){
    var token          = document.querySelector('input[name="_token"]').value;       
    var params = { 
        _token: token,
        user_id:user_id,
        savings_id:savings_id,
        amount: amount,
        transactionRef:reference      
    };

    axios.post('/savings/addMoneyWithCard', params)
    .then(function (response) {
        const req = response.data;
        if(req.error == false ){  
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
            ${req.data}
            <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
            </div>`;   
            document.getElementById('add_fund').innerHTML = " Add money ";            
            setTimeout(function() {
            window.location.reload();
            }, 2000);
        }
        else{
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
            ${req.data}
            <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
            </div>`;              
            document.getElementById('add_fund').innerHTML = " Add money "; 
        }
    })
    .catch(function(error){
        document.getElementById('add_fund').innerHTML = " Add money "; 
        feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
           Something went wrong.
            <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
            </div>`; 
    });
    
}

function addToSavingsFromWallet(user_id,savings_id,amount,feedback){
    var token               = document.querySelector('input[name="_token"]').value;
    const add_fund_btn      = document.querySelector('.add_fund');  
    add_fund_btn.innerHTML = "<i>Processing...</i>";    
    var params = { 
        _token: token,
        user_id:user_id,
        savings_id: savings_id,
        amount:amount     
    };

    axios.post('/savings/addToSavingsFromWallet', params)
    .then(function (response) {
        const req = response.data;
        if(req.error == false ){  
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
            ${req.data}
            <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
            </div>`;              
            setTimeout(function() {
            window.location.reload();
            }, 2000);
            }
            else{
                document.getElementById('add_fund').innerHTML = " Add money "; 
                feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                ${req.data}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;              
                                      
            }
    })
    .catch(function(error){
        feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
               Something went wrong.
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;  
            add_fund_btn.innerHTML = "add Money";
            setTimeout(() => {
                feedback.innerHTML = " ";
            }, 5000);

    });
}

function addToSavingsWithVoucher(user_id,savings_id,amount,voucher_pin,feedback){
    const add_fund_btn          = document.querySelector('.add_fund');            
    const token                 = document.querySelector('input[name="_token"]').value;
    add_fund_btn.innerHTML      = "<i>Processing...</i>";
    var params = { 
        _token: token,
        user_id:user_id,
        savings_id: savings_id,
        amount:amount,
        voucher_pin:voucher_pin     
    };

    axios.post('/savings/addToSavingsWithVoucher', params)
    .then(function (response) {
        const req = response.data;
        if(req.error == false ){  
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
            ${req.data}
            <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
            </div>`;              
            setTimeout(function() {
            window.location.reload();
            }, 2000);
        }
        else{
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
            ${req.data}
            <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
            </div>`; 
            add_fund_btn.innerHTML = "add Money";
            setTimeout(() => {
                feedback.innerHTML = " ";
            }, 5000);                        
        }
    })
    .catch(function(error){
        feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
            Something went wrong
            <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
            </div>`; 
            add_fund_btn.innerHTML = "add Money";
            setTimeout(() => {
                feedback.innerHTML = " ";
            }, 5000);
    });
}     


function chargeBack(payment_vendor,user_id,savings_id,amount,feedback){
    const add_fund_btn          = document.querySelector('.add_fund');
    
    const token                 = document.querySelector('input[name="_token"]').value;
    add_fund_btn.innerHTML = "Processing...";
    
    let url                 = "/savings/addToSavingsChargeBack";

    switch(payment_vendor){
        case "flutterwave":
            url = "/savings/addToSavingsFlutterwaveChargeBack";
            break;
        case "paystack":
            url = "/savings/addToSavingsChargeBack";
        break;
        default:
            url = "/savings/addToSavingsChargeBack";
            break;
    }

    var params = { 
        _token: token,
        user_id:user_id,
        savings_id: savings_id,
        amount:amount     
    };
    axios.post(url, params)
    .then(function (response) {
        const req = response.data;
        if(req.error == false || req.error == "false"){
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                ${req.data}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;   
            add_fund_btn.innerHTML = "Add now";
            setTimeout(function() {
                window.location.reload();
            }, 2000);
        }
        else{
            feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
                ${req.data}
                <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
                </div>`;   
            add_fund_btn.innerHTML = "Add now";
            setTimeout(() => {
                feedback.innerHTML = " ";
            }, 5000);
        }
    })
    .catch(function(error){
        feedback.innerHTML = `<div class="alert alert-info mb-2 mt-2 alert-dismissible">
            Something went wrong
            <a href="#" class="close cursor-pointer" data-dismiss="alert" aria-label="close">&times;</a>
            </div>`; 
            add_fund_btn.innerHTML = "add Money";
            setTimeout(() => {
                feedback.innerHTML = " ";
            }, 5000);
    });
}
