window.addEventListener('DOMContentLoaded', ()=>{
    const paymentMethod     = document.querySelector('#l-paymentMethod'); 
    const add_fund          = document.querySelector('#add_fund'); 
    const amount            = document.querySelector('#account_amount');   
    const voucher_div       = document.querySelector('#by_voucher');
    const remember_card      = document.getElementById('remember_card');
    const processing_fee_div       = document.querySelector('#processing-fee-div');
    if (amount) {
        amount.addEventListener('keyup',()=>{ 
            var newamount = amount.value.replaceAll(/[-e]/g,'');
            amount.value = newamount;  
            if (amount.value !="") {
                
                     feeProcessing();            
     
            } 
            else{
                processing_fee_div.classList.add('d-none') 
            }    
        }); 
    }
    
    if (paymentMethod) {
        dataValidation();
    }


    function dataValidation(){
        paymentMethod.addEventListener('change',()=>{
            switch (paymentMethod.value) {
                case "voucher": 
                    // voucher_div.classList.remove('d-none');                
                    // voucher_div.classList.add('show');
                    processing_fee_div.classList.add('d-none')  
                    console.log(paymentMethod.value);
                    break;
                case "new": 
                    if (amount.value !="") {
                        processing_fee_div.classList.remove('d-none')
                    }
  
                    remember_card.classList.remove('d-none')
                    remember_card.classList.add('show')
                    // voucher_div.classList.add('d-none');                
                    // voucher_div.classList.remove('show');
                    console.log("Yes")   
                    break;
                case "old": 
                    if (amount.value !="") {
                        processing_fee_div.classList.remove('d-none')  
                    }
                   
                    break;
                case "": 
                    processing_fee_div.classList.add('d-none')  
                   
                    break;
            
                default:    
                    // voucher_div.classList.add('d-none');                
                    // voucher_div.classList.remove('show'); 
                    processing_fee_div.classList.add('d-none')           
                    remember_card.classList.add('d-none')
                    remember_card.classList.remove('show')
                 break;
            }
        }); 
    }

    async function feeProcessing(){
        
        const processing_fee_div       = document.querySelector('#processing-fee-div');
        const processing_fee      = document.querySelector('#processing-fee');
        const token                 = document.querySelector('input[name="_token"]');
        var payload = {
            _token:token.value,
            amount:amount.value

        }

        var url = "/account/feeProcessing";

        await fetch(url, {
            method:"POST",
            mode:"cors",
            cache:"no-cache",
            credentials:"same-origin",
            headers:{
                "Content-Type":"application/json",
                'X-CSRF-TOKEN':token.value,
            },
            body: JSON.stringify(payload)
        })
        .then((response)=>response.json())
        .then(response=>{ 
            if (response.apply_fee == true) {
                processing_fee_div.classList.remove('d-none')  
                processing_fee.innerHTML = '₦'+numeral(response.fee).format('0,0.00');
            }
            // console.log(response.amount);                      
            return response;
        })
        .catch((error)=>{
       
        }) 

    }
  
  
    if (add_fund) {
        add_fund.addEventListener('click',validateForm);        
    }

});

    function validateForm() {
        
        const amount               = document.querySelector('#account_amount');
        var paymentMethod          = document.querySelector('#l-paymentMethod');
        var feedback               = document.querySelector('.feedback');
        const voucher_pin          = document.querySelector('#l-voucher_pin'); 
        const minimum_amount       = document.querySelector('#minimum_amount');          
        const voucher_div           = document.querySelector('#by_voucher');

        if(amount.value == ""){
            amount.style.borderColor = "red";
            toastr.error('How much do you want to add?', 'Divi - Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                
            setTimeout(() => {
                feedback.innerHTML = " ";
                amount.style.borderColor = "#DFE3E7";
            }, 5000);
            return
        }
        
        if (parseFloat(amount.value.replace(',','')) < parseFloat(minimum_amount.value)) {
            amount.style.borderColor = "red";
            toastr.error('Minimum amount is ₦'+numeral(minimum_amount.value).format('0,0.00'), 'Divi - Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                
            setTimeout(() => {
                feedback.innerHTML = " ";
                amount.style.borderColor = "#DFE3E7";
            }, 5000);

            return 
        }

        
        if(paymentMethod.value ==""){
            paymentMethod.style.borderColor = "red";
            toastr.error('Select payment method. ', 'Divi - Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            
                
            setTimeout(() => {
                feedback.innerHTML = " ";
                paymentMethod.style.borderColor = "#DFE3E7";
            }, 5000);
            return 
        }
        if(paymentMethod.value == "voucher" && voucher_pin.value==""){
            paymentMethod.style.borderColor = "red";
            voucher_div.classList.remove('d-none');                
            voucher_div.classList.add('show');
    
            toastr.error('Check your voucher PIN.', 'Divi -Add', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                
            setTimeout(() => {
                feedback.innerHTML = " ";
                paymentMethod.style.borderColor = "#DFE3E7";
            }, 5000);
            return 
        }
        validateAccountDeposit();
        // makePayment();
        
    }


    async function validateAccountDeposit(){
        let channel     = document.getElementById('l-paymentMethod');
        let amount 	    = document.querySelector('#account_amount');
        const paymentMethod     = document.querySelector('#l-paymentMethod');
        const token                 = document.querySelector('input[name="_token"]');
  
        var add_fund                = document.querySelector('#add_fund');

        var payload = {
            _token:token.value,
            amount:amount.value,
            paymentMethod:paymentMethod.value
        }

        var url = "/account/validateAccountDeposit";

        await fetch(url, {
            method:"POST",
            mode:"cors",
            cache:"no-cache",
            credentials:"same-origin",
            headers:{
                "Content-Type":"application/json",
                'X-CSRF-TOKEN':token.value,
            },
            body: JSON.stringify(payload)
        })
        .then((response)=>response.json())
        .then(response=>{                        
            if(response.status == 'success'){ 
                // console.log(response.data.amount);
                document.querySelector('#processing-fee').innerHTML = '₦'+numeral(response.data.fee).format('0,0.00');
                const mmessage = response.message;
                add_fund.innerHTML = mmessage.charAt(0).toUpperCase()+mmessage.slice(1)+'...';
                // add_fund.attributes.disabled = true;  
                makePayment(response.data.amount);                
            }

            else{
                add_fund.innerHTML = "Add now";
                toastr.error(response.message, 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                  
                add_fund.disabled = false;  

            }
        })
        .catch((error)=>{
            toastr.error('Something went wrong.', 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                // console.log(error);  
            add_fund.innerHTML = "Add now";
            add_fund.disabled = false;  
            setTimeout(() => {
                feedback.innerHTML = " ";
            }, 3000); 
        }) 
    }

    function makePayment(amount_fee){
        let channel     = document.getElementById('l-paymentMethod');
        let amount 	    = document.querySelector('#account_amount');
        const paymentMethod     = document.querySelector('#l-paymentMethod');
        const firstname             = document.querySelector('#account_firstname').value; 
        const lastname              = document.querySelector('#account_lastname').value;
        const email                 = document.querySelector('#account_email').value; 
        const phone                 = document.querySelector('#account_phone').value; 
        const wallet                = document.querySelector('#account_wallet').value; 
        const user_id               = document.querySelector('#account_user_id').value; 
        const voucher_pin           = document.querySelector('#l-voucher_pin');  
        const payment_vendor        = document.querySelector('#payment_vendor').value;
        const currency              = document.querySelector('#currency').value; 
        var feedback                = document.querySelector('#feedback');
        const remember              = document.querySelector('#remember-card'); 
        var add_fund                = document.querySelector('#add_fund');

       
        add_fund.innerHTML = ` <span class='bx bx-radio-circle bx-burst align-middle bx-sm'></span> Processings...`;
        add_fund.disabled = true;
        switch (channel.value) {
            case "new": 
            // console.log(amount_fee);
                payWithCard(amount_fee,currency,payment_vendor,wallet,email,firstname,lastname,phone,remember);    
                break;
            case "old": 
            // console.log(amount_fee);   
                chargeBack(user_id,amount_fee,currency,payment_vendor,feedback);    
                break;
        
            case "voucher":                                
                fundAccountWithVoucher(user_id,amount.value.replaceAll(/â‚¦|,/g,''),voucher_pin.value,paymentMethod,feedback)
                break;
        
            default:  
            // console.log(amount_fee);            
            payWithCard(amount_fee,currency,payment_vendor,wallet,email,firstname,lastname,phone,remember);    
                break;
        }
        
    }


    function payWithCard(amount,currency,payment_vendor,wallet,email,firstname,lastname,phone,remember) {
        
        switch(payment_vendor){
            case "flutterwave":
                payWithFlutterWave(amount,currency,payment_vendor,wallet,email,firstname,lastname,remember);
                break;
            case "paystack":
                payWithPayStack(amount,currency,payment_vendor,wallet,email,firstname,lastname,phone,remember);
                break;
            case "seerbit":
                payWithSeerBit(amount,wallet,email,firstname,lastname,phone,wallet,remember);
                break;
            default:
                payWithFlutterWave(amount,currency,payment_vendor,wallet,email,firstname,lastname,phone,wallet,remember);
                break;
        }
    }

    function payWithFlutterWave(amount,currency,payment_vendor,wallet,email,firstname,lastname,wallet,remember) {
        FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-5863b694bee35fdb3d671f81d7a611c4-X",
        tx_ref: "RX1",
        amount: amount,
        currency: currency,
        payment_options: " ",
    
        meta: {
            consumer_id: wallet,
        },
        customer: {
            email: email,
            name: firstname+' '+lastname,
        },
        callback: function (data) {
        
            queryPassed(amount,currency,payment_vendor,remember,data.transaction_id);  
    
            // console.log(data);
        },
        onclose: function() {
            
        },
        customizations: {
            title: "Fund wallet "+wallet,
            description: "Funding wallet",
            logo: "http://solomonhills.com/img/solomon png favicon.png",
        },
        });
    }




    function payWithPayStack(amount,currency,payment_vendor,wallet,email,firstname,lastname,phone,remember){
     
        let divi_amount 	    = document.querySelector('#account_amount');
        var handler = PaystackPop.setup({
            key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b71',
            email: email,
            amount: amount*100,
            currency: currency,
            firstname: firstname,
            lastname: lastname,
            // channels: ['card'],
            metadata: {
                
                name: firstname+' '+lastname,
                wallet: wallet,
                product: 'divi'					
             
            },
            callback: function(response){
            
            queryPassed(divi_amount.value,currency,payment_vendor,remember,response.reference);
        },
            onClose: function(){
                add_fund.innerHTML = "Add now";
                add_fund.disabled = false;
        }
        });

        handler.openIframe();   
    }


    function payWithSeerBit(amount,account_id,email,firstname,lastname,phone,remember,wallet){

        var handler = PaystackPop.setup({
            key: 'pk_live_ab5c8982b16c9b10c27bcdc348db2fc64d1c8b72',
            email: email,
            amount: amount*100,
            currency: 'NGN',
            firstname: firstname,
            lastname: lastname,
            lastname: phone,
            // channels: ['bank','card'],
            metadata: {
            custom_fields: [
                {
                    name: firstname+' '+lastname,
                    wallet: wallet,
                    product: 'divi'						
                }
            ]
        },
            callback: function(response){

            queryPassed(amount,account_id,remember,response.reference);
        },
            onClose: function(){
                add_fund.innerHTML = "Add now";
        }
        });
        handler.openIframe();   
    }


    async function queryPassed(amount,currency,payment_vendor,remember,reference){
        var feedback               = document.querySelector('.feedback');
        var add_fund               = document.querySelector('.add_fund');

        // console.log(remember.checked)
        //checkout__close hide-xs
        let closecard = document.querySelector('.checkout__close');
        var token     = document.querySelector('input[name="_token"]');   

        
        switch(payment_vendor){
            case "flutterwave":
                url = "/account/verifyPayment";
                break;
            case "paystack":
            url = "/account/transactionVerification";
            break;
            case "seerbit":
                url = "/account/transactionVerification";
                break;
            default:
                url = "/account/transactionVerification";
                break;
        } 

        var payload = { 
            _token: token.value,
            amount: amount,
            currency:currency,
            reference:reference, 
            remember:remember.checked         
        };
        
        // console.log(JSON.stringify(payload));

        await fetch(url, {
            method:"POST",
            mode:"cors",
            cache:"no-cache",
            credentials:"same-origin",
            headers:{
                "Content-Type":"application/json",
                'X-CSRF-TOKEN':token.value,
            },
            body: JSON.stringify(payload)
        })
        .then((response)=>response.json())
        .then(response=>{                        
            if(response.status == 'success'){ 
                document.querySelector('#account_amount').value = "";
                add_fund.innerHTML = "Add now";
                toastr.info(response.message, 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                add_fund.disabled = false;                     
                setTimeout(function() {
                window.location.reload();
                }, 1000);
            }

            else{
                add_fund.innerHTML = "Add now";
                toastr.error(response.message, 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                  
                add_fund.disabled = false;  
                setTimeout(() => {
                        feedback.innerHTML = " ";
                    }, 2500);
            }
        })
        .catch((error)=>{
            toastr.error('Something went wrong.', 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                   
            add_fund.innerHTML = "Add now";
            add_fund.disabled = false;  
            setTimeout(() => {
                feedback.innerHTML = " ";
            }, 3000); 
        })
    }

    
    async function chargeBack(user_id,amount,currency,payment_vendor,feedback){
        let divi_amount 	    = document.querySelector('#account_amount');
        var feedback               = document.querySelector('.feedback');
        var add_fund               = document.querySelector('.add_fund');
        // let amount 	    = document.querySelector('#account_amount');
        var token                  = document.querySelector('input[name="_token"]').value;  
        let url                    = "/account/accountChargeBack";

        switch(payment_vendor){
            case "flutterwave":
                url = "/account/chargeWithToken";
                break;
            case "paystack":
            url = "/account/accountChargeBack";
            break;
            case "seerbit":
                url = "/account/accountChargeBack";
                break;
            default:
                url = "/account/accountChargeBack";
                break;
        }

        add_fund.innerHTML = `<span class='bx bx-radio-circle bx-burst bx-sm align-middle'></span>  Processing...`;
        var params = {
            _token:token,
            user_id:user_id,
            amount:amount,
            divi_amount:divi_amount.value,
            currency:currency
        };



        await fetch(url, {
            method:"POST",
            mode:"cors",
            cache:"no-cache",
            credentials:"same-origin",
            headers:{
                "Content-Type":"application/json",
                'X-CSRF-TOKEN':token.value,
            },
            body: JSON.stringify(params)
        })
        .then((response)=>response.json())
        .then(response=>{                        
            if(response.status == 'success'){ 
                document.querySelector('#account_amount').value = "";
                add_fund.innerHTML = "Add now";
                toastr.info(response.message, 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                add_fund.disabled = false;                     
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            }

            else{
                add_fund.innerHTML = "Add now";
                toastr.error(response.message, 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                  
                add_fund.disabled = false;  
                setTimeout(() => {
                        feedback.innerHTML = " ";
                    }, 2500);
            }
        })
        .catch((error)=>{
            toastr.error('Something went wrong.', 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            // console.log(error);    
            add_fund.innerHTML = "Add now";
            add_fund.disabled = false;  
            setTimeout(() => {
                feedback.innerHTML = " ";
            }, 3000); 
        })

    }

    function fundAccountWithVoucher(user_id,amount,voucher_pin,paymentMethod,feedback){
        var token  = document.querySelector('input[name="_token"]').value;          
        const voucher_div       = document.querySelector('#by_voucher');        
        var params = { 
            _token: token,
            user_id:user_id,
            amount:amount,
            voucher_pin:voucher_pin     
        };

        axios.post('/account/fundAccountWithVoucher', params)
        .then(function (response) {
            const req = response.data;
            // console.log(req);
            if(req.error == false || req.error == "false" ){  
                toastr.info(req.message, 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });                  
                add_fund.innerHTML = "Add now"; 
                add_fund.disabled = false;                
                setTimeout(function() {
                    feedback.innerHTML ="";
                    window.location.reload()
                }, 3000);
            }
            else{
                if ( paymentMethod.value == "voucher") {                           
                    voucher_div.style.display= "block";
                }
                toastr.error(req.message, 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
                 
                add_fund.innerHTML = "Add now";
                add_fund.disabled = false;                
            }
        })
        .catch(function (error) {
            // console.log(error);
            toastr.info('Something went wrong.', 'Divi-Add money', { positionClass: 'toast-top-right', containerId: 'toast-top-right' });
            add_fund.disabled = false;    
            add_fund.innerHTML = "Add now";
          
        });
    }

    async function postRequest(url='', data={}){
        const response = await fetch(url,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        });
        return response.json();
    }


